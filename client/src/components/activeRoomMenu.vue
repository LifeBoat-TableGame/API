
<template>
  <div class="bg-light-blue vertical-container noselect box">
    <element-header class="negative">
      <h1 class="p-4">Текущая комната</h1>
    </element-header>
    <h2>ID: {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.id }}</h2>
    <h2>{{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.name }}</h2>
    <div>
      <h2>
        {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.usersCount }}
        /
        {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.limit }}
      </h2>
    </div>
    <div class="horisontal-container">
      <button v-if="mainStore.isAdmin" type="submit" @click="startGame" class="btn px-2">Начать</button>
      <button type="submit" @click="leaveRoom" class="btn">Покинуть</button>
    </div>
    <element-footer class="negative"/>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { computed } from '@vue/reactivity';
import { inject } from 'vue';
import { SocketKey } from '../utils/socket.extension';
import { MessageType } from '../interfaces/message';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();
const socket = inject(SocketKey);
if(!socket)
  throw new Error("Connection dropped");

const props = defineProps<{
  activeRoomId: Number
}>();
const emit = defineEmits(['room:collapse'])


//const isAdmin = computed(() => roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.adminId == mainStore.selfId)

const leaveRoom = () => {
  socket.sendMessage(MessageType.LeaveRoom, mainStore.activeRoomId);
  mainStore.isAdmin = false;
  mainStore.activeRoomId = 0;
  emit('room:collapse');
}
const startGame = () => {
  socket.sendMessage(MessageType.StartGame);
}
</script>

