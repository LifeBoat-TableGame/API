import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../models/game.entity';
import { GameNavigation } from '../models/gameNavigation.entity';
import { GameSupply } from '../models/gameSupply.entity';
import { GameService } from './game.service';
import { FightService } from './fight/fight.service';

@Module({
  providers: [GameService, FightService],
  imports: [
    TypeOrmModule.forFeature([
      Game,
      GameSupply,
      GameNavigation
    ])
  ],
  exports: [GameService, FightService]
})
export class GameModule {}
