<template>
  <div class="bg-light-blue vertical-container text-lg rounded-md w-fit">
    <p class="text-2xl">{{ title }}</p>
    <input v-model="username" type="text" class="small-field" placeholder="noname" v-on:keyup.enter="logIn"/>
    <button type="submit" @click="logIn" class="btn">Применить</button>
  </div>
</template>


<script lang="ts" setup >

import { useMainStore } from '../stores/main';
import router from '../router';
import { inject } from 'vue';
import { SocketKey } from '../utils/socket.extension';
import { MessageType } from '../interfaces/message';

const mainStore = useMainStore()
const socket = inject(SocketKey);
if(socket == undefined)
  throw new Error("Connection dropped.");

const name = 'LoginForm';
const title = 'Войти';

let username = '';
const logIn = () => {
  socket.sendMessage(MessageType.Rename, username);
  console.log('token = \'' + mainStore.token + '\', redirecting to main');
  router.push('/');
};

</script>