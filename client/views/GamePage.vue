<template>
  <div class="vertical-container">
    im a game page
    <button @click="getGameInfo" class="btn">Get game info</button>
    <button @click="getPlayerInfo" class="btn btn-primary">Get player info</button>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';

const name = 'GameTemp';
const components = {
};
const mainStore = useMainStore();

const getGameInfo = () => mainStore.getGameInfo();
const getPlayerInfo = () => mainStore.getPlayerInfo();

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
</script>