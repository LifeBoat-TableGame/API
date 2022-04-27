
<template>
  <div class="horisontal-container hand">
    <Card v-for="supply of supplies" :key="supply.name" :supply=supply />
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
import Card from './Card.vue';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();

const props = defineProps<{
  supplies: Supply[];
}>();
const emit = defineEmits(['card:clicked'])


</script>
<style scoped>
.hand {
  @apply flex
}
</style>

