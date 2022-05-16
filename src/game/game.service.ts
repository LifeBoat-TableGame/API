import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Repository } from 'typeorm';
import { Game, GameState } from '../models/game.entity';
import CreateGameDto from './dto/createGameDto';
import { GameNavigation } from '../models/gameNavigation.entity';
import CreateGameNavigationDto from './dto/createGameNavigationDto';
import { Dispute } from '../models/dispute.entity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(GameSupply) private gameSupplyRepository: Repository<GameSupply>,
        @InjectRepository(GameNavigation) private gameNavigationRepository: Repository<GameNavigation>,
    ) {}   

    
    async createGameNavigation(gameNavigation: CreateGameNavigationDto) {
        const newItem = this.gameNavigationRepository.create(gameNavigation);
        return await this.gameNavigationRepository.save(newItem);
    }

    async gameTurn(game: Game, state?: GameState) {
        let newIndex = game.currentCharacterIndex + 1;
        let newState = state ?? game.state;
        if(game.isLast){
            newState = game.state == 1 ? 2 : 1;
            newIndex = 0;
        } 
        await this.gameRepository.update({id: game.id}, {
            currentCharacterIndex: newIndex,
            state: newState
        });
    }

    async removeSupply(id: number) {
        await this.gameSupplyRepository.delete({id: id});
    }

    async chooseNavigation(navigation: GameNavigation, game: Game) {
        navigation.chosenIn = game;
        await this.gameNavigationRepository.save(navigation);
    }

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
                chosenNavigationDeck: {
                    navigation: true,
                    chosenIn: true
                },
            }
        });
        return game;
    }

    async createGame(game: CreateGameDto) {
        const newGame = this.gameRepository.create(game);
        return await this.gameRepository.save(newGame);
    }
    async updateGameState(game: Game, newState: GameState, newIndex?: number) {
        await this.gameRepository.update({id: game.id}, {
            state: newState,
            currentCharacterIndex: newIndex ?? game.currentCharacterIndex
        });
    }
}
