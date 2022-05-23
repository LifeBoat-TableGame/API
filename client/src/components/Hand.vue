<template>
  <div :class="['hand', !tilted ? 'bg-dark-bg p-2' : '', playable && !tilted ? 'game-element' : '']">
      <Card v-for="(supply, index) in supplies" 
      :key="supply.name" 
      :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
      :supply=supply 
      :tilted="tilted"
      :style="[index!=0 ? {marginLeft: overlapVal + 'rem' } : {marginLeft: -1.2 + 'rem' }]"
      :w="cardW"
      :h="cardH"
      :playable="playable"
      @card:clicked="useSupply"
      >
      </Card>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { useGameStore } from '../stores/game';
import { Supply } from '../interfaces/game';
import Card from './Card.vue';
import { computed } from '@vue/reactivity';
import { placeholder } from '@babel/types';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();
const gameStore = useGameStore();


const props = defineProps<{
  supplies: Supply[],
  cardH: number,
  cardW: number,
  handW: number,
  playable: boolean,
  tilted: boolean
}>();
const useSupply = (cardName: string) => {
  emit('card:clicked', cardName)
}
const emit = defineEmits(['card:clicked'])
const overlapVal = computed(() => {
  return -props.cardW+(props.handW-props.cardW)/(props.supplies.length-1)
});
</script>
<style lang="postcss" scoped>


.hand {
  @apply
  flex 
  rounded-sm
}
</style>

