import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';

@Module({
  providers: [CardsService]
})
export class CardsModule {}
