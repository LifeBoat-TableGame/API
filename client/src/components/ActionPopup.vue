
<template>
  <div class="vertical-container bg-light-light-blue rounded-md text-lg noselect">
        <li v-for="option of props.options" :key="option.name" v-on:click="emitOption(option.name)" class="horisontal-container game-element rounded-md ">
            <div class="p-3">{{ option.text }}</div>
        </li>
  </div>
</template>


<script lang="ts" setup>
import { PopupOption } from '../interfaces/game';
const title = 'ActionPopup';

const props = defineProps<{
  options: PopupOption[]
}>();
const emit = defineEmits(['option:chosen'])

const emitOption = (name:string) => {
  emit('option:chosen', name);
}
</script>