import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthenticationService } from './authentication.service';
import { WsGuard } from './wsguard';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthenticationService, WsGuard],
    exports: [WsGuard, AuthenticationService]
})
export class AuthenticationModule {}
