<template>
  <div class="card-selector">
      <NavCard v-for="(nav, index) in navs" 
      :tilted="false"
      :key="nav.id" 
      :posFromMiddle="index-Math.ceil(navs.length/2)+1" 
      :item=nav 
      :w="cardW"
      :h="cardH"
      :playable="false"
      @click="navChosen(nav.id)"
      >
      </NavCard>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Navigation } from '../interfaces/game';
import NavCard from './NavCard.vue';
const title = 'CardSelector';
const mainStore = useMainStore();
const roomStore = useRoomStore();


const props = defineProps<{
  navs: Navigation[],
  cardH: number,
  cardW: number,
}>();
const emit = defineEmits(['card:selected'])
const navChosen = (id:number) => {
emit('card:selected', id)
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

