import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/main'
import './assets/styles/main.css';

const app = createApp(App);
app
    .use(router)
    .use(createPinia())
//ADD: check for token here
const mainStore = useMainStore();
fetch('http://localhost:3000/api/token').then(res => res.text()).then(data => {
    const { token, id } = JSON.parse(data);
    mainStore.selfId = id;
    mainStore.useToken(token);
});
//router.push('/login');
app.mount('#app');
