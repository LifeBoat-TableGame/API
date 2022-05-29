<template>
<div class=" w-32 h-72 border-2 border-x-main-blue rounded-md bg-main-bg flex flex-col noselect game-element" 
:class="[gameStore.highlightedCardID == uuid ? 'outline-double outline-4 outline-olive-400' : '']"
@click="characterCardPlayed">
    <div>{{props.character.name}}</div>
    <!--img :src="'../assets/cards/'+props.character.name+'.jpg'"-->
</div>
</template>

<script lang="ts" setup>
import {PropType, watch} from 'vue'
import { useGameStore } from '../stores/game';
import { useMainStore } from '../stores/main';
import {Character} from '../interfaces/game'

const gameStore = useGameStore();
const mainStore = useMainStore();
const uuid = mainStore.getUUID();
const emit = defineEmits(['char:targeted', 'char:selected', 'char:deselected']);
const props = defineProps({
    character: {
        type: Object as PropType<Character>,
        required: true
    }
});
const characterCardPlayed = () => {
    if (gameStore.highlightedCardType=='open'){
        emit('char:targeted', props.character.name);
    }
    else {
        if(gameStore.highlightedCardID == uuid) {
            gameStore.clearHighlight();
            emit('char:deselected');
        } 
        else {
            gameStore.changeHighlight(uuid, 'char', props.character.name, props.character.name)
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