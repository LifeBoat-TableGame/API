<template>
      <login-form></login-form>
</template>

<script>
import { defineComponent } from 'vue'
  import LoginForm from '../src/components/LoginForm.vue'
  export default defineComponent({
  name: 'LoginTemp',
  components: {
    'login-form': LoginForm
  },
})
</script>