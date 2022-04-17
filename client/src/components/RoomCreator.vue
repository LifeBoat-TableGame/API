<template>
  <div>
    <h1>{{ title }}</h1>
    <input v-model="roomData.roomName" type="text" /> <br>
    <input v-model="roomData.password" type="text" /> <br>
    <button type="submit" @click="createRoom">Create</button>
  </div>
</template>

<script lang="ts" setup>
import { Room } from '../interfaces/room';
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import activeRoomMenu from './activeRoomMenu.vue'

let inTheRoom = false;
const mainStore = useMainStore();
const roomStore = useRoomStore();
const title = 'RoomCreator';
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
  mainStore.createRoom(roomData.roomName);
  emit('room:created', roomData);
}
</script>