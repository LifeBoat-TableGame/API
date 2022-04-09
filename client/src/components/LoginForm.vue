<script lang="ts">
import { defineComponent, ref } from 'vue';
import {io} from 'socket.io-client';

export default defineComponent({
  name: 'LoginForm',
  data() {
    return {
      title: 'Login',
      text: '',
      namet: 'noname',
      messages: ['Some message', 'Another message'],
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
  },
  methods: {
  }
})
</script>

<template> 
  <h1>{{ title }}</h1>
</template>
