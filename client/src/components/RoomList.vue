<template>
  <h1>{{ title }}</h1>
  <h2>{{ useUserStore().token }}</h2>
  <p>
  <ul>
    <li v-for="room of rooms" :key="room" v-on:click="useUserStore().addOne">
      {{ room }}
    </li>
  </ul>
  </p>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { io } from 'socket.io-client';
import { useUserStore } from '../stores/useUser';


const title = 'RoomList';

let rooms = ['Some room', 'Another room', 'Third room'];
let socket = io('http://localhost:3000/chat', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: '12d',
      },
    },
  },
});
const useToken = (token: string) => {
  console.log(`useToken: ${token}`);
  const socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
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
    console.log(`Raised ${event}`);
  });
};
const connectToRoom = (room: string) => {
  console.log(`connecting to ${room}`);
};
onMounted(() => {
  initListeners();
});
</script>

