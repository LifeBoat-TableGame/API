import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { LobbyService } from '../lobby/lobby.service';
import { NotificationService } from './notification/notification.service';
import { GameState } from '../models/game.entity';
import { CardsService } from '../cards/cards.service';
import { ActionsService } from './actions/actions.service';

@WebSocketGateway()
export class GameGateway {
    constructor(
        private lobbyService: LobbyService,
        private gameService: GameService, 
        private userService: UserService,
        private notificationService: NotificationService,
        private cardsService: CardsService,
        private actionsService: ActionsService
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
        this.wss.emit('gameStarted');
        // fetching player who will pick a supply
        const supplies = await this.cardsService.drawSupplies(game.players.length, game.id);
        await this.notificationService.cardsToChoose(supplies, game, this.wss, lobby.id.toString());
        await this.notificationService.updateGame(game, lobby.id.toString(), this.wss);
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
        await this.gameService.gameTurn(game);
        const updated = await this.gameService.getGameWithrelations(user.player.game.id);
        // fetching player who will pick a supply
        const supplies = await this.cardsService.getDrawnSupplies(updated.id);
        await this.notificationService.cardsToChoose(supplies, updated, this.wss, user.lobby.id.toString())

        await this.notificationService.updateGame(updated, user.lobby.id.toString(), this.wss);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('getNavigation')
    async handleGetNavigation(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        if(user.player.game.state != GameState.Regular)
            throw new WsException('Activity is not available during current phase');
        const game = await this.gameService.getGameWithrelations(user.player.game.id);
        const navigations = await this.actionsService.row(player, game);
        client.emit('chooseNavigation', navigations);
    }
    
    @UseGuards(WsGuard)
    @SubscribeMessage('openSupply')
    async handleOpenSupply(client: Socket, supplyName: string){
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        if(user.player.game.state != GameState.Regular)
            throw new WsException('Activity is not available during current phase');
        await this.gameService.openSupply(token, supplyName);
        const updated = await this.gameService.getGameWithrelations(user.player.game.id);
        await this.notificationService.updateGame(updated, user.lobby.id.toString(), this.wss);
        client.emit('supplyOpened');
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('swap')
    async handleSwap(client: Socket, targetName: string) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        const game = await this.gameService.getGameWithrelations(user.player.game.id);
        await this.actionsService.requestSwap(player, game,  targetName);
        this.wss.to(user.lobby.id.toString()).emit('swapDispute', player.character.name, targetName);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('demandSupply')
    async handleDemandSupply(
        @ConnectedSocket() client: Socket, 
        @MessageBody('targetName') targetName: string,
        @MessageBody('supplyName') supplyName?: string
        ) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const req1 = this.userService.getPlayerRelations(user.player.id);
        const req2 = this.gameService.getGameWithrelations(user.player.game.id);
        const player = await req1;
        const game = await req2;
        if(supplyName) await this.actionsService.requestOpenSupply(player, game, targetName, supplyName);
        else await this.actionsService.requestClosedSupply(player, game,  targetName);
        this.wss.to(user.lobby.id.toString()).emit('demandDispute', player.character.name, targetName, supplyName);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('acceptDispute')
    async handleAcceptDispute(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        await this.actionsService.acceptDispute(player);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('declineDispute')
    async handleDeclineDispute(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        await this.actionsService.declineDispute(player);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('useSupply')
    async handleUseSupply(
        @ConnectedSocket() client: Socket, 
        @MessageBody('supplyName') supplyName: string, 
        @MessageBody('target') target: string
    ){
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player) {
            throw new WsException('You must be in game');
        }
        const player = await this.userService.getPlayerRelations(user.player.id);
        await this.actionsService.useSupply(player, supplyName, target);
        const updated = await this.gameService.getGameWithrelations(user.player.game.id);
        await this.notificationService.updateGame(updated, user.lobby.id.toString(), this.wss);
        client.emit('supplyUsed');
    }
    
}
