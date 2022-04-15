import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../models/character.entity';
import { Navigation } from '../models/navigation.entity';
import { Supply } from '../models/supply.entity';
import { CardsService } from './cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Supply, Navigation])],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
