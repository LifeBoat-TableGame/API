
<template>
<div>
  <h1>{{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId) }}</h1>
  <button type="submit" @click="leaveRoom">leaveroom</button>
</div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';

const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();

const props = defineProps<{
  activeRoomId: Number
}>();
const emit = defineEmits(['room:collapse'])
const leaveRoom = () => {
  mainStore.leaveRoom(roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.name);
  emit('room:collapse');
}
</script>

