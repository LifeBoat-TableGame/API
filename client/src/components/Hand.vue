
<template>
  <div class="hand">
      <Card v-for="(supply, index) in supplies" 
      :key="supply.name" 
      :posFromMiddle="index-Math.ceil(supplies.length/2)+1" 
      :supply=supply 
      :tilted="true" 
      >
      </Card>
  </div>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { useRoomStore } from '../stores/rooms';
import { Supply } from '../interfaces/game';
import Card from './Card.vue';
const title = 'ActiveRoomMenu';
const mainStore = useMainStore();
const roomStore = useRoomStore();


const props = defineProps<{
  supplies: Supply[];
}>();
const emit = defineEmits(['card:clicked'])

</script>
<style scoped>


.hand {
  @apply flex max-w-[30rem]
}
</style>

