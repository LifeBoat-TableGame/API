<template>
  <room-creator/>
  <room-list/>
</template>

<script>
import { defineComponent } from 'vue'
  import RoomList from '../src/components/RoomList.vue'
import RoomCreator from '../src/components/RoomCreator.vue'
  export default defineComponent({
  name: 'MainTemp',
  components: {
    "room-list": RoomList,
    "room-creator": RoomCreator
},
})
</script>