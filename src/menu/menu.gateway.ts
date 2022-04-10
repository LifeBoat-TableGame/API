import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from '../lobby/lobby.service';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../authentication/authentication.service';

@WebSocketGateway({namespace: '/menu'})
export class MenuGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(
    private lobbyService: LobbyService, 
    private userService: UserService, 
    private authService: AuthenticationService
  ) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('MenuGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
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
  @SubscribeMessage('createRoom')
  async handleMessage(client: Socket, name: string) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobbyId = await this.lobbyService.createLobby({creator: user, name: name});
    client.join(lobbyId.toString());
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', JSON.stringify(rooms));
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, id: number, password?: string) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobbyId = await this.lobbyService.joinLobby(user, id, password);
    client.join(lobbyId.toString());
    client.to(lobbyId.toString()).emit(`userJoined`, user.username);
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
