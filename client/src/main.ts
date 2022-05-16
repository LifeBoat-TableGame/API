import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/main'
import './assets/styles/main.css';
import { getLoginData } from './utils/login'

const app = createApp(App);
app
    .use(router)
    .use(createPinia())
//ADD: check for token here
const mainStore = useMainStore();
getLoginData().then(data => {
    mainStore.selfId = data.id;
    mainStore.useToken(data.token);
});
//router.push('/login');
app.mount('#app');
