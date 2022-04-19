import { defineStore } from 'pinia';
import { Room } from '../interfaces/room';

export const useRoomStore = defineStore("roomStoreID", {
  state: () => ({
    rooms: [] as Room[]
  }),
  getters: {
  },
  actions: {
    updateRooms(rooms: Room[]) {
      this.rooms = rooms;
    }
  },
})