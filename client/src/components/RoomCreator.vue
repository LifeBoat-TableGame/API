<template>
  <div class="bg-light-blue box vertical-container">
    <h1 class="noselect">{{ title }}</h1>
    <input v-model="roomData.roomName" type="text" class="small-field"/> <br>
    <input v-model="roomData.password" type="text" class="small-field"/> <br>
    <button type="submit" @click="createRoom" class="btn">Создать</button>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { MessageType } from '../interfaces/message';
import { Room } from '../interfaces/room';
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { SocketKey } from '../utils/socket.extension';
import activeRoomMenu from './activeRoomMenu.vue'

let inTheRoom = false;
const mainStore = useMainStore();
const roomStore = useRoomStore();
const socket = inject(SocketKey);
if(!socket)
  throw new Error("Connection dropped");

const title = 'Создать Комнату';
let roomData = {
  password: '',
  roomName: 'noname',
};
const ar = roomStore.rooms.find(x => x.id == 1) as Room
const components = {
  "active-room-menu": activeRoomMenu,
}
const emit = defineEmits(['room:created'])
const createRoom = () => {
  socket.sendMessage(MessageType.CreateRoom ,roomData.roomName);
  emit('room:created', roomData);
}
</script>