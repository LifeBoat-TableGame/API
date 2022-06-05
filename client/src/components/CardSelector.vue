<template>
  <div class="card-selector">
      <Card v-for="(supply, index) in supplies" 
      :tilted="false"
      :key="supply.name" 
      :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
      :supply=supply 
      :w="cardW"
      :h="cardH"
      :playable="false"
      @click="cardChosen(supply.name)"
      >
      </Card>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
import Card from './Card.vue';
const title = 'CardSelector';
const mainStore = useMainStore();
const roomStore = useRoomStore();


const props = defineProps<{
  supplies: Supply[],
  cardH: number,
  cardW: number,
}>();
const emit = defineEmits(['card:selected'])
const cardChosen = (cardName:string) => {
emit('card:selected', cardName)
}
</script>

<style lang="postcss" scoped>
.card-selector {
  @apply
  w-[70%]
  absolute
  flex
  flex-nowrap
  rounded-sm
  justify-center
  items-center
}
</style>

