<template>
  <div>
    <div class="card-selector">
        <Card v-for="(supply, index) in supplies" 
        :tilted="false"
        :key="supply.name" 
        :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
        :item=supply 
        :w="cardW"
        :h="cardH"
        :playable="false"
        @click="cardChosen(supply.name)"
        >
        </Card>
    </div>
    <div class="w-screen h-screen absolute top-0 left-0 z-20" style="
    background:rgba(0, 0, 0, .3);
    backdrop-filter: blur(3px);">
    </div>  
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
  z-40
  w-[70%]
  absolute
  flex
  flex-nowrap
  rounded-sm
  justify-center
  self-center
  items-center
}
</style>

