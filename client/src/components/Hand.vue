
<template>
  <div class="hand">
    <div v-for="(supply, index) in supplies" :key="supply.name" class="cardWrapper">
      <Card :supply=supply />
      <div>{{ index }}</div>
    </div>
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
.cardWrapper {
  @apply overflow-hidden;
}

.cardWrapper:last-child,
.cardWrapper:hover {
  @apply overflow-visible;
}

.hand {
  @apply flex max-w-[15rem]
}
</style>

