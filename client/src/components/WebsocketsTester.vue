<template>
  <h1>{{ title }}</h1>
  <input v-model="namet" type="text" />
  <button type="submit" @click="renameUser">Rename</button>

  <input v-model="text" type="text" />
  <p>
  <ul>
    <li v-for="msg of messages" :key="msg">
      {{ msg }}
    </li>
  </ul>
  </p>
  <button @click="getSupply">Water</button>
  <button @click="register">Tokenize</button>
  <button @click="createRoom">CreateRoom</button>
  <button @click="joinRoom">JoinRoom</button>
  <button @click="leaveRoom">LeaveRoom</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { io } from 'socket.io-client';

export default defineComponent({
  name: 'WebsocketsTester',
  data() {
    return {
      title: 'Websockets Tester',
      text: '',
      namet: 'noname',
      messages: ['Some message', 'Another message'],
      token: '111',
      socket: io('http://localhost:3000/menu', {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: '12d',
            }
          }
        }
      }),
    }
  },
  created() {
    this.initListeners();
  },
  methods: {
    renameUser() {
      console.log(`rename: ${this.namet}`);
      this.socket.emit('rename', this.namet);
    },
    register() {
      console.log(`register: ${this.namet}`);
      this.socket.emit('register');
    },
    createRoom() {
      this.socket.emit('createRoom', 'My room!');
    },
    joinRoom() {
      this.socket.emit('joinRoom', +this.text);
    },
    leaveRoom() {
      this.socket.emit('leaveRoom', +this.text);
    },
    getRooms() {
      this.socket.emit('getRooms');
    },
    getSupply() {
      this.socket.emit('getSupply', 'Water');
    },
    useToken(token: string) {
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
      this.socket = io('http://localhost:3000/menu', socketOptions);
      this.initListeners();
    },
    initListeners() {
      this.socket.on('registered', (token) => {
        this.useToken(token);
      });
      this.socket.on('UserUpdated', () => {
        console.log('name changed');
      });
      this.socket.on('supplyInfo', (supply) => {
        console.log(supply);
      });
      this.socket.onAny((event, ...args) => {
        console.log(`Raised ${event}`)
      });
      this.socket.on('updateRooms', (res) => {
        console.log(JSON.parse(res));
      });
    }
  }
})
</script>

