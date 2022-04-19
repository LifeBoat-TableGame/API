import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';

@Controller('token')
export class AppController {
    constructor(
        private authService: AuthenticationService,
    ) {}

    @Get()
    async token(){
        const user = await this.authService.register();
        return JSON.stringify({token: user.token, id: user.id});
    }
}
