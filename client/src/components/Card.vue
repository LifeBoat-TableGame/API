
<template>
<div class="cardWrapper">
  <div class="card vertical-container box noselect" @click="useCard">
    <div>{{ supply.name }}
    </div>
    <div>{{ supply.description }}
    </div>
    <div>{{ supply.strength }}
    </div>
  </div>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();

const props = defineProps<{
  supply: Supply
}>();
const emit = defineEmits(['card:clicked'])

const useCard = () => {
  emit('card:clicked');
}
</script>

<style scoped>
.card {
    @apply bg-light-bg 
    text-2xl
    hover:text-3xl
    border-2 border-dark-blue 
    hover:border-deep-blue
    w-24 h-36 
    hover:scale-150
    origin-[50%_70%] hover:rotate-0
}
.cardWrapper {
  @apply overflow-hidden;
}

.cardWrapper:last-child, .cardWrapper:hover {
  @apply overflow-visible;
}
</style>

