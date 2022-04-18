<template>
  <div class="horisontal-container">
    <div class="min-h-full">
      <room-list class="box"/>
    </div>
    <div class="flex flex-col items-center">
      <room-creator v-if=(!activeRoomExists) @room:created="roomCreated" class="box"/>
      <active-room-menu v-if=activeRoomExists v-bind:activeRoomId=mainStore.activeRoomId @room:collapse="collapseRoom" class="box"/>
      <button @click="logOut" class="btn">logout</button>
    </div>
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
console.log(mainStore.activeRoomId);
const activeRoomExists = computed(() => mainStore.activeRoomId != 0)
const logOut = () => {
  mainStore.logOut();
}
const collapseRoom = () => {

}
const roomCreated = (created) => {
}

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')

if (mainStore.token == '') {
  console.log('token does not exists, redirecting to login');
  router.push('/login');
}
</script>