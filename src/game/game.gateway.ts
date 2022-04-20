import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { LobbyService } from '../lobby/lobby.service';
import { NotificationService } from './notification/notification.service';

@WebSocketGateway()
export class GameGateway {
    constructor(
        private lobbyService: LobbyService,
        private gameService: GameService, 
        private userService: UserService,
        private notificationService: NotificationService
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
        // fetching player who will pick a supply
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex).characterName;
        const currentPlayer =  game.players.find(player => player.character.name == currentCharacter);
        const clients = await this.wss.in(lobby.id.toString()).fetchSockets();
        const currentClient = clients.find(client => 
            client.handshake.headers.authorization == currentPlayer.user.token
        );

        this.wss.emit('gameStarted');
        await this.notificationService.updateGame(game, lobby.id.toString(), this.wss);
        const supplies = await this.gameService.drawSupplies(game.players.length);
        currentClient.emit('toChoose', supplies);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('getGameInfo')
    async handleGameInfo(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const game = await this.gameService.getGameWithrelations(user.player.game.id);
        this.notificationService.gameInfo(game, client);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('getPlayerInfo')
    async handlePlayerInfo(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const player = await this.userService.getPlayerRelations(user.player.id);
        client.emit('playerInfo', player);
    }
}
