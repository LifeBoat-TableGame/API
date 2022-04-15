import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Repository } from 'typeorm';
import { Game, GameState } from '../models/game.entity';
import { Lobby } from '../models/lobby.entity';
import { WsException } from '@nestjs/websockets';
import { User } from '../models/user.entity';
import { UserService } from '../user/user.service';
import { Hand } from '../models/hand.entity';
import { CardsService } from '../cards/cards.service';
import CreateGameDto from './dto/createGameDto';
import CreateGameSupplyDto from './dto/createGameSupplyDto';
import CreateGameNavigationDto from './dto/createGameNavigationDto';
import { GameNavigation } from '../models/gameNavigation.entity';

@Injectable()
export class GameService {
    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(CardsService) private cardsService: CardsService,
        @InjectRepository(GameSupply) private gameSupplyRepository: Repository<GameSupply>,
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(GameNavigation) private gameNavigationRepository: Repository<GameNavigation>,
    ) {}

    private readonly minimal: 4;

    async getGameWithrelations(id: number) {
        return await this.gameRepository
            .createQueryBuilder('game')
            .where("game.id = :id", {id: id})
            .leftJoinAndSelect('game.players', 'player')
            .getOne();
    }

    async createGame(game: CreateGameDto) {
        const newGame = this.gameRepository.create(game);
        return await this.gameRepository.save(newGame);
    }

    async createGameSupply(gameSupply: CreateGameSupplyDto) {
        const newItem = this.gameSupplyRepository.create(gameSupply);
        return await this.gameSupplyRepository.save(newItem);
    }

    async createGameNavigation(gameNavigation: CreateGameNavigationDto) {
        const newItem = this.gameNavigationRepository.create(gameNavigation);
        return await this.gameNavigationRepository.save(newItem);
    }

    async startGame(user: User, lobby: Lobby) {
        if(lobby.creator.id != user.id)
            throw new WsException('Permission denied');
        if(lobby.users.length < this.minimal)
            throw new WsException('Not enough players');
        
        const game = await this.createGame({state: GameState.Supplies});
        const characters = await this.cardsService.getRandomCharacters(lobby.users.length);
        const supplies = await this.cardsService.getAllSupplies();
        const navigations = await this.cardsService.getAllNavigations();
        const friendQueue = this.cardsService.shuffle(characters);
        const enemyQueue = this.cardsService.shuffle(characters);

        const playerPromise = Promise.all(lobby.users.map( async (user, index) => {
            await this.userService.createPlayer({
                user: user, 
                character: characters[index], 
                friendship: friendQueue[index], 
                enemy: enemyQueue[index],
                game: game
            });
        }));
        const supplyPromise = Promise.all(this.cardsService.shuffle(supplies).map( async (supply) => {
            await this.createGameSupply({
                gameId: game.id, 
                supplyName: supply.name
            });
        }));
        const navigationPromise = Promise.all(this.cardsService.shuffle(navigations).map( async (navigation) => {
            await this.createGameNavigation({
                gameId: game.id, 
                navigationId: navigation.id
            });
        }));
        await Promise.all([playerPromise, supplyPromise, navigationPromise]);
        return game.id;
    }
}
