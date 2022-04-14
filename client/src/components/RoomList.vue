<template>
  <h1>{{ title }}</h1>
  <p>
  <ul>
    <li v-for="room of rooms" :key="room" v-on:click="connectToRoom(room)">
      {{ room }}
    </li>
  </ul>
  </p>
</template>


<script lang="ts" setup>
import { useMainStore } from '../stores/main';

const mainStore = useMainStore()
const title = 'RoomList';

let rooms = ['Some room', 'Another room', 'Third room'];


const connectToRoom = (room: string) => {
  console.log('connecting to ', {room});
}
</script>

