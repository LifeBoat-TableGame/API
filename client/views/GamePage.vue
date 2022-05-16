<template>
    <div class=" fixed bg-main-blue w-full">game page</div>
    <div class="game-grid">
      <div class="players-field top-row bg-olive-400">
        <PlayerProfile v-for="player of otherPlayers" :key="player.id" :name="player.character.name" :supplies="supplies" />
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
        <Hand :supplies="gameStore.playerSelf.openCards" :cardH="10.2" :cardW="6.8" :handW="30" :tilted="false" class="m-1"/>
      </div>
      <div class="self-hand bg-light-red">
        <Hand :supplies="gameStore.playerSelf.closedCards" :cardH="9" :cardW="6" :handW="30" :tilted="true" class="m-1"/>
      </div>
      <div class="self-icon bg-grey-bg">
        <img class=" rounded-full border-3 border-main-blue w-40 h-40 border-highlight"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
      </div>
      <div class="boat-field bg-deep-red">
        <CardSelector :supplies="pick" :cardH="15" :cardW="10" v-if=(cardSelectorActive) @card:selected="selectedCard => ChooseCard(selectedCard)" />
        <Boat :characters="queue"/>
      </div>
    </div>
</template>

<script setup lang="ts">
import CardSelector from '../src/components/CardSelector.vue';
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import Timer from '../src/components/Timer.vue';
import SeagullsBoard from '../src/components/SeagullsBoard.vue';
import PlayerProfile from '../src/components/PlayerProfile.vue';
import Hand from '../src/components/Hand.vue'
import { Supply } from '../src/interfaces/game';
import Boat from '../src/components/Boat.vue';
import { CharacterQueue } from '../src/interfaces/game';
import { computed } from '@vue/reactivity';
import { useGameStore } from '../src/stores/game';
import { watch } from 'vue';
import { MessageType } from '../src/interfaces/message';
import { Events } from '../src/interfaces/subscription';

const gameStore = useGameStore();
const mainStore = useMainStore();
console.log(gameStore.game);
const supplies = [] as Supply[];
const pick = [] as Supply[];
const cardSelectorActive = computed(() => {
  return pick.length>0;
});
mainStore.getGameInfo();
mainStore.getPlayerInfo();
let chosenCard = null;
const ChooseCard = (selectedCard) => {
  chosenCard=selectedCard;
  console.log(selectedCard);
  pick.splice(0, pick.length);
}
for (var i = 1; i<=13; i++) {
 supplies.push({
    name: 'card'+i,
    strength: 5,
    bonus: null,
    description: '-',
    amount: 1,
  })
}

const name = 'GameTemp';

const components = {
  Timer,
  SeagullsBoard,
  PlayerProfile
};
const otherPlayers = computed(() => {
  console.log(gameStore.game.players);
  return gameStore.game.players.filter(function (u) {
    return u.id != gameStore.playerSelf.id;
  })
});
const queue = computed(() => {
  return gameStore.game.queue;
});
const seagulls = computed(() => {
  return gameStore.game.seagulls;
});
const phase = computed(() => {
  return gameStore.game.state;
});
gameStore.$onAction(({ name, store, after }) => {
  if (name == 'setPick') {
    after(pickQueue => {
      pickQueue.forEach(element => {
        pick.push(element)
      });
      watch(chosenCard, (first, second) => {
        if (second != null) {
          if (first != null) console.log('error: picked card wasn\'t used but was discarded');
          mainStore.pickSupply(second.name);
          chosenCard = null;
        }
      })
    })
  }
})

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