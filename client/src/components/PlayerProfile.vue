<template>
    <h1>{{ name }}</h1>
    <div class="flex flex-row gap-2">
        <img class=" rounded-full border-highlight w-20 h-20"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
        <ClosedHand :amount="closedSuppliesAmount" />
        <Hand :supplies="openSupplies" :type="'other'" :cardH="4.2" :cardW="2.8" :tilted="false" :playable="true" :handW="12" @card:clicked="selectSupply"/>
        <ActionPopup :options="options" @option:chosen=""></ActionPopup>
    </div>
</template>

<script lang="ts" setup>
    import ClosedHand from './ClosedHand.vue';
    import Card from './Card.vue';
    import { PropType } from 'vue';
    import { Supply } from '../interfaces/game';
    import Hand from './Hand.vue';
    import ActionPopup from './ActionPopup.vue';

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
    let popup = false;
    const selectSupply = () => {
        popup = true;
    }
    const doAction = (optionName:string) => {
        if(optionName='demand') {
            emit('card:demand');
        }
        popup = false;
    }
    const components = [
        ClosedHand
    ];
</script>

