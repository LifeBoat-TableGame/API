<template>
  <div class="vertical-container">
    im a game page
    <div class="game-grid">
      <div class="players-field"></div>
      <div class="seagull-field"></div>
      <div class="timer-field"></div>
      <div class="phase-field"></div>
      <div class="self-field"></div>
      <div class="boat-field"></div>
    </div>
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
const pickSupply = () => mainStore.pickSupply("Butah");

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
</script>

<style scoped>
.game-grid {
  @apply grid w-screen h-screen grid-cols-9 grid-rows-6;
}
.players-field {
  @apply col-start-1 col-span-2 row-span-full;
}
.self-field {
  @apply row-end-7 row-span-2 col-start-3 col-end-10;
}
.boat-field {
  @apply col-start-3 col-span-full row-start-2 row-end-5;
}
.seagull-field {
  @apply col-start-3 col-span-2 row-start-1 row-span-1;
}
.phase-field {
  @apply col-span-2 row-span-1 row-start-1;
}
.timer-field {
  @apply col-start-5 col-span-2 row-start-1 row-span-1;
}
</style