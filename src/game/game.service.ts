import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Repository } from 'typeorm';
import { Game, GameState } from '../models/game.entity';
import { Lobby } from '../models/lobby.entity';
import { WsException } from '@nestjs/websockets';
import { User } from '../models/user.entity';
import { UserService } from '../user/user.service';
import { CardsService } from '../cards/cards.service';
import CreateGameDto from './dto/createGameDto';
import CreateGameSupplyDto from './dto/createGameSupplyDto';
import CreateGameNavigationDto from './dto/createGameNavigationDto';
import { GameNavigation } from '../models/gameNavigation.entity';
import CreateCharacterQueueDto from './dto/createCharacterQueueDto';
import { CharacterQueue } from '../models/characterQueue.entity';
import { Player } from '../models/player.entity';

@Injectable()
export class GameService {
    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(CardsService) private cardsService: CardsService,
        @InjectRepository(GameSupply) private gameSupplyRepository: Repository<GameSupply>,
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(GameNavigation) private gameNavigationRepository: Repository<GameNavigation>,
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>
        ) {}

    private readonly minimal: 4;

    async getGameWithrelations(id: number) {
        const game = await this.gameRepository.findOne({
            where: { id: id },
            relations: {
                players: {
                    character: true,
                    openCards: true,
                    closedCards: true,
                    user: true,
                },
                queue: {
                    character: true,
                    game: true
                },
            }
        });
        return game;
    }

    async createGame(game: CreateGameDto) {
        const newGame = this.gameRepository.create(game);
        return await this.gameRepository.save(newGame);
    }

    async createGameSupply(gameSupply: CreateGameSupplyDto[]) {
        const newItem = this.gameSupplyRepository.create(gameSupply);
        return await this.gameSupplyRepository.save(newItem);
    }

    async createGameNavigation(gameNavigation: CreateGameNavigationDto) {
        const newItem = this.gameNavigationRepository.create(gameNavigation);
        return await this.gameNavigationRepository.save(newItem);
    }

    async createCharacterQueue(characterQueue: CreateCharacterQueueDto[]) {
        const newItem = this.characterQueueRepository.create(characterQueue);
        console.log(newItem);
        return await this.characterQueueRepository.save(newItem);
    }

    async drawSupplies(amount: number, gameId: number) {
        const selected = await this.gameSupplyRepository
        .createQueryBuilder("game_supply")
        .where("game_supply.picked is false AND game_supply.gameId = :gameId", {gameId: gameId})
        .orderBy("RANDOM()")
        .limit(amount)
        .getMany();
        selected.forEach(supply => supply.picked = true);
        return await this.gameSupplyRepository.save(selected)
    }
    async getDrawnSupplies(gameId: number) {
        return await this.gameSupplyRepository
        .createQueryBuilder("game_supply")
        .leftJoinAndSelect("game_supply.supply", "supply")
        .where("game_supply.picked AND game_supply.gameId = :gameId", {gameId: gameId})
        .getMany();
    }

    async pickSupply(supply: string, player: Player, game: Game) {
        if(game.state != GameState.Supplies)
            throw new WsException('Action is unavailable during this phase');

        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        console.log(currentCharacter);
        console.log(player.character);
        if(currentCharacter.characterName != player.character.name)
            throw new WsException('Not your turn');
        const gameSupply = await this.gameSupplyRepository.findOne({
            where: {
                supplyName: supply,
                gameId: game.id,
                picked: true
            },
            relations: {supply: true},
        });
        console.log('deleting...');
        console.log(gameSupply.id)
        const res = await this.gameSupplyRepository.delete({id: gameSupply.id});
        console.log('deleted', res);
        player.closedCards.push(gameSupply.supply);
        await this.userService.updatePlayer(player);
    }
    async gameTurn(game: Game) {
        console.log('2');
        let newIndex = game.currentCharacterIndex + 1;
        let newState = game.state;
        if(game.currentCharacterIndex == game.players.length - 1){
            newState = game.state == 1 ? 2 : 1;
            newIndex = 0;
        } 
        console.log(3);
        await this.gameRepository.update({id: game.id}, {
            currentCharacterIndex: newIndex,
            state: newState
        });
    }

    async startGame(user: User, lobby: Lobby) {
        if(lobby.creator.id != user.id)
            throw new WsException('Permission denied');
        if(lobby.users.length < this.minimal)
            throw new WsException('Not enough players');
        
        const game = await this.createGame({state: GameState.Supplies});
        const characters = await this.cardsService.getRandomCharacters(lobby.users.length);
        if(characters.length < lobby.users.length) 
            throw new WsException('Not enought characters.');
        const supplies = await this.cardsService.getAllSupplies();
        const navigations = await this.cardsService.getAllNavigations();
        const friendQueue = this.cardsService.shuffle(characters);
        const enemyQueue = this.cardsService.shuffle(characters);

        const queue = [];
        const sorted = characters.sort((a, b) => a.defaultOrder - b.defaultOrder)
        const players = lobby.users.map((user, index) => {
            queue.push({
                gameId: game.id,
                characterName: characters[index].name,
                order: sorted.indexOf(characters[index])
            });
            return {
                user: user, 
                character: characters[index], 
                friendship: friendQueue[index], 
                enemy: enemyQueue[index],
                game: game
            }
        });
        await this.userService.createPlayers(players);
        await this.createCharacterQueue(queue);
        await Promise.all(supplies.map( async (supply) => {
            await this.createGameSupply(Array(supply.amount).fill({
                gameId: game.id,
                supplyName: supply.name
            }));
        }));
        await Promise.all(navigations.map( async (navigation) => {
            await this.createGameNavigation({
                gameId: game.id, 
                navigationId: navigation.id
            });
        }));
        return game.id;
    }
}
