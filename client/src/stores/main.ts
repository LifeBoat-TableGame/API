import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import router from '../router';
import { useRoomStore } from './rooms';

const defaultSocket = io();
export const useMainStore: any = defineStore("mainStoreID", {
  state: () => ({
    activeRoomId: 0,
    token: '',
    isAdmin: false,
    selfId: -1,
    name: 'noname',
    socket: io('http://localhost:3000/'),
  }),
  getters: {
    getToken: (state) => {
      state.token;
    }
  },
  actions: {
    logOut() {
      console.log('logging out...')
      router.push('/login')
    },
    useToken(token: string) {
      this.token = token;
      console.log('using token', token)
      this.socket.disconnect();
      this.socket = io('http://localhost:3000/', { extraHeaders: { Authorization: token } });
      this.initListeners();
    },
    renameUser(name: string) {
      console.log(`rename: ${name}`);
      this.socket.emit('rename', name);
    },
    //сделать async renameConfirmed как-нибудь
    register(userName: string) {
      console.log(`register: ${userName}`);
      this.socket.emit('register');
    },
    createRoom(roomName: string) {
      console.log(`creating room: ${roomName}`);
      this.socket.emit('createRoom', roomName);
    },
    joinRoom(roomId: number) {
      console.log(`joining room: ${roomId}`);
      this.socket.emit('joinRoom', roomId);
    },
    leaveRoom(roomId: number) {
      console.log(`leaving room: ${roomId}`);
      this.socket.emit('leaveRoom', roomId);
      this.isAdmin=false;
      this.activeRoomId=0;
    },
    getRooms() {
      console.log('trying to get rooms...')
      this.socket.emit('getRooms');
    },
    destroysocket() {
      console.log('destroying game socket');
      this.socket.disconnect();
    },
    startGame() {
      console.log('starting game', this.activeRoomId);
      this.socket.emit('create');
    },
    getGameInfo(){
      this.socket.emit('getGameInfo'); 
    },
    pickSupply(name: string) {
      this.socket.emit('pickSupply', name);
    },
    getPlayerInfo(){
      this.socket.emit('getPlayerInfo');
    },
    initGameListeners() {
      console.log('listening to \'gameStarted\'')
      this.socket.on('gameStarted', (game) => {
        router.push('/game')
      });
    },
    initListeners() {
      console.log('listening to \'registered\'')
      this.socket.on('registered', (token: string, id: number) => {
        this.selfId = id;
        this.useToken(token);
      });
      console.log('listening to \'RoomCreated\'')
      this.socket.on('RoomCreated', (id: number) => {
        console.log(`room created with id: ${id}`);
        this.activeRoomId = id;
        this.isAdmin = true;
      });
      console.log('listening to \'gameStarted\'')
      this.socket.on('gameStarted', (game) => {
        router.push('/game')
      });
      console.log('listening to \'UserUpdated\'')
      this.socket.on('UserUpdated', (name: string) => {
        this.name = name;
      });
      console.log('listening to \'updateRooms\'')
      this.socket.on('updateRooms', (res) => {
        console.log(res);
        useRoomStore().updateRooms(res)
      });
      console.log('listening to \'userJoined\'')
      this.socket.on('userJoined', (id: number, username: string, lobby: number) => {
        if (id == this.selfId) {
          this.activeRoomId = lobby;
        }
        console.log(`User ${username} has joined!`);
      });

      this.socket.on('gameInfo', (game) => {
        console.log(game);
      });
      
      this.socket.on('playerInfo', (player) => {
        console.log(player);
      });

      this.socket.on('toChoose', (supplies) => {
        console.log(supplies);
      });
      this.socket.on('exception', (obj) => {
        console.log('!!!', obj);
      })
    }
  },
});