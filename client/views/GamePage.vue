<template>
    <!--div class=" fixed bg-main-blue w-full">game page</div-->
    <div class="game-grid">
      <div class="players-field top-row border-1">
        <PlayerProfile v-for="player of otherPlayers" :key="player.id" :name="player.character.name" :openSupplies="player.openCards" :closedSuppliesAmount="player.closedAmount" @card:demand="DemandCard"/>
      </div>
      <div class="seagull-field top-row">
        <SeagullsBoard :amount="seagulls" />
      </div>
      <div class="timer-field top-row noselect">
        <Timer :time="new Date()" />
      </div>
      <div class="phase-field top-row">
        <p class="phase">
          {{ phase }}
        </p>
      </div>
      <div class="self-open bg-olive-100">
        <Hand :supplies="gameStore.playerSelf.openCards" :type="'open'" :owner="gameStore.playerSelf.character.name" :cardH="10.2" :cardW="6.8" :handW="30" :tilted="false" :playable="true" class="m-1"/>
      </div>
      <div class="self-hand ">
        <Hand :supplies="gameStore.playerSelf.closedCards" :type="'closed'" :owner="gameStore.playerSelf.character.name" :cardH="9" :cardW="6" :handW="30" :tilted="true" :playable="true" class="m-1" @card:selected="OpenSupply"/>
      </div>
      <div class="self-icon border-1 vertical-container">
        <div class="text-lg">{{gameStore.playerSelf?.character.name}}</div>
        <img class=" rounded-full border-3 border-main-blue w-40 h-40 border-highlight"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
      </div>
      <div class="boat-field bg-light-blue">
        <CardSelector :supplies="gameStore.suppliesToPick" :cardH="15" :cardW="10" v-if=(supplySelectorActive) @card:selected="PickSupply" />
        <NavSelector :navs="gameStore.navsToPick" :cardH="15" :cardW="10" v-if=(navSelectorActive) @card:selected="PickNav" />
        <Boat :characters="queue" @char:targeted="SelectTarget" @char:swap="CharSwap" @takeSide="TakeSide" @nav:clicked="AddNav"/>
      </div>
    </div>
    <ModalPopup 
      v-show="isModalVisible"
      :modalMessage="modalMessage"
      @popup:confirmed="ConfirmRequest"
      @popup:declined="DeclineRequest"/>
      <button class="btn" @click="PrintData">data</button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import NavSelector from '../src/components/NavSelector.vue';
import CardSelector from '../src/components/CardSelector.vue';
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import Timer from '../src/components/Timer.vue';
import SeagullsBoard from '../src/components/SeagullsBoard.vue';
import PlayerProfile from '../src/components/PlayerProfile.vue';
import Hand from '../src/components/Hand.vue'
import { Supply } from '../src/interfaces/game';
import Boat from '../src/components/Boat.vue';
import { computed } from '@vue/reactivity';
import { useGameStore } from '../src/stores/game';
import { inject, onBeforeMount, watch } from 'vue';
import { MessageType } from '../src/interfaces/message';
import { Events } from '../src/interfaces/subscription';
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
const navSelectorActive = computed(() => {
  return gameStore.navsToPick.length>0;
});
const OpenSupply = (supplyName:string, uuid:string) => {
  console.log('opening supply', supplyName);
  if(supplyName == "Зонтик") {
    const data = {
      supplyName: gameStore.highlightedCardName as string,
      target: gameStore.playerSelf?.character.name as string,
    }
    socket.sendMessage(MessageType.UseSupply, data)
  }
  else {
    socket.sendMessage(MessageType.OpenSupply, supplyName);
    gameStore.clearHighlight();
  }
}
const SelectTarget = (targetName:string) => {
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
  console.log('card selected', selectedCard);
  socket.sendMessage(MessageType.PickSupply, selectedCard);
  gameStore.clearPick();
}
const PickNav = (selectedCard) => {
  //if phase
  console.log('nav selected', selectedCard);
  socket.sendMessage(MessageType.PickNavigation, selectedCard);
  gameStore.clearNavPick();
}

const AddNav = () => {
  //if phase
  console.log('adding nav');
  socket.sendMessage(MessageType.Row);
  gameStore.clearNavPick();
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
  gameStore.sideChosen = true;
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
  if (res.victimName == gameStore.playerSelf?.character.name) {
    CreateRequest(res.aggressorName + ' требует поменяться с вами местами! Согласиться?')
  }
});
socket.subscribeToEvent(Events.DemandDispute, (res) => {
  if (res.victimName == gameStore.playerSelf?.character.name) {
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
  if (!gameStore.game) return []
  return gameStore.game.players.filter(function (u) {
    return u.id != gameStore.playerSelf?.id;
  })
});
const queue = computed(() => {
  return gameStore.game.queue;
});
const seagulls = computed(() => {
  if (!gameStore.game) return 0
  return gameStore.game.seagulls;
});
const phase = computed(() => {
  switch(gameStore.game?.state) {
    case 1: { 
        return 'Supplies';
    } 
    case 2: { 
        return 'Regular';
    } 
    case 3: { 
        return 'Dispute';
    } 
    case 4: { 
        return 'Fight';
    } 
    case 5: { 
        return 'Picking';
    } 
    case 6: { 
        return 'NavigationPicked';
    } 
    default: { 
        return 'State_Error'
    }
  }
});


const gameclock = setInterval(() => {
  socket.sendMessage(MessageType.GetGameInfo);
  socket.sendMessage(MessageType.GetPlayerInfo);
}, 500);

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
onBeforeUnmount(() => {
    clearInterval(gameclock);
});
onBeforeMount(() => {
  socket.sendMessage(MessageType.GetGameInfo);
  socket.sendMessage(MessageType.GetPlayerInfo);
});
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
const PrintData = () => {
  console.log(gameStore.game, gameStore.playerSelf);
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
  @apply col-start-3 col-span-full row-start-2 row-end-6 m-1;
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