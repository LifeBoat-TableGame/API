<template>
    <h1>{{ name }}</h1>
    <div class="flex flex-row gap-2">
        <img class=" rounded-full border-highlight w-20 h-20"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
        <ClosedHand :amount="closedSuppliesAmount" />
        <Hand :supplies="openSupplies" :cardH="4.2" :cardW="2.8" :tilted="false" :handW="12"/>
    </div>
</template>

<script lang="ts" setup>
    import ClosedHand from './ClosedHand.vue';
    import Card from './Card.vue';
    import { PropType } from 'vue';
    import { Supply } from '../interfaces/game';
    import Hand from './Hand.vue';

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
    const components = [
        ClosedHand
    ];
</script>

