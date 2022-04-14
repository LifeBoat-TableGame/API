<template>
  <h1>{{ title }}</h1>
  <input v-model="roomData.roomName" type="text" /> <br>
  <input v-model="roomData.password" type="text" /> <br>
  <button type="submit" @click="createRoom">Create</button>
</template>

<script lang="ts" setup>
import { useMainStore } from '../stores/main';

const mainStore=useMainStore();
const title = 'RoomCreator';
let roomData = {
  password: '',
  roomName: 'noname',
};

const createRoom = () => {
  mainStore.createRoom(roomData.roomName);
};
</script>