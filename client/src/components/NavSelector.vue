<template>
  <div class="card-selector">
      <Card v-for="(nav, index) in navs" 
      :tilted="false"
      :key="nav.name" 
      :posFromMiddle="index-Math.ceil(navs.length/2)+1" 
      :item=nav 
      :w="cardW"
      :h="cardH"
      :playable="false"
      @click="cardChosen(nav.name)"
      >
      </Card>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Nav } from '../interfaces/game';
import Card from './Card.vue';
const title = 'CardSelector';
const mainStore = useMainStore();
const roomStore = useRoomStore();


const props = defineProps<{
  navs: Nav[],
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

