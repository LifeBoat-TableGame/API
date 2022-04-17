import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';

@WebSocketGateway({namespace: '/game'})
export class GameGateway {
    constructor(
        private gameService: GameService, 
        private userService: UserService
    ) {}

    @WebSocketServer() wss: Server;

    @UseGuards(WsGuard)
    @SubscribeMessage('create')
    async handleCreate(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const gameId = await this.gameService.startGame(user, user.lobby);
        const game = await this.gameService.getGameWithrelations(gameId);
        this.wss.to(user.lobby.id.toString()).emit('gameStarted', game);
    }
}
