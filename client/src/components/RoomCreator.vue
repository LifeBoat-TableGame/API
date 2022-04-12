<template>
  <h1>{{ title }}</h1>
  <input v-model="roomData.roomName" type="text" /> <br>
  <input v-model="roomData.password" type="text" /> <br>
  <button type="submit" @click="createRoom">Create</button>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onMounted } from 'vue'


const title = 'RoomCreator';
let roomData = {
  password: '',
  roomName: 'noname',
};
let socket = io('http://localhost:3000/chat', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: '12d',
      }
    }
  }
});

const createRoom = () => {
  console.log(`send: ${roomData}`);
  socket.emit('msgToServer', roomData);
  roomData.roomName = '';
  roomData.password = '';
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
}
onMounted(() => {
  initListeners();
});
</script>