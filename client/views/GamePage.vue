<template>
  <div class="vertical-container">
    im a game page
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import router from '../src/router';

const name = 'GameTemp';
const components = {
};
const mainStore = useMainStore();

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
if (mainStore.activeRoomId == 0) {
  console.log('game does not exists, redirecting to main');
  router.push('/');
}
</script>