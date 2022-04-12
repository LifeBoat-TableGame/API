<template>
  <h1>{{ title }}</h1>
  <input v-model="username" type="text" />
  <br>
  <button type="submit" @click="renameUser">Rename</button>
</template>


<script lang="ts" setup>

import { io } from 'socket.io-client';
import { onMounted } from 'vue';
const name = 'LoginForm';
const title = 'Login';
const text = '';
const username = '';
const token = '111';
let socket = io('http://localhost:3000/chat', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: '12d',
      }
    }
  }
});

const renameUser = () => {
  console.log(`rename: ${username}`);
  socket.emit('rename', username);
};
const logIn = () => {
  renameUser();
};
const register = () => {
  console.log(`register: ${username}`);
  socket.emit('register');
};
const useToken = (token: string) => {
  console.log(`useToken: ${token}`);
  const socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        }
      }
    }
  };
  socket = io('http://localhost:3000/chat', socketOptions);
  initListeners();
};
const initListeners = () => {
  socket.on('registered', (token) => {
    useToken(token);
  });
  socket.on('UserUpdated', () => {
    console.log('name changed');
  });
  socket.onAny((event, ...args) => {
    console.log(`Raised ${event}`)
  });

  onMounted(() => {
    initListeners();
  });
}
</script>