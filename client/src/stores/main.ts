import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import router from '../router';
import { useRoomStore } from './rooms';

const defaultSocket = io();
export const useMainStore : any = defineStore("mainStoreID", {
  state: () => ({
    activeRoomId: 0,
    token: '',
    selfId: -1,
    name: 'noname',
    socket: io('http://localhost:3000/menu'),
  }),
  getters: {
    getToken: (state) => {
      state.token;
    }
  },
  actions: {
    logOut() {
      console.log('logging out...')
      this.token = '';
      this.socket.disconnect();
      this.socket = io('http://localhost:3000/menu');
      this.initListeners();
      router.push('/login')
    },
    useToken(token: string) {
      console.log(`using Token: ${token}`);
      this.token = token;
      this.socket.disconnect();
      this.socket = io('http://localhost:3000/menu', {extraHeaders: { Authorization: token }});
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
    },
    getRooms() {
      console.log('trying to get rooms...')
      this.socket.emit('getRooms');
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
      });
      console.log('listening to \'registered\'') 
      this.socket.on('UserUpdated', (name: string) => {
        this.name = name;
      });
      console.log('listening to \'updateRooms\'') 
      this.socket.on('updateRooms', (res) => {
        console.log(res);
        useRoomStore().updateRooms(res)
      });
      this.socket.on('userJoined', (id: number, username: string, lobby: number) => {
        if(id == this.selfId)
          this.activeRoomId = lobby;
        console.log(`User ${username} has joined!`);
      });
    }
  },
});