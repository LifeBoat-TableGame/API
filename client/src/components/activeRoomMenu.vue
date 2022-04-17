
<template>
  <div class="blue">
    <div>{{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.name }}</div>
    <div>
      {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.usersCount }}
      /
      {{ roomStore.rooms.find(x => x.id == mainStore.activeRoomId)?.limit }}
    </div>
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
  mainStore.leaveRoom(mainStore.activeRoomId);
  emit('room:collapse');
}
</script>

