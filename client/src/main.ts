import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/main'
import './assets/styles/main.css';
import { getLoginData } from './utils/login'
import { io } from 'socket.io-client'
import { SocketKey } from './utils/socket.extension';

const app = createApp(App);
app
    .use(router)
    .use(createPinia())
const mainStore = useMainStore();

getLoginData().then(data => {
    const { token, id } = data;
    mainStore.selfId = id;
    mainStore.token = token;
    const socket = io('http://localhost:3000/', { 
        extraHeaders: { Authorization: token } 
    });
    app.provide(SocketKey, socket);
    app.mount('#app');
});
//router.push('/login');
