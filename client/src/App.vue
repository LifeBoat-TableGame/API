<template>
  <div class="h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">import { inject, onBeforeMount, onMounted } from 'vue';
import { Game, Player, Supply } from './interfaces/game';
import { Room } from './interfaces/room';
import { Events } from './interfaces/subscription';
import router from './router';
import { useGameStore } from './stores/game';
import { useMainStore } from './stores/main';
import { useRoomStore } from './stores/rooms';
import { SocketKey } from './utils/socket.extension';

const gameStore = useGameStore();
const mainStore = useMainStore();
const socket = inject(SocketKey);
if(socket == undefined)
  throw new Error("Connection dropped");

onBeforeMount(() => {
  mainStore.activeRoomId = +( localStorage.getItem("activeRoom") ?? 0);
});
onMounted(() => {
  console.log(socket);
  socket.subscribeToEvent(Events.RoomCreated, (id: number) => {
    console.log(`room created with id: ${id}`);
    mainStore.activeRoomId = id;
    mainStore.isAdmin = true;
    localStorage.setItem("activeRoom", id.toString());
  });
  socket.subscribeToEvent(Events.GameStarted, (game: any) => {
    router.push('/game')
  });
  socket.subscribeToEvent(Events.UserUpdated, (name: string) => {
    mainStore.name = name;
  });
  socket.subscribeToEvent(Events.RoomsUpdated, (rooms: Room[]) => {
    console.log(rooms);
    useRoomStore().updateRooms(rooms)
  });
  socket.subscribeToEvent(Events.UserJoined, (res) => {
    if (res.id == mainStore.selfId) {
      mainStore.activeRoomId = res.lobby;
      localStorage.setItem('room', res.lobby.toString());
    }
      console.log(`User ${res.username} has joined!`);
  });
  socket.subscribeToEvent(Events.ChooseNavigation, (navs: any) => {
    console.log(navs);
  });
  socket.subscribeToEvent(Events.CardsToChoose, (supplies: Supply[]) => {
    console.log(supplies);
    useGameStore().setPick(supplies);
    console.log(supplies);
  });
  socket.subscribeToEvent(Events.GameInfo, (game: Game) => {
    console.log('setting game');
    useGameStore().setGame(game);
  });
  socket.subscribeToEvent(Events.PlayerInfo, (player: Player) => {
    console.log('setting player');
    useGameStore().setPlayer(player);
  });
  socket.subscribeToEvent(Events.ShowChosenNavigation, (navs: any) => {
    console.log(navs);
  });
  socket.subscribeToEvent(Events.Error, (description: any) => {
    console.log(description);
  });
});
</script>