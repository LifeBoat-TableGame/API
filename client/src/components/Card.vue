
<template>
  <div
    :class="['card', 'vertical-container', 'noselect', 'border-highlight', tilted ? tilts[6 + props.posFromMiddle] : '', tilted ? shifts[6 + props.posFromMiddle ] : '']"
    :style="[{width: props.w + 'rem', height: props.h + 'rem',  fontSize: props.h/6 + 'rem', lineHeight:props.h/4.5, borderRadius:props.h/16+'rem'}]"
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
  supply: Supply,
  tilted: boolean,
  posFromMiddle: number,
  h: number,
  w: number,
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
  origin-[50%_100%] 
  hover:z-10
  translate-x-[1rem]
  hover:rotate-0 
  hover:scale-[1.2]
  duration-100
}
</style>

