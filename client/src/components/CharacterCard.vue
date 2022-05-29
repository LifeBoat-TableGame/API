<template>
<div class=" w-32 h-72 border-2 border-x-main-blue rounded-md bg-main-bg flex flex-col noselect game-element" @click="characterCardPlayed">
    <img :src="'../assets/cards/'+props.character.name+'.jpg'">
</div>
</template>

<script lang="ts" setup>
import {PropType} from 'vue'
import { useGameStore } from '../stores/game';
import { useMainStore } from '../stores/main';
import {Character} from '../interfaces/game'

const gameStore = useGameStore();
const mainStore = useMainStore();
const uuid = mainStore.getUUID();
const emit = defineEmits(['char:targeted', 'char:selected']);
const props = defineProps({
    character: {
        type: Object as PropType<Character>,
        required: true
    }
});

const characterCardPlayed = () => {
    if (gameStore.highlightedCardID!='')
        emit('char:targeted', props.character.name);
    else {
        if(gameStore.highlightedCardID == uuid) {
            gameStore.clearHighlight();
        } 
        else {
            gameStore.changeHighlight(uuid, 'char', props.character.name)
            emit('char:selected');
        }
    }
}
</script>

<style lang="postcss" scoped>
    .strength {
        @apply text-main-red ml-2
    }
    .survival {
        @apply text-main-blue mr-2
    }
    h1 {
        @apply text-xl;
    }
    p {
        @apply text-sm
    }
</style>