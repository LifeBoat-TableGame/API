import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/main'

const app = createApp(App);
app
    .use(router)
    .use(createPinia())

const mainStore = useMainStore();
//ADD: check for token here
mainStore.initListeners();

app.mount('#app');
