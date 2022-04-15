<template>
  <h1>{{ title }}</h1>
  <p>
  <ul>
    <li v-for="room of rooms" :key="room.id" v-on:click="joinRoom(room.name)">
      {{ room }}
    </li>
  </ul>
  </p>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Room } from '../interfaces/room';

const mainStore = useMainStore()
const roomStore = useRoomStore()
const title = 'RoomList';

mainStore.getRooms();

const rooms: Room[] = roomStore.rooms.sort((n1,n2) => {
    if (n1.id > n2.id) {
        return 1;
    }
    if (n1.id < n2.id) {
        return -1;
    }
    return 0;
});


const joinRoom = (room: string) => {
  console.log('connecting to ', {room});
  mainStore.joinRoom(room);
}
</script>

