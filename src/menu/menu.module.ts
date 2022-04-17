import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { LobbyModule } from '../lobby/lobby.module';
import { MenuService } from './menu.service';

@Module({
  imports: [LobbyModule, AuthenticationModule, UserModule],
  exports: [MenuService],
  providers: [MenuService]
})
export class MenuModule {}
