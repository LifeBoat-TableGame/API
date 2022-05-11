import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../models/game.entity';
import { GameNavigation } from '../models/gameNavigation.entity';
import { GameSupply } from '../models/gameSupply.entity';
import { GameService } from './game.service';

@Module({
  providers: [GameService],
  imports: [
    TypeOrmModule.forFeature([
      Game,
      GameSupply,
      GameNavigation
    ])
  ],
  exports: [GameService]
})
export class GameModule {}
