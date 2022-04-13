import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Game } from '../models/game.entity';
import { GameService } from './game.service';
import { Supply } from '../models/supply.entity';
import { Player } from '../models/player.entity';
import { GameNavigation } from 'src/models/gameNavigation.entity';
import { Navigation } from 'src/models/navigation.entity';
import { Hand } from '../models/hand.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Game, GameSupply, Supply, Player, Hand, GameNavigation, Navigation])],
    providers: [GameService]
})
export class GameModule {}
