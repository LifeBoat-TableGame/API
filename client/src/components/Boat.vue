<template>
    <div class=" grid grid-rows-3 grid-flow-col auto-rows-fr justify-center items-center">
        <CharacterCard class=" row-start-2 text-center border-highlight" v-for="item in sortedCharacters" :character="item.character"  @char:targeted="TargetChar" @char:selected="SelectChar">
        <ActionPopup v-if=popup :options="options" @option:chosen="doAction"></ActionPopup>
        </CharacterCard>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { CharacterQueue } from '../interfaces/game';
import CharacterCard from './CharacterCard.vue';
import ActionPopup from './ActionPopup.vue';

const props = defineProps({
    characters: {
        type: Object as PropType<CharacterQueue[]>,
        required: true
    }
});

const emit = defineEmits(['char:targeted', 'char:swap'])
const TargetChar = (charName: string) => {
  emit('char:targeted', charName);
}

const options = [{name:'swap', text: 'Поменяться', id: null}];
let popup = false;
const SelectChar = () => {
    popup = true;
}
const doAction = (optionName:string) => {
    if(optionName='swap') {
        emit('char:swap');
    }
    popup = false;
}
const sortedCharacters = computed(() => {
    return props.characters.sort((a, b) => a.order - b.order);
});
</script>