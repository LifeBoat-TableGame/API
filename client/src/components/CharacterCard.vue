<template>
<div class="char-card w-32 h-72 border-2 border-x-main-blue rounded-md flex flex-col noselect game-element" 
:class="[gameStore.highlightedCardID == uuid ? 'ring-2 ring-olive-200' : '']"
@click="characterCardPlayed">
    <div class="text-lg text-olive-900">{{props.character.name}}</div>
    <div class="text-sm leading-4 text-left">
        <div class="text-base leading-5">Сила: {{props.character.strength}}</div>
        <div>Бонус за выживание: {{props.character.survival}}</div>
        <div> {{props.character.description}}</div>
        <div v-for="line of lines" class="text-deep-red leading-4 text-sm"> {{line}} </div>
    </div>
    <!--img :src="'../assets/cards/'+props.character.name+'.jpg'"-->
</div>
</template>

<script lang="ts" setup>
import {PropType, computed} from 'vue'
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

const lines = computed(() => {
    const lines = [] as string [];
    if(gameStore.getPlayerByChar(props.character.name)?.fought)
        lines.push('Дрался')
    if(gameStore.getPlayerByChar(props.character.name)?.Thirst)
        lines.push('Жажда')
    switch(gameStore.getPlayerByChar(props.character.name)?.damage) {
        case 1: { 
            lines.push(gameStore.getPlayerByChar(props.character.name)?.damage+'рана');
            break;
        } 
        case 2:
        case 3:
        case 4: { 
            lines.push(gameStore.getPlayerByChar(props.character.name)?.damage+'раны');
            break;
        } 
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10: { 
            lines.push(gameStore.getPlayerByChar(props.character.name)?.damage+'ран');
            break;
        } 
        default: { 
            break;
        }
    }
    return lines;
});
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
    .char-card:hover{
    @apply
    scale-[1.1]
    duration-100
    z-10
    }
</style>