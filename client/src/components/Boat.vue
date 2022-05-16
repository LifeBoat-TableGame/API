<template>
    <div class=" grid grid-rows-3 grid-flow-col auto-rows-fr justify-center items-center">
        <CharacterCard class=" row-start-2 text-center border-highlight" v-for="item in sortedCharacters" :character="item.character" />
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { CharacterQueue } from '../interfaces/game';
import CharacterCard from './CharacterCard.vue';

const props = defineProps({
    characters: {
        type: Object as PropType<CharacterQueue[]>,
        required: true
    }
});
const sortedCharacters = computed(() => {
    return props.characters.sort((a, b) => a.order - b.order);
});
</script>