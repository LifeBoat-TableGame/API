<template>
  <div class="blue">
    <h1>{{ title }}</h1>
    <input v-model="username" type="text" />
    <button type="submit" @click="logIn">Rename</button>
  </div>
</template>


<script lang="ts" setup >

import { useMainStore } from '../stores/main';
import router from '../router';

const mainStore = useMainStore()

const name = 'LoginForm';
const title = 'Login';

let username = '';
const logIn = () => {
  mainStore.renameUser(username);
  console.log('token = \'' + mainStore.token + '\', redirecting to main');
  router.push('/');
};

</script>