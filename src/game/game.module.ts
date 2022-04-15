import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Game } from '../models/game.entity';
import { GameService } from './game.service';
import { Supply } from '../models/supply.entity';
import { Player } from '../models/player.entity';
import { GameNavigation } from '../models/gameNavigation.entity';
import { Navigation } from '../models/navigation.entity';
import { Hand } from '../models/hand.entity';
import { UserModule } from '../user/user.module';
import { CardsModule } from '../cards/cards.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            GameSupply, 
            Game,
            Supply, 
            Player, 
            Hand, 
            GameNavigation, 
            Navigation
        ]),
        UserModule,
        CardsModule
    ],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}