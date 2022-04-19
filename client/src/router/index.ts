import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () =>
            import ('/views/MainPage.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('/views/LoginPage.vue')
    },
    {
        path: '/game',
        name: 'Game',
        component: () =>
            import ('/views/GamePage.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router