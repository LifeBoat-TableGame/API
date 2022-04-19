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
    menuSocket: io('http://localhost:3000/menu'),
    gameSocket: io('http://localhost:3000/menu'),
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
      this.menuSocket.disconnect();
      this.menuSocket = io('http://localhost:3000/menu', { extraHeaders: { Authorization: token } });
      this.initListeners();
    },
    renameUser(name: string) {
      console.log(`rename: ${name}`);
      this.menuSocket.emit('rename', name);
    },
    //сделать async renameConfirmed как-нибудь
    register(userName: string) {
      console.log(`register: ${userName}`);
      this.menuSocket.emit('register');
    },
    createRoom(roomName: string) {
      console.log(`creating room: ${roomName}`);
      this.menuSocket.emit('createRoom', roomName);
    },
    joinRoom(roomId: number) {
      console.log(`joining room: ${roomId}`);
      this.menuSocket.emit('joinRoom', roomId);
    },
    leaveRoom(roomId: number) {
      console.log(`leaving room: ${roomId}`);
      this.menuSocket.emit('leaveRoom', roomId);
      this.destroyGameSocket()
      this.isAdmin=false;
      this.activeRoomId=0;
    },
    getRooms() {
      console.log('trying to get rooms...')
      this.menuSocket.emit('getRooms');
    },
    initGameSocket() {
      this.destroyGameSocket();
      console.log('creating game socket with token', this.token)
      this.gameSocket = io('http://localhost:3000/game', { extraHeaders: { Authorization: this.token } });
      this.initGameListeners();
    },
    destroyGameSocket() {
      console.log('destroying game socket');
      this.gameSocket.disconnect();
    },
    startGame() {
      console.log('starting game', this.activeRoomId);
      this.gameSocket.emit('create');
    },
    initGameListeners() {
      console.log('listening to \'gameStarted\'')
      this.gameSocket.on('gameStarted', (game) => {
        router.push('/game')
      });
    },
    initListeners() {
      console.log('listening to \'registered\'')
      this.menuSocket.on('registered', (token: string, id: number) => {
        this.selfId = id;
        this.useToken(token);
      });
      console.log('listening to \'RoomCreated\'')
      this.menuSocket.on('RoomCreated', (id: number) => {
        console.log(`room created with id: ${id}`);
        this.initGameSocket();
        this.activeRoomId = id;
        this.isAdmin = true;
      });
      console.log('listening to \'gameStarted\'')
      this.gameSocket.on('gameStarted', (game) => {
        router.push('/game')
      });
      console.log('listening to \'UserUpdated\'')
      this.menuSocket.on('UserUpdated', (name: string) => {
        this.name = name;
      });
      console.log('listening to \'updateRooms\'')
      this.menuSocket.on('updateRooms', (res) => {
        console.log(res);
        useRoomStore().updateRooms(res)
      });
      console.log('listening to \'userJoined\'')
      this.menuSocket.on('userJoined', (id: number, username: string, lobby: number) => {
        if (id == this.selfId) {
          this.activeRoomId = lobby;
          this.initGameSocket();
        }
        console.log(`User ${username} has joined!`);
      });
    }
  },
});