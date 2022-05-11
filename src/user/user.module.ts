import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../models/player.entity';
import { User } from '../models/user.entity';
import { FightService } from './fight/fight.service';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Player])],
    providers: [UserService, FightService],
    exports: [UserService, FightService],
})
export class UserModule {}
