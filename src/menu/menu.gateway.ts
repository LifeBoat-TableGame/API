import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from '../lobby/lobby.service';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';

@WebSocketGateway({namespace: '/menu'})
export class MenuGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(private lobbyService: LobbyService, private userService: UserService) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('MenuGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('createRoom')
  async handleMessage(client: Socket, name: string) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobby = await this.lobbyService.createLobby({creator: user, name: name});
    client.join(lobby.id.toString());
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', JSON.stringify(rooms));
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, id: number, password?: string) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobby = await this.lobbyService.joinLobby(user, id, password);
    client.join(lobby.id.toString());
    client.to(lobby.id.toString()).emit(`userJoined`, user.username);
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', JSON.stringify(rooms));
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, id: number) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobby = await this.lobbyService.leaveLobby(user, id);
    client.leave(id.toString());
    client.to(lobby.id.toString()).emit('userLeft', user.username);
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', JSON.stringify(rooms));
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getRooms')
  async handleGetRooms(client: Socket) {
    const rooms = await this.lobbyService.getLobbies();
    client.emit('Rooms', JSON.stringify(rooms));
  }
}
