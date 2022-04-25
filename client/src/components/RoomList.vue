<template>
  <div class="box vertical-container bg-light-blue mr-4 basis-1/4">
    <h1 >{{ title }}</h1>
    <ul class="bg-light-blue overflow-auto w-full h-72">
      <li v-for="room of roomStore.rooms" :key="room.id" v-on:click="joinRoom(room.id)" class="horisontal-container">
        <div class="pr-3">{{ room.name }}</div>
        <div class="pl-3">{{ room.usersCount }}/{{ room.limit }}</div>
      </li>
    </ul>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Room } from '../interfaces/room';

const mainStore = useMainStore()
const roomStore = useRoomStore()
const title = 'Список Комнат';

mainStore.getRooms();

const rooms: Room[] = roomStore.rooms.sort((n1, n2) => {
  if (n1.id > n2.id) {
    return 1;
  }
  if (n1.id < n2.id) {
    return -1;
  }
  return 0;
});


const joinRoom = (room: number) => {
  console.log('connecting to ', { room });
  mainStore.joinRoom(room);
}
</script>

