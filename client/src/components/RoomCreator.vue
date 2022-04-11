<script lang="ts">
import { defineComponent, ref } from 'vue';
import {io} from 'socket.io-client';

export default defineComponent({
  name: 'RoomCreator',
  data() {
    return {
      title: 'RoomCreator',
      roomData: {
        password: '',
        roomName: 'noname',
      },
      token: '111',
      socket: io('http://localhost:3000/chat',  {
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
      createRoom() {
          console.log(`send: ${this.roomData}`);
          this.socket.emit('msgToServer', this.roomData);
          this.roomData.roomName='';
          this.roomData.password='';
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
          this.socket = io('http://localhost:3000/chat', socketOptions);
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
      }
  }
})
</script>

<template> 
  <h1>{{ title }}</h1>
            <input v-model="roomData.roomName" type="text"/> <br>
            <input v-model="roomData.password" type="text"/> <br>

            <button type="submit" @click="createRoom">Create</button>
</template>
