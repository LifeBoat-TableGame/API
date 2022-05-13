import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, ConnectedSocket } from '@nestjs/websockets';
import { TableService } from './table.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { LobbyService } from '../lobby/lobby.service';
import { NotificationService } from './notification/notification.service';
import { GameState } from '../models/game.entity';
import { CardsService } from '../cards/cards.service';
import { ActionsService } from './actions/actions.service';
import { GameService } from '../game/game.service';
import { FightService } from './fight/fight.service';
import { FightRole } from '../models/player.entity';

@WebSocketGateway()
export class TableGateway {
    constructor(
        private lobbyService: LobbyService,
        private tableService: TableService,
        private gameService: GameService,
        private userService: UserService,
        private notificationService: NotificationService,
        private cardsService: CardsService,
        private actionsService: ActionsService,
        private fightService: FightService,
    ) {}

    @WebSocketServer() wss: Server;

    @UseGuards(WsGuard)
    @SubscribeMessage('create')
    async handleCreate(client: Socket) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        const lobby = await this.lobbyService.getWithRelations(user.lobby.id);
        const gameId = await this.tableService.startGame(user, lobby);
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

        await this.tableService.pickSupply(supply, player, game);
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
    @SubscribeMessage('chooseConflictSide')
    async handleChooseConflictSide(client: Socket, side: FightRole) {
        const token = client.handshake.headers.authorization;
        const user = await this.userService.getWithRelations(token);
        if(!user.player)
            throw new WsException('You must be in game');
        const player = await this.userService.getPlayerRelations(user.player.id);
        if(user.player.game.state != GameState.Fight)
            throw new WsException('Activity is not available during current phase');
        const game = await this.gameService.getGameWithrelations(user.player.game.id);
        if(side != FightRole.Neutral)
            await this.fightService.joinFight(player, side);
        const newGame = await this.gameService.getGameWithrelations(game.id);
        await this.fightService.fightTurn(newGame);
        await this.notificationService.updateGame(newGame, user.lobby.id.toString(), this.wss);
    }
}
