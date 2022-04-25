<template>
  <div class="bg-light-blue vertical-container text-lg rounded-md">
    <p class="text-2xl">{{ title }}</p>
    <input v-model="username" type="text" class="small-field" placeholder="noname"/>
    <button type="submit" @click="logIn" class="btn">Применить</button>
  </div>
</template>


<script lang="ts" setup >

import { useMainStore } from '../stores/main';
import router from '../router';

const mainStore = useMainStore()

const name = 'LoginForm';
const title = 'Войти';

let username = '';
const logIn = () => {
  mainStore.renameUser(username);
  console.log('token = \'' + mainStore.token + '\', redirecting to main');
  router.push('/');
};

</script>