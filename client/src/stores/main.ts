import { defineStore } from 'pinia';
import { listeners } from 'process';
import { io } from 'socket.io-client';
import router from '../router';
import { useRoomStore } from './rooms';

const defaultSocket = io();
export const useMainStore : any = defineStore("mainStoreID", {
  state: () => ({
    token: '',
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
      const socketOptions = {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: token,
            }
          }
        }
      };
      this.socket = io('http://localhost:3000/menu', socketOptions);
    },
    renameUser(name: string) {
      console.log(`rename: ${name}`);
      this.socket.emit('rename', this.name);
      this.name = name;
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
    joinRoom(roomId: string) {
      console.log(`joining room: ${roomId}`);
      this.socket.emit('joinRoom', roomId);
    },
    leaveRoom(roomId: string) {
      console.log(`leaving room: ${roomId}`);
      this.socket.emit('leaveRoom', roomId);
    },
    getRooms() {
      this.socket.emit('getRooms');
    },
    initListeners() {
      console.log('listening to \'registered\'') 
      this.socket.on('registered', (token) => {
        this.useToken(token);
      });      
      this.socket.on('UserUpdated', () => {

      });
      console.log('listening to \'updateRooms\'') 
      this.socket.on('updateRooms', (res) => {
        console.log(JSON.parse(res));
        useRoomStore().updateRooms(res)
      });
    }
  },
});