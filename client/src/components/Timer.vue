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
const startTimeCompement = {
    m: 60 - props.time.getMinutes(),
    s: 60 - props.time.getSeconds(),
}
const timeBoard = computed(() => {
    if(props.time) {
        let m = (props.time.getMinutes() + startTimeCompement.m) % 60;
        let s = (props.time.getSeconds() + startTimeCompement.s) % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    }
    else return "--:--";
});
</script>

<style lang="postcss" scoped>
h1 {
    @apply text-6xl relative top-1/3 text-center
}
</style>