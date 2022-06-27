<template>
  <div class="horisontal-container mx-auto relative top-1/3 items-start">
    <div class="vertical-container">
      <room-creator v-if=(!activeRoomExists) @room:created="roomCreated" class="m-2"/>
      <active-room-menu v-else v-bind:activeRoomId=mainStore.activeRoomId @room:collapse="collapseRoom" class="m-2"/>
      <button @click="logOut" class="btn">Изменить Ник</button>
    </div>
    <room-list class="m-2"/>
  </div>
</template>

<script setup lang="ts">
import RoomList from '../src/components/RoomList.vue'
import RoomCreator from '../src/components/RoomCreator.vue'
import activeRoomMenu from '../src/components/activeRoomMenu.vue';
import { useMainStore } from '../src/stores/main';
import { computed } from '@vue/reactivity';
import router from '../src/router';

const mainStore = useMainStore()
const name = 'MainTemp';
const components = {
  "room-list": RoomList,
  "room-creator": RoomCreator
};
const activeRoomExists = computed(() => mainStore.activeRoomId != 0)
const logOut = () => {
  mainStore.logOut();
}
const collapseRoom = () => {
  mainStore.activeRoomId=0;
  localStorage.removeItem('activeRoom');
}
const roomCreated = (created) => {
}

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
</script>