import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { LobbyService } from '../lobby/lobby.service';
import { NotificationService } from './notification/notification.service';
import { GameState } from '../models/game.entity';

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
        const supplies = await this.gameService.drawSupplies(game.players.length, game.id);
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

    @UseGuards(WsGuard)
    @SubscribeMessage('pickSupply')
    async handlePickSupply(client: Socket, supply: string) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        if(user.player.game.state != GameState.Supplies)
            throw new WsException('Activity is not available during current phase');
        const game = await this.gameService.getGameWithrelations(user.player.game.id);

        await this.gameService.pickSupply(supply, player, game);
        console.log(1);
        await this.gameService.gameTurn(game);
        console.log(4);
        const updated = await this.gameService.getGameWithrelations(user.player.game.id);
        // fetching player who will pick a supply
        const currentCharacter = updated.queue.find(character => character.order == updated.currentCharacterIndex).characterName;
        console.log(5);
        const currentPlayer =  updated.players.find(player => player.character.name == currentCharacter);
        console.log(6);
        const clients = await this.wss.in(user.lobby.id.toString()).fetchSockets();
        console.log(7);
        const currentClient = clients.find(client => 
            client.handshake.headers.authorization == currentPlayer.user.token
        );
        await this.notificationService.updateGame(updated, user.lobby.id.toString(), this.wss);
        console.log(9);
        const supplies = await this.gameService.getDrawnSupplies(updated.id);
        console.log(10);
        currentClient.emit('toChoose', supplies);
    }
}
