import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSupply } from '../models/gameSupply.entity';
import { Game } from '../models/game.entity';
import { TableService } from './table.service';
import { Supply } from '../models/supply.entity';
import { Player } from '../models/player.entity';
import { GameNavigation } from '../models/gameNavigation.entity';
import { Navigation } from '../models/navigation.entity';
import { UserModule } from '../user/user.module';
import { CardsModule } from '../cards/cards.module';
import { CharacterQueue } from '../models/characterQueue.entity';
import { LobbyModule } from '../lobby/lobby.module';
import { NotificationService } from './notification/notification.service';
import { ActionsService } from './actions/actions.service';
import { Dispute } from '../models/dispute.entity';
import { DisputeService } from './dispute/dispute.service';
import { GameModule } from '../game/game.module';
import { FightService } from './fight/fight.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            GameSupply, 
            Game,
            Supply, 
            Player,
            GameNavigation, 
            Navigation,
            CharacterQueue,
            Dispute
        ]),
        UserModule,
        CardsModule,
        LobbyModule,
        GameModule
    ],
    providers: [
        TableService, 
        NotificationService, 
        ActionsService, 
        DisputeService,
        FightService
    ],
    exports: [TableService, NotificationService, ActionsService, FightService]
})
export class TableModule {}
