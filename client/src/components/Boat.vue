<template>
    <div class=" grid grid-rows-3 grid-flow-col auto-rows-fr justify-center items-center">
        <ActionPopup v-show=popupActive :options="options" @option:chosen="doAction" class="pb-[-1rem]"></ActionPopup>
        <div>
            <button type="submit" @click="TakeSide(FightRole.Atacker)" class="btn bg-main-red">Встать на сторону</button>
            <button type="submit" @click="TakeSide(FightRole.Neutral)" class="btn bg-main-blue">Не Встревать</button>
            <button type="submit" @click="TakeSide(FightRole.Defender)" class="btn bg-olive-400">Встать на сторону</button>
        </div>
        <CharacterCard class=" row-start-2 text-center border-highlight" :class="['row-start-2', 'text-center', 'border-highlight']" v-for="item in sortedCharacters" :character="item.character"  
        @char:targeted="TargetChar">
        </CharacterCard>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { CharacterQueue, GameState, FightRole } from '../interfaces/game';
import CharacterCard from './CharacterCard.vue';
import ActionPopup from './ActionPopup.vue';
import { useGameStore } from '../stores/game';

const props = defineProps({
    characters: {
        type: Object as PropType<CharacterQueue[]>,
        required: true
    }
});


const gameStore = useGameStore();
const emit = defineEmits(['char:targeted', 'char:swap', 'takeSide'])
const TargetChar = (charName: string) => {
  emit('char:targeted', charName);
}

const popupActive = computed(() => gameStore.highlightedCardType == 'char')

const options = [{name:'swap', text: 'Поменяться', id: null}];
const doAction = (optionName:string) => {
    if(optionName='swap') {
        emit('char:swap');
    }
}
const TakeSide = (side:FightRole) => {
    emit('takeSide', side);
}
const sortedCharacters = computed(() => {
    return props.characters.sort((a, b) => a.order - b.order);
});
</script>