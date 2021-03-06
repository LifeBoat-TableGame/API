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
import { GameNavigation } from '../models/gameNavigation.entity';
import CreateCharacterQueueDto from './dto/createCharacterQueueDto';
import { CharacterQueue } from '../models/characterQueue.entity';
import { Player } from '../models/player.entity';
import { GameService } from '../game/game.service';
import { table } from 'console';

@Injectable()
export class TableService {
    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(CardsService) private cardsService: CardsService,
        @Inject(GameService) private gameService: GameService,
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>,
        @InjectRepository(Player) private playerRepository: Repository<Player>
        ) {}

    private readonly minimal: 4;


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
        await this.gameService.removeSupply(gameSupply.id);
        player.closedCards.push(gameSupply.supply);
        await this.userService.updatePlayer(player);
    }

    async pickNavigation(game: Game, navigation: GameNavigation) {
        await this.gameService.chooseNavigation(navigation, game);
        await this.cardsService.removeDrawnNavigation(game.id);
    }


    async startGame(user: User, lobby: Lobby) {
        if(lobby.creator.id != user.id)
            throw new WsException('Permission denied');
        if(lobby.users.length < this.minimal)
            throw new WsException('Not enough players');
        
        const game = await this.gameService.createGame({state: GameState.Supplies});
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
        const promise3 = Promise.all(navigations.map( async (navigation, index) => {
            await this.gameService.createGameNavigation({
                gameId: game.id,
                navigationId: navigation.id,
                order: index
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
        let supply = player.closedCards.find(supply => supply.name == supplyName);
        if (!supply){
            throw new WsException('Could not find a supply to open');
        }
        if (supply.name == "????????????"){
            throw new WsException("Can't open parasol, instead useSupply to do that");
        }
        player.closedCards.splice(player.closedCards.indexOf(supply), 1);
        player.openCards.push(supply);
        await this.playerRepository.save(player);
    }

    async calculateScore(gameid: number){
        const game = await this.gameService.getGameWithrelations(gameid);
        
        for (const player of game.players){
            let char = player.character;

            if (this.userService.isAlive(player)){
                player.score += char.strength;
                if(player.enemy == char){
                    player.score -= char.strength;
                }
            }

            let cards = player.closedCards;
            cards.concat(player.openCards);

            let jewelryCount = 0;
            for (const card of cards){
                if(card.name == "??????????????????"){
                    jewelryCount+=1;
                    continue;
                }

                if(card.name == "?????????????????? ??????????????"){
                    if(char.name == "????????"){
                        player.score += 2 * card.bonus;
                    } else {
                        player.score += card.bonus;
                    }
                    continue;
                }

                if(card.name == "?????????????? ??????????????"){
                    if(char.name == "????????"){
                        player.score += 2 * card.bonus;
                    } else {
                        player.score += card.bonus;
                    }
                    continue;
                }

                if(card.name == "?????????? ??????????"){
                    if(char.name == "??????????????"){
                        player.score += 2 * card.bonus;
                    } else {
                        player.score += card.bonus;
                    }
                    continue;
                }
            }

            if (char.name == "????????????"){
                if(jewelryCount == 1){
                    player.score += 2;
                } else if (jewelryCount == 2){
                    player.score += 8;
                } else if (jewelryCount == 3){
                    player.score += 16;
                }
            } else {
                if(jewelryCount == 1){
                    player.score += 1;
                } else if (jewelryCount == 2){
                    player.score += 4;
                } else if (jewelryCount == 3){
                    player.score += 8;
                }
            }
            
            let fplayer = game.players.find(fplayer => fplayer.character == player.friendship)
            if(this.userService.isAlive(fplayer)){
                player.score += fplayer.character.survival;
            }

            if (player.enemy == char){
                let dead = 0;
                for (const p of game.players){
                    if (p.character != char && p.character != player.friendship){
                        dead++;
                    }
                }
                player.score += dead * 3;
            } else {
                let eplayer =  game.players.find(eplayer => eplayer.character == player.enemy)
                if(!this.userService.isAlive(eplayer)){
                    player.score += eplayer.character.strength;
                }
            }
            
            await this.playerRepository.save(player);

        }
    }
}
