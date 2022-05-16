<template>
<div class=" max-w-min border-2 border-x-main-blue rounded-md bg-main-bg">
    <img class=" rounded-full border-2 border-main-blue w-20 h-20"  src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" />
    <h3 class=" text-xl">{{props.character.name}}</h3>
    <p>{{props.character.description}}</p>
    <div class="flex flex-row justify-between">
        <h1 class="strength">{{props.character.strength}}</h1>
        <h1 class="survival">{{props.character.survival}}</h1>
    </div>
</div>
</template>

<script lang="ts" setup>
import {PropType} from 'vue'
import {Character} from '../interfaces/game'

const props = defineProps({
    character: {
        type: Object as PropType<Character>,
        required: true
    }
});
</script>

<style scoped>
    .strength {
        @apply text-main-red ml-2;
    }
    .survival {
        @apply text-main-blue mr-2;
    }
    h1 {
        @apply text-xl;
    }
    p {
        @apply text-base
    }
</style>