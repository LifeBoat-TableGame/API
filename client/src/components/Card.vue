
<template>
  <!--update classes inside 'playable && gameStore.highlightedCard == uuid' inside 'talwind.config.js' on update -->
  <div
    :class="['card', 'vertical-container', 'noselect', 'border-highlight', 'game-element', 
      tilted ? tilts[6 + props.posFromMiddle] : '', 
      tilted ? shifts[6 + props.posFromMiddle ] : '', 
      props.h>9 ? 'hover:scale-[1.4]' : 'hover:scale-[2.5]',
      gameStore.highlightedCardID == uuid ? 'ring-2 outline-olive-200' : '']" 
    :style="[{width: props.w + 'rem', height: props.h + 'rem',  fontSize: props.h/8 + 'rem', lineHeight:props.h/12 + 'rem', borderRadius:props.h/12 + 'rem'}]"
    @click="useCard()">
    <div class="text-deep-red" :style="[{fontSize: props.h/6 + 'rem', lineHeight:props.h/10 + 'rem', borderRadius:props.h/12 + 'rem'}]">{{props.item.name}} </div>
    <div>{{props.item.description}}</div>
    <!--img :src="'../assets/cards/'+props.item.name+'.jpg'"-->
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
import { useGameStore } from '../stores/game';
const title = 'ActiveRoomMenu';
const gameStore = useGameStore();
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

const uuid = mainStore.getUUID();
const props = defineProps<{
  item: Supply,
  tilted: boolean,
  playable: boolean,
  posFromMiddle: number,
  h: number,
  w: number,
}>();
const emit = defineEmits(['card:clicked'])

const type = props.item;
const startIndex = 7 + props.posFromMiddle
const useCard = () => {
  if(props.playable) {
    emit('card:clicked', props.item.name, uuid);
  }
}
</script>

<style lang="postcss" scoped>
.card {
  @apply 
  bg-light-bg
  origin-[50%_100%] 
  translate-x-[1rem]
  duration-100
}
.card:hover{
  @apply
  hover:rotate-0 
  hover:z-10
}
</style>

