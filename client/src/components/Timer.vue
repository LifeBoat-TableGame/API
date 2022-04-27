<template>
    <h1>{{ timeBoard }}</h1>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

const props = defineProps({
    time: {
        type: Object as PropType<Date> | null,
        required: true
    }
});

const timeBoard = computed(() => {
    if(props.time)
        return `${Math.ceil(props.time.getSeconds() / 60)}:${props.time.getSeconds() % 60}`;
    else return "--:--";
});
</script>

<style scoped>
h1 {
    @apply text-6xl relative top-1/3 text-center
}
</style>