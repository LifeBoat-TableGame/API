
<template>
  <div class="bg-light-blue vertical-container ">
    <div>{{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.name }}</div>
    <div>
      {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.usersCount }}
      /
      {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.limit }}
    </div>
    <div class="horisontal-container">
      <button type="submit" @click="leaveRoom" class="btn">Leave</button>
      <button type="submit" @click="startGame" class="btn">Start</button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { computed } from '@vue/reactivity';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();

const props = defineProps<{
  activeRoomId: Number
}>();
const emit = defineEmits(['room:collapse'])


//const isAdmin = computed(() => roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.adminId == mainStore.selfId)

const leaveRoom = () => {
  mainStore.leaveRoom(mainStore.activeRoomId);
  emit('room:collapse');
}
const startGame = () => {
  mainStore.startGame();
}
</script>

