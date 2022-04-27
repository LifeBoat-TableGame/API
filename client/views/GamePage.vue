<template>
    <div>game page</div>
    <div class="game-grid">
      <div class="players-field bg-olive-400">players</div>
      <div class="seagull-field bg-main-blue">seagull</div>
      <div class="timer-field bg-dark-blue">timer</div>
      <div class="phase-field bg-deep-blue">phase</div>
      <div class="self-field bg-light-red">cards with self info
        <Card v-bind:supply=supply class="rotate-12"></Card>
      </div>
      <div class="boat-field bg-deep-red"> boat</div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import Card from '../src/components/Card.vue';
import { Supply } from '../src/interfaces/game';


const supply = {
    name: 'string',
    strength: 5,
    bonus: null,
    description: 'string',
    amount: 1,
} as Supply;
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
  //router.push('/');
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
</style>