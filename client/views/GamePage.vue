<template>
    <div>game page</div>
    <div class="game-grid">
      <div class="players-field bg-olive-400">players</div>
      <div class="seagull-field bg-main-blue">
        <SeagullsBoard :amount="seagulls" />
      </div>
      <div class="timer-field bg-dark-blue">
        <Timer :time="new Date()" />
      </div>
      <div class="phase-field bg-grey-bg">
        <p class="phase">
          {{ phase }}
        </p>
      </div>
      <div class="self-field bg-light-red">cards with self info</div>
      <div class="boat-field bg-deep-red"> boat</div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import Timer from '../src/components/Timer.vue';
import SeagullsBoard from '../src/components/SeagullsBoard.vue';
import { ref } from 'vue';

const name = 'GameTemp';

const components = {
  Timer,
  SeagullsBoard
};

const seagulls = ref(2);
const phase = ref("Раздача припасов");
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

.phase {
  @apply text-3xl text-center m-auto top-1/4 relative;
}
</style>