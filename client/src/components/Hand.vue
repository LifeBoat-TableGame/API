<template>
  <div :class="['hand', !tilted ? 'bg-dark-bg p-2' : '']">
      <Card v-for="(supply, index) in supplies" 
      :key="supply.name" 
      :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
      :supply=supply 
      :tilted="tilted"
      :style="[index!=0 ? {marginLeft: overlapVal + 'rem' } : {marginLeft: -1.2 + 'rem' }]"
      :w="cardW"
      :h="cardH"
      >
      </Card>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
import Card from './Card.vue';
import { computed } from '@vue/reactivity';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();


const props = defineProps<{
  supplies: Supply[],
  cardH: number,
  cardW: number,
  handW: number,
  tilted: boolean
}>();
console.log(props.tilted)
const emit = defineEmits(['card:clicked'])
const overlapVal = computed(() => {
  return -props.cardW+(props.handW-props.cardW)/(props.supplies.length-1)
});
</script>
<style scoped>


.hand {
  @apply
  flex 
  rounded-sm
}
</style>

