import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from 'src/models/character.entity';
import { Supply } from 'src/models/supply.entity';
import { CardsService } from './cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Supply])],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
