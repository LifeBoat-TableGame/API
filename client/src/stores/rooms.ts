import { defineStore } from 'pinia';
import { Room } from '../interfaces/room';

export const useRoomStore = defineStore("roomStoreID", {
  state: () => ({
    rooms: [

      {
        id: 2,
        name: 'room2',
        usersCount: 4,
        limit: 6,
        password: null,
      },
      {
        id: 1,
        name: 'room1',
        usersCount: 0,
        limit: 6,
        password: null,
      },
    ] as Room[]
  }),
  getters: {
  },
  actions: {
    updateRooms(rooms: string) {
      this.rooms = JSON.parse(rooms);
    }
  },
})