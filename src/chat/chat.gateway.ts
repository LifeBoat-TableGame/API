import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import { AuthenticationService } from '../authentication/authentication.service';
import { WsGuard } from '../authentication/wsguard';

@WebSocketGateway({namespace: '/chat'})
export class ChatGateway implements OnGatewayInit {

  constructor(private authService: AuthenticationService) {}

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
}
