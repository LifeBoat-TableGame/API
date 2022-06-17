<template>
    <div class=" fixed bg-main-blue w-full">game page</div>
    <div class="game-grid">
      <div class="players-field top-row bg-olive-400">
        <PlayerProfile v-for="player of otherPlayers" :key="player.id" :name="player.character.name" :openSupplies="player.openCards" :closedSuppliesAmount="player.closedAmount" @card:demand="DemandCard"/>
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
        <Hand :supplies="gameStore.playerSelf.openCards" :type="'open'" :owner="gameStore.playerSelf.character.name" :cardH="10.2" :cardW="6.8" :handW="30" :tilted="false" :playable="true" class="m-1"/>
      </div>
      <div class="self-hand bg-light-red">
        <Hand :supplies="gameStore.playerSelf.closedCards" :type="'closed'" :owner="gameStore.playerSelf.character.name" :cardH="9" :cardW="6" :handW="30" :tilted="true" :playable="true" class="m-1" @card:selected="OpenSupply"/>
      </div>
      <div class="self-icon bg-grey-bg">
        <img class=" rounded-full border-3 border-main-blue w-40 h-40 border-highlight"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
      </div>
      <div class="boat-field bg-deep-red">
        <CardSelector :supplies="gameStore.suppliesToPick" :cardH="15" :cardW="10" v-if=(supplySelectorActive) @card:selected="PickSupply" />
        <Boat :characters="queue" @char:targeted="SelectTarget" @char:swap="CharSwap" @takeSide="TakeSide"/>
      </div>
    </div>
    <ModalPopup 
      v-show="isModalVisible"
      :modalMessage="modalMessage"
      @popup:confirmed="ConfirmRequest"
      @popup:declined="DeclineRequest"/>
    <button type="submit" @click="CreateRequest('123')" class="btn">req</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import { inject, onBeforeMount, watch } from 'vue';
import { MessageType } from '../src/interfaces/message';
import { Events } from '../src/interfaces/subscription';
import { PopupOption } from '../src/interfaces/game';
import { SocketKey } from '../src/utils/socket.extension';
import ModalPopup from '../src/components/ModalPopup.vue';

const gameStore = useGameStore();
const mainStore = useMainStore();
const socket = inject(SocketKey);
if(socket == undefined)
  throw new Error("Connection dropped");
const supplySelectorActive = computed(() => {
  return gameStore.suppliesToPick.length>0;
});

let chosenToPickCard = null;
let supplyToUse = null;
const OpenSupply = (supplyName:string, uuid:string) => {
  console.log('opening supply', supplyName);
  socket.sendMessage(MessageType.OpenSupply, supplyName);
  gameStore.clearHighlight();
}
const SelectTarget = (targetName:string) => {
  //if phase
  const data = {
    supplyName: gameStore.highlightedCardName as string,
    target: targetName as string,
  }
  console.log('using', gameStore.highlightedCardName, 'on', targetName);
  socket.sendMessage(MessageType.UseSupply, data)
  gameStore.clearHighlight();
}
const PickSupply = (selectedCard) => {
  //if phase
  chosenToPickCard=selectedCard;
  console.log('card selected', selectedCard);
  socket.sendMessage(MessageType.PickSupply, selectedCard.name);
  gameStore.clearPick();
}
const CharSwap = () => {
  //if phase
  console.log('swap with', gameStore.highlightedCardName);
  socket.sendMessage(MessageType.SwapPlaces, gameStore.highlightedCardName);
  gameStore.clearHighlight();
}
const DemandCard = () => {
  //if phase
  console.log('demand card', gameStore.highlightedCardName, 'from', gameStore.highlightedCardOwner);
  socket.sendMessage(MessageType.DemandSupply,  {targetName: gameStore.highlightedCardOwner, supplyName: gameStore.highlightedCardName});
  gameStore.clearHighlight();
}
const TakeSide = (side) => {
  console.log('fighting as', side);
  socket.sendMessage(MessageType.TakeSide, side);
  gameStore.clearHighlight();
}

const modalMessage = ref('')
const isModalVisible = ref(false);
const CreateRequest = (requetsText: string) => {
  modalMessage.value = requetsText;
  isModalVisible.value = true;
}
const ConfirmRequest = () => {
  console.log('request accepted');
  socket.sendMessage(MessageType.AcceptDispute);
  isModalVisible.value = false;
}
const DeclineRequest = () => {
  console.log('request denied');
  socket.sendMessage(MessageType.DeclineDispute);
  isModalVisible.value = false;
}
socket.subscribeToEvent(Events.SwapDispute, (res) => {
  if (res.victimName == gameStore.playerSelf.character.name) {
    CreateRequest(res.aggressorName + ' требует поменяться с вами местами! Согласиться?')
  }
});
socket.subscribeToEvent(Events.DemandDispute, (res) => {
  if (res.victimName == gameStore.playerSelf.character.name) {
    CreateRequest(res.aggressorName + ' требует от вас ' + res.supply + '! Согласиться?')
  }
});

const supplies = [] as Supply[];
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

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
onBeforeMount(() => {
  socket.sendMessage(MessageType.GetGameInfo);
  socket.sendMessage(MessageType.GetPlayerInfo);
});
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
</script>

<style lang="postcss" scoped>
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