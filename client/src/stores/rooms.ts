import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { Room } from '../interfaces/room';

export const useRoomStore = defineStore("roomStoreID", {
  state: () => ({
    rooms: [] as Room[]
  }),
  getters: {
  },
  actions: {
      updateRooms(rooms: string) {
        this.rooms = JSON.parse(rooms);
      }
  },
})