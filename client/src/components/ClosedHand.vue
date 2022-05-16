<template>
    <div class="flex flex-row items-center gap-1 mr-5">
        <div class="card relative">
          <h4 class="absolute mx-5 my-5 text-sm">x{{ amount }}</h4>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
      amount: {
        type: Number,
        default: 0,
      }
    });
</script>

<style scoped>
.card {
  @apply 
  bg-dark-bg 
  text-2xl 
  border-2 
  w-5 h-10
  border-dark-blue 
  origin-[50%_100%] 
}
</style>