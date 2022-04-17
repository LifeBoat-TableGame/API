import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticationService } from '../authentication/authentication.service';
import { LobbyService } from '../lobby/lobby.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MenuService {
    constructor(
        private lobbyService: LobbyService, 
        private userService: UserService, 
        private authService: AuthenticationService
    ) {}

    async rename(token: string, name: string) {
        const success = await this.authService.rename(token, name);
        if(!success) throw new WsException('Unable to change the username');
    }

    async createRoom(token: string, name: string, password?: string) {
        const user = await this.userService.getWithRelations(token);
        if(password) 
            return await this.lobbyService.createLobby({creator: user, name: name, password: password});
        else
            return await this.lobbyService.createLobby({creator: user, name: name});
    }
}
