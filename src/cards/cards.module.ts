import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Character } from '../models/character.entity';
import { Navigation } from '../models/navigation.entity';
import { Supply } from '../models/supply.entity';
import { CardsService } from './cards.service';
import { UserModule } from 'src/user/user.module';
import { Player } from 'src/models/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Supply, Navigation, GameSupply, Player]),
    UserModule
    ],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
