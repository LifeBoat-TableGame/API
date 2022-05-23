
<template>
  <!--update classes inside 'playable && gameStore.highlightedCard == uuid' inside 'talwind.config.js' on update -->
  <div
    :class="['card', 'vertical-container', 'noselect', 'border-highlight', 'game-element', 
      tilted ? tilts[6 + props.posFromMiddle] : '', 
      tilted ? shifts[6 + props.posFromMiddle ] : '', 
      playable && gameStore.highlightedCard == uuid ? 'outline-double outline-4 outline-olive-400' : '']" 

    :style="[{width: props.w + 'rem', height: props.h + 'rem',  fontSize: props.h/16 + 'rem', lineHeight:props.h/12, borderRadius:props.h/16+'rem'}]"
    @click="useCard()">
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
import { useGameStore } from '../stores/game';
import { propsToAttrMap } from '@vue/shared';
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
  supply: Supply,
  tilted: boolean,
  playable: boolean,
  posFromMiddle: number,
  h: number,
  w: number,
}>();
const emit = defineEmits(['card:clicked'])


const startIndex = 7 + props.posFromMiddle
const useCard = () => {
  if(props.playable) {
    if(gameStore.highlightedCard == uuid) {
      console.log('deselecting card');
      gameStore.clearHighlight()
    } 
    else {
      console.log('selecting card', uuid);
      gameStore.changeHighlight(uuid)
      emit('card:clicked', props.supply.name);
    }
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
  hover:scale-[1.2]
  hover:z-10
}
</style>

