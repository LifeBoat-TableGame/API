<template>
    <div class="container">
        <div v-for="seagull in amount" class="border-highlight chip">
            <SeagullImage :size="50" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import SeagullImage from "./SeagullImage.vue";

const components = {
    SeagullImage
};
const props = defineProps({
    amount: {
        type: Number,
        default: 0
    }
});

</script>

<style lang="postcss" scoped>
.container {
    @apply flex flex-wrap p-2;
}

.chip {
    @apply m-2 p-3 rounded-full w-fit h-fit bg-light-blue border-light-blue hover:border-dark-blue;
}
</style>