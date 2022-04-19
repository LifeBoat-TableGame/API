import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { LobbyService } from '../lobby/lobby.service';

@WebSocketGateway()
export class GameGateway {
    constructor(
        private lobbyService: LobbyService,
        private gameService: GameService, 
        private userService: UserService
    ) {}

    @WebSocketServer() wss: Server;

    @UseGuards(WsGuard)
    @SubscribeMessage('create')
    async handleCreate(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const lobby = await this.lobbyService.getWithRelations(user.lobby.id);
        const gameId = await this.gameService.startGame(user, lobby);
        const game = await this.gameService.getGameWithrelations(gameId);
        console.log(game);
        this.wss.to(user.lobby.id.toString()).emit('gameStarted', game);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('gameInfo')
    async handleGameInfo(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const game = await this.gameService.getGameWithrelations(user.player.game.id);
        client.emit('gameInfo', game);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('playerInfo')
    async handlePlayerInfo(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const player = await this.userService.getPlayerRelations(user.player.game.id);
        client.emit('playerInfo', player);
    }
}
