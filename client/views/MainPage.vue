<template>
  <room-creator />
  <room-list />
  <button @click="logOut">logout</button>
</template>

<script setup>
import RoomList from '../src/components/RoomList.vue'
import RoomCreator from '../src/components/RoomCreator.vue'
import { useMainStore } from '../src/stores/main';
import router from '../src/router';

const mainStore = useMainStore()
const name = 'MainTemp';
const components = {
  "room-list": RoomList,
  "room-creator": RoomCreator
};

const logOut = () => {
  console.log('logging out...')
  mainStore.disconect();
}

console.log('loading ', name, ' with token \''+ mainStore.token+'\'')

if (mainStore.token == '') {
  console.log('token does not exists, redirecting to login');
  router.push('/login');
}
</script>