import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Repository } from 'typeorm';
import { Game } from '../models/game.entity';
import { Lobby } from '../models/lobby.entity';
import { WsException } from '@nestjs/websockets';
import { Player } from '../models/player.entity';

@Injectable()
export class GameService {
    constructor (
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(GameSupply) private gameSupplyRepository: Repository<GameSupply>,
        @InjectRepository(Player) private playerRepository: Repository<Player>
    ) {}

    private readonly minimal: 4;

}
