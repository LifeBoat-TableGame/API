
<template>
  <div
    :class="['card', 'vertical-container', 'box', 'noselect', tilts[6 + props.posFromMiddle], shifts[6 + props.posFromMiddle]]"
    @click="useCard">
    <div>{{ supply.name }}
    </div>
    <div>{{ supply.description }}
    </div>
    <div>{{ supply.strength }} {{ props.posFromMiddle }}
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
  "translate-y-[1.9rem]",
  "translate-y-[1.4rem]",
  "translate-y-[1rem]",
  "translate-y-[0.5rem]",
  "translate-y-[0.25rem]",
  "translate-y-[0.05rem]",
  "translate-y-[0rem]",
  "translate-y-[0.05rem]",
  "translate-y-[0.25rem]",
  "translate-y-[0.5rem]",
  "translate-y-[1rem]",
  "translate-y-[1.4rem]",
  "translate-y-[1.9rem]",
]

const props = defineProps<{
  supply: Supply
  tilted: boolean
  posFromMiddle: number
}>();

const emit = defineEmits(['card:clicked'])


const startIndex = 7 + props.posFromMiddle
const useCard = () => {
  emit('card:clicked');
}
</script>

<style scoped>
.card {
  @apply 
  bg-light-bg 
  text-2xl 
  hover:text-3xl 
  border-2 
  w-24 h-36
  border-dark-blue 
  hover:border-deep-blue 
  origin-[50%_100%] 
  hover:z-10
  hover:rotate-0 
  hover:scale-150
  duration-100
}
</style>

