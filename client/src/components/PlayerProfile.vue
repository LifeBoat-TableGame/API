<template>
    <h1>{{ name }}</h1>
    <div class="flex flex-row gap-2">
        <img class=" rounded-full border-highlight w-20 h-20"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
        <ClosedHand :amount="closedSuppliesAmount" />
        <Hand :supplies="openSupplies" :owner="props.name" :type="'others'" :cardH="4.2" :cardW="2.8" :tilted="false" :playable="true" :handW="12" 
        @card:selected=""
        @card:deselected=""/>
        <ActionPopup v-show=popupActive :options="options" @option:chosen="doAction"></ActionPopup>
    </div>
</template>

<script lang="ts" setup>
    import ClosedHand from './ClosedHand.vue';
    import Card from './Card.vue';
    import { PropType } from 'vue';
    import { Supply } from '../interfaces/game';
    import { ref, computed } from 'vue'
    import Hand from './Hand.vue';
    import ActionPopup from './ActionPopup.vue';
    import { useGameStore } from '../stores/game';

    const gameStore = useGameStore();
    const emit = defineEmits(['card:demand'])
    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        openSupplies: {
            type: Object as PropType<Supply[]>,
            required: true,
        },
        closedSuppliesAmount: {
            type: Number,
            required: true,
        }
    });
    const options = [{name:'demand', text: 'Потребовать', id: null}];
  
    const popupActive = computed(() => gameStore.highlightedCardOwner==props.name && gameStore.highlightedCardType=='others');

    const doAction = (optionName:string) => {
        if(optionName='demand') {
            emit('card:demand');
        }
    }
    const components = [
        ClosedHand
    ];
</script>

