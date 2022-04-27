<template>
    <login-form class="mx-auto relative top-1/3"/>
</template>

<script setup lang="ts">
import { useMainStore } from '../src/stores/main';
import LoginForm from '../src/components/LoginForm.vue'
import router from '../src/router';

const name = 'LoginTemp';
const components = {
  'login-form': LoginForm,
};
const mainStore = useMainStore();

console.log('loading ', name, ' with token \'' + mainStore.token + '\'')
</script>