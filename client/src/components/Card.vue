
<template>
<div :class="[tilts[6+props.posFromMiddle], 'hover:rotate-0', shifts[6+props.posFromMiddle], 'cardWrapper']">
  <div class="card vertical-container box noselect" @click="useCard">
    <div>{{ supply.name }}
    </div>
    <div>{{ supply.description }}
    </div>
    <div>{{ supply.strength }} {{props.posFromMiddle}}
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


const tilts = [
"rotate-[-12deg]",
"rotate-[-10deg]",
"rotate-[-8deg]",
"rotate-[-6deg]",
"rotate-[-4deg]",
"rotate-[-2deg]",
"rotate-[-0deg]",
"rotate-[2deg]",
"rotate-[4deg]",
"rotate-[6deg]",
"rotate-[8deg]",
"rotate-[10deg]",
"rotate-[12deg]",
]
const shifts = [
"translate-y-[1.5rem]",
"translate-y-[1.2rem]",
"translate-y-[0.8rem]",
"translate-y-[0.5rem]",
"translate-y-[0.2rem]",
"translate-y-[0.05rem]",
"translate-y-[0rem]",
"translate-y-[0.05rem]",
"translate-y-[0.2rem]",
"translate-y-[0.5rem]",
"translate-y-[0.8rem]",
"translate-y-[1.2rem]",
"translate-y-[1.5rem]",
]

const props = defineProps<{
  supply: Supply
  tilted: boolean
  posFromMiddle: number
}>();

console.log(props.posFromMiddle)
const emit = defineEmits(['card:clicked'])


const startIndex = 7+props.posFromMiddle
const useCard = () => {
  emit('card:clicked');
}
</script>

<style scoped>
.cardWrapper {
  @apply overflow-hidden;
}

.cardWrapper:last-child,
.cardWrapper:hover {
  @apply overflow-visible
}
.card {
    @apply bg-light-bg 
    text-2xl
    hover:text-3xl
    border-2 border-dark-blue 
    hover:border-deep-blue
    w-24 h-36
    hover:scale-150
    origin-[50%_90%]
}
</style>

