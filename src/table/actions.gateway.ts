import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { WsGuard } from '../authentication/wsguard';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { ActionsService } from './actions/actions.service';
import { GameService } from '../game/game.service';
import { GameState } from '../models/game.entity';
import { NotificationService } from './notification/notification.service';
import { TableService } from './table.service';

@WebSocketGateway()
export class ActionsGateway {
  constructor(
    private userService: UserService,
    private actionsService: ActionsService,
    private gameService: GameService,
    private notificationService: NotificationService,
    private tableService: TableService,
  ) {}
  
  @WebSocketServer() wss: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage('pickNavigation')
  async handlePickNavigation(client: Socket, id: number) {
      const token = client.handshake.headers.authorization;
      console.log(id);
      const user = await this.userService.getWithRelations(token);
      if(!user.player)
          throw new WsException('You must be in game');
      const p1 = this.userService.getPlayerRelations(user.player.id);
      const p2 =  this.gameService.getGameWithrelations(user.player.game.id);
      const player = await p1;
      const game = await p2;
      if(user.player.game.state != GameState.Picking)
          throw new WsException('Activity is not available during current phase');
      await this.actionsService.pickNavigation(player, game, id);
      const updatedGame = await this.gameService.getGameWithrelations(user.player.game.id);
      await this.notificationService.updateGame(updatedGame, user.lobby.id.toString(), this.wss);
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
      await this.tableService.openSupply(token, supplyName);
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

  @UseGuards(WsGuard)
  @SubscribeMessage('showChosenNavigation')
  async handleShowChosenNavigation(
    @ConnectedSocket() client: Socket 
  ){
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    if(!user.player) {
        throw new WsException('You must be in game');
    }
    const player = await this.userService.getPlayerRelations(user.player.id);
    const game = await this.gameService.getGameWithrelations(player.game.id);
    const chosenNavigation = game.chosenNavigationDeck;
    
    client.emit('shownChosenNavigation', chosenNavigation);

  }

  @UseGuards(WsGuard)
  @SubscribeMessage('pickChosenNavigation')
  async handlePickChosenNavigation(
    @ConnectedSocket() client: Socket,
    @MessageBody('navigationId') navigationId: number
  ){
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    if(!user.player) {
        throw new WsException('You must be in game');
    }
    const player = await this.userService.getPlayerRelations(user.player.id);
    const game = await this.gameService.getGameWithrelations(player.game.id);
    const nav = game.chosenNavigationDeck.find(nav => nav.navigationId == navigationId);
    if (!nav){
        throw new WsException('No such navigation in chosen navigation deck');
    };
    await this.actionsService.resolveNavigation(game, navigationId);
    

  }
}
