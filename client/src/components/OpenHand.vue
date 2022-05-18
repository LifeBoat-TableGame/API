<template>
<div class=" bg-dark-bg rounded-sm relative flex flex-row items-center flex-wrap px-2 my-2">
    <div class="card relative" 
        v-for="(supply, index) in supplies" 
        :style="{
            marginLeft: (coefficient) + 'rem',
            marginRight: (index == props.supplies.length - 1 ? 1.75 : 0) + 'rem'
        }"
    >
    </div>
</div>
</template>
<script lang="ts" setup>import { computed, PropType } from 'vue';
import { Supply } from '../interfaces/game';

    const props = defineProps({
        supplies: {
            type: Object as PropType<Supply[]>,
            required: true
        }
    });
    const coefficient = computed(() => {
        return props.supplies.length * (-1/14);
    });
</script>

<style lang="postcss" scoped>
.card {
  @apply 
  bg-light-bg 
  text-2xl 
  border-2 
  w-7 h-10
  border-dark-blue 
  hover:border-deep-blue 
  origin-[50%_100%] 
  translate-x-[1rem]
  hover:rotate-0 
  hover:z-10
  hover:scale-[1.2]
  duration-100
}
</style>