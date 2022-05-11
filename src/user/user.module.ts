import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../models/player.entity';
import { User } from '../models/user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Player])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
