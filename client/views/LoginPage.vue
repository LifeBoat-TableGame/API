<template>
  <login-form />
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

if (mainStore.token != '') {
  console.log('token exists, redirecting to main');
  router.push('/');
}
else {
  mainStore.register('unknownUser');
}
</script>