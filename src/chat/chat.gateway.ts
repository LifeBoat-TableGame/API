import { Logger, UseFilters, UseGuards, WsExceptionFilter } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import { CardsService } from '../cards/cards.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { WsGuard } from '../authentication/wsguard';

@WebSocketGateway({namespace: '/chat'})
export class ChatGateway implements OnGatewayInit {

  constructor(private authService: AuthenticationService, private cardsService: CardsService) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Initialized');
  }
  
  @SubscribeMessage('register')
  async handleRegister(client: Socket): Promise<WsResponse<string>> {
    const user = await this.authService.register();
    return {event: 'registered', data: user.token};
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('rename')
  async handleRename(client: Socket, newName: string) {
    const token = client.handshake.headers.authorization;
    const succeed = await this.authService.rename(token, newName);
    if(succeed)
      return {event: 'UserUpdated'};
    else return {event: 'Error'};
  }
  
  @UseGuards(WsGuard)
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient',text);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }
  
  @SubscribeMessage('getSupply')
  async handleGetSupply(@ConnectedSocket() client: Socket, @MessageBody() name: string) {
    const supply = await this.cardsService.getSupply(name);
    return {event: 'supplyInfo', data: JSON.stringify(supply)};
  }
}
