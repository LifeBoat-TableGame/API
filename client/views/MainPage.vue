<template>
      <websockets-tester></websockets-tester>
</template>

<script>
import { defineComponent } from 'vue'
  import WebsocketsTester from '../src/components/WebsocketsTester.vue'
  export default defineComponent({
  name: 'MainTemp',
  components: {
    'websockets-tester': WebsocketsTester
  },
})
</script>