import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Lobby } from '../models/lobby.entity';
import { LobbyService } from './lobby.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby, User])],
  providers: [LobbyService],
  exports: [LobbyService]
})
export class LobbyModule {}
