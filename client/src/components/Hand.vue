<template>
  <div class="hand">
      <Card v-for="(supply, index) in supplies" 
      :key="supply.name" 
      :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
      :supply=supply 
      :tilted="true"
      v-bind:class="[index!=0 ? overlapVal : '']"
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
  supplies: Supply[];
}>();
const emit = defineEmits(['card:clicked'])
const overlapVal = computed(() => {
  return 'ml-[-' + (6-(30-6)/(props.supplies.length-1))+ 'rem]'
});
</script>
<style scoped>


.hand {
  @apply flex max-w-[30rem]
}
</style>

