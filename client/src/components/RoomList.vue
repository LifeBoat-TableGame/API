<script lang="ts">
import { defineComponent, ref } from 'vue';
import {io} from 'socket.io-client';

export default defineComponent({
  name: 'RoomList',
  data() {
    return {
      title: 'RoomList',
      text: '',
      namet: 'noname',
      rooms: ['Some room', 'Another room', 'Third room'],
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
      sendMessage() {
          console.log(`send: ${this.text}`);
          this.socket.emit('msgToServer', this.text);
          this.text = "";
      },
      register() {
        console.log(`register: ${this.namet}`);
          this.socket.emit('register');
      },
      receiveMessage(msg: string) {
          console.log(`recv: ${msg}`);
          this.rooms.push(msg);
      },
      getSupply() {
          this.socket.emit('getSupply', 'Water');
      },
      connectToRoom(room:string){
          this.$store.commit('CHANGE_USER')
          console.log(`connecting to ${room}`);
          console.log(this.$store.state.userData)
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
          this.socket.on('msgToClient', (msg) => {
              this.receiveMessage(msg);
          });
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
        <p>
            <ul>
                <li 
                  v-for="room of rooms"
                  :key="room"
                v-on:click="connectToRoom(room)"
                >
                {{ room }}
                </li>
            </ul>
        </p>
</template>
