<template>
    <div class=" fixed bg-main-blue w-full">game page</div>
    <div class="game-grid">
      <div class="players-field top-row bg-olive-400">
        <PlayerProfile name="Don" :supplies="supplies"/>
      </div>
      <div class="seagull-field top-row bg-main-blue">
        <SeagullsBoard :amount="seagulls" />
      </div>
      <div class="timer-field top-row bg-dark-blue">
        <Timer :time="new Date()" />
      </div>
      <div class="phase-field top-row bg-grey-bg">
        <p class="phase">
          {{ phase }}
        </p>
      </div>
      <div class="self-open bg-olive-100">
        <Hand :supplies="supplies" :cardH="10.2" :cardW="6.8" :handW="30" :tilted="false" class="m-1"/>
      </div>
      <div class="self-hand bg-light-red">
        <Hand :supplies="supplies" :cardH="9" :cardW="6" :handW="30" :tilted="true" class="m-1"/>
      </div>
      <div class="self-icon bg-grey-bg">
        <img class=" rounded-full border-3 border-main-blue w-40 h-40 border-highlight"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
      </div>
      <div class="boat-field bg-deep-red">
        <Boat :characters="queue.reverse()"/>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import Timer from '../src/components/Timer.vue';
import SeagullsBoard from '../src/components/SeagullsBoard.vue';
import PlayerProfile from '../src/components/PlayerProfile.vue';
import Hand from '../src/components/Hand.vue'
import { ref } from 'vue';
import { Supply } from '../src/interfaces/game';
import Boat from '../src/components/Boat.vue';
import { CharacterQueue } from '../src/interfaces/game';

const queue: CharacterQueue[] = [];
const supplies = [] as Supply[];

for (var i = 1; i<=13; i++) {
 supplies.push({
    name: 'card'+i,
    strength: 5,
    bonus: null,
    description: '-',
    amount: 1,
  })
  if(i<=8)
  queue.push({
    characterName: "",
    gameId: 1,
    order: i,
    character: {
      name: "Character " + i,
      strength: 5,
      survival: 6,
      description: "long long time ago once apon a time...",
      defaultOrder: 1
    }
  })
}

const name = 'GameTemp';

const components = {
  Timer,
  SeagullsBoard,
  PlayerProfile
};

const seagulls = ref(2);
const phase = ref("Раздача припасов");
const mainStore = useMainStore();

const getGameInfo = () => mainStore.getGameInfo();
const getPlayerInfo = () => mainStore.getPlayerInfo();
const pickSupply = () => mainStore.pickSupply(text1.value);
const openSupply = () => mainStore.openSupply('Аптечка');
const useSupply = () => mainStore.useSupply("Аптечка", "Боцман");
const swap = () => mainStore.swapWith(text1.value);
const demandClose = () => mainStore.demandClose(text1.value);
const demandOpen = () => mainStore.demandOpen(text1.value, text2.value);
const accept = () => mainStore.accept();
const decline = () => mainStore.decline()
const row = () => mainStore.toRow();
const pickNavigation = () => mainStore.pickNavigation(+text1.value);

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  //router.push('/');
}
</script>

<style scoped>
.top-row {
  @apply mt-6;
}
.game-grid {
  @apply grid w-full h-full grid-cols-9 grid-rows-6;
}
.players-field {
  @apply col-start-1 col-span-2 row-span-full;
}
.self-hand {
  @apply row-end-7 row-span-1 col-start-6 col-span-3;
}
.self-open {
  @apply row-end-7 row-span-1 col-span-3 col-start-3;
}
.self-icon {
  @apply row-end-7 row-span-1 col-span-1 col-end-10;
}
.boat-field {
  @apply col-start-3 col-span-full row-start-2 row-end-6;
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