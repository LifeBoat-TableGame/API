<template>
  <div class="box vertical-container bg-deep-blue mr-4 basis-1/4 noselect">
    <elemment-header class="negative">
      <h1 class="p-4">{{ title }}</h1>
    </elemment-header>
      <div class="bg-deep-blue text-light-light-blue horisontal-container justify-evenly w-full">
        <div class="w-full text-center">ID</div>
        <div class="w-full text-center">Имя</div>
        <div  class="w-full text-center">Игроков</div>
      </div>
    <ul class="bg-light-blue overflow-auto w-full h-72  divide-y divide-main-blue m-1">
      <li v-for="room of roomStore.rooms" :key="room.id" v-on:click="joinRoom(room.id)" class="ineractive-box horisontal-container justify-evenly">
        <div class="w-full text-center">{{ room.id }}</div>
        <div class="w-full text-center">{{ room.name }}</div>
        <div class="w-full text-center">{{ room.usersCount }}/{{ room.limit }}</div>
      </li>
    </ul>
    <element-footer class="negative"/>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Room } from '../interfaces/room';
import { inject } from 'vue';
import { SocketKey } from '../utils/socket.extension';
import { MessageType } from '../interfaces/message';

const mainStore = useMainStore();
const roomStore = useRoomStore();
const socket = inject(SocketKey);
if(!socket)
  throw new Error("Connection dropped");

const title = 'Список Комнат';

socket.sendMessage(MessageType.GetRooms);

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
  socket.sendMessage(MessageType.JoinRoom, room);
}
</script>

