<template>
  <div class="vertical-container">
    im a game page
    <button @click="getGameInfo" class="btn">Get game info</button>
    <button @click="getPlayerInfo" class="btn btn-primary">Get player info</button>
    <button @click="pickSupply" class="btn btn-primary">Pick supply</button>
    <button @click="pickNavigation" class="btn btn-primary">Pick Navigation</button>
    <button @click="openSupply" class="btn btn-primary">open Medkit</button>
    <button @click="useSupply" class="btn btn-primary">Use Medkit</button>
    <button @click="row" class="btn btn-primary">Row</button>
    <button @click="takeSide" class="btn btn-primary">TakeSide</button>
    <button @click="swap">Swap</button>
    <button @click="demandOpen">Get Opened</button>
    <button @click="demandClose">Get Closed</button>
    <button @click="accept">Accept</button>
    <button @click="decline">Decline</button>
    <input v-model="text1" type="text" class="small-field"/>
    <input v-model="text2" type="text" class="small-field"/>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';
import { ref } from 'vue';

const name = 'GameTemp';
const text1 = ref('');
const text2 = ref('');
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
const takeSide = () => mainStore.takeSide(text1.value);

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
</script>