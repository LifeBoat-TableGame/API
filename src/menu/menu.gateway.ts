import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from '../lobby/lobby.service';
import { WsGuard } from '../authentication/wsguard';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { MenuService } from './menu.service';

@WebSocketGateway()
export class MenuGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(
    private lobbyService: LobbyService, 
    private userService: UserService, 
    private authService: AuthenticationService,
    private menuService: MenuService,
  ) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('MenuGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: any) {
    const token = client.handshake.headers.authorization;
    this.userService.getWithRelations(token).then(user => {
      if(user && !user.hasOwnProperty('player'))
        this.userService.removeUser(user);
    });    
    this.logger.log('Client disconnected');
  }

  @SubscribeMessage('register')
  async handleRegister(client: Socket) {
    const user = await this.authService.register();
    client.emit('registered', user.token, user.id);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('rename')
  async handleRename(client: Socket, newName: string) {
    const token = client.handshake.headers.authorization;
    this.menuService.rename(token, newName);
    return {event: 'UserUpdated', data: newName};
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('createRoom')
  async handleMessage(client: Socket, name: string, password?: string){
    const token = client.handshake.headers.authorization;
    const lobbyId = await this.menuService.createRoom(token, name, password);
    client.join(lobbyId.toString());
    client.emit('RoomCreated', lobbyId);
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', rooms);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, id: number, password?: string) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    const lobbyId = await this.lobbyService.joinLobby(user, id, password);
    client.join(lobbyId.toString());
    this.wss.to(lobbyId.toString()).emit(`userJoined`, user.id, user.username, lobbyId);
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', rooms);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, id: number) {
    const token = client.handshake.headers.authorization;
    const user = await this.userService.getWithRelations(token);
    await this.lobbyService.leaveLobby(user, id);
    client.to(id.toString()).emit('userLeft', user.username, user.id);
    client.leave(id.toString());
    const rooms = await this.lobbyService.getLobbies();
    this.wss.emit('updateRooms', rooms);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getRooms')
  async handleGetRooms(client: Socket) {
    const rooms = await this.lobbyService.getLobbies();
    client.emit('updateRooms', rooms);
  }
}
