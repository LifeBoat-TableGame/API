import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/main'
import './assets/styles/main.css';
import { getLoginData } from './utils/login'
import { io } from 'socket.io-client'
import { ExtendedSocket, SocketKey } from './utils/socket.extension'

const app = createApp(App);
app
    .use(router)
    .use(createPinia())
//ADD: check for token here
const mainStore = useMainStore();
fetch('http://localhost:3000/api/token').then(res => res.text()).then(data => {
    const { token, id } = JSON.parse(data);
    mainStore.selfId = id;
    app.provide(SocketKey, io('http://localhost:3000/', { 
        extraHeaders: { Authorization: token } 
    }) as ExtendedSocket);
    app.mount('#app');
});
//router.push('/login');
