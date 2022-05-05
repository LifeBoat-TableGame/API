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
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>,
        @InjectRepository(Player) private playerRepository: Repository<Player>
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
    async updateGameState(game: Game, newState: GameState) {
        await this.gameRepository.update({id: game.id}, {
            state: newState,
        });
    }

    async createGameNavigation(gameNavigation: CreateGameNavigationDto) {
        const newItem = this.gameNavigationRepository.create(gameNavigation);
        return await this.gameNavigationRepository.save(newItem);
    }

    async createCharacterQueue(characterQueue: CreateCharacterQueueDto[]) {
        const newItem = this.characterQueueRepository.create(characterQueue);
        return await this.characterQueueRepository.save(newItem);
    }

    async pickSupply(supply: string, player: Player, game: Game) {
        if(game.state != GameState.Supplies)
            throw new WsException('Action is unavailable during this phase');
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(currentCharacter.characterName != player.character.name)
            throw new WsException('Not your turn');
        const gameSupply = await this.cardsService.getDrawnSupply(game.id, supply);
        if(gameSupply == null)
            throw new WsException('Supply is not available to pick.');
        await this.gameSupplyRepository.delete({id: gameSupply.id});
        player.closedCards.push(gameSupply.supply);
        await this.userService.updatePlayer(player);
    }

    async pickNavigation(game: Game, navigation: GameNavigation) {
        game.navigationDeck.push(navigation);
        return await this.gameRepository.save(game);
    }
    async gameTurn(game: Game) {
        let newIndex = game.currentCharacterIndex + 1;
        let newState = game.state;
        if(game.currentCharacterIndex == game.players.length - 1){
            newState = game.state == 1 ? 2 : 1;
            newIndex = 0;
        } 
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
        const friendQueue = this.cardsService.shuffle(characters).reverse();
        const enemyQueue = this.cardsService.shuffle(characters).reverse();

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
        const promise1 = this.createCharacterQueue(queue);
        const promise2 = Promise.all(supplies.map( async (supply) => {
            await this.cardsService.createGameSupply(Array(supply.amount).fill({
                gameId: game.id,
                supplyName: supply.name
            }));
        }));
        const promise3 = Promise.all(navigations.map( async (navigation) => {
            await this.createGameNavigation({
                gameId: game.id, 
                navigationId: navigation.id
            });
        }));
        await promise1;
        await promise2;
        await promise3;

        return game.id;
    }

    async openSupply(token: string, supplyName: string){
        const user = await this.userService.getWithRelations(token);
        console.log(user);
        const player = await this.userService.getPlayerRelations(user.player.id);
        const closed = player.closedCards;
        var toOpen;
        closed.forEach(function(value, index){
            if (value.name == supplyName){
                toOpen = value;
                closed.splice(index, 1);
                return;
            }
        });
        if(toOpen == null){
            throw new WsException('Could not find a supply to open');
        }
        player.closedCards = closed;
        player.openCards.push(toOpen);
        await this.playerRepository.save(player);
    }
}
