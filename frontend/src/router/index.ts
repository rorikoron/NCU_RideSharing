import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue'),
        },
        {
            path: '/propose',
            name: 'propose',
            component: () => import('@/views/propose/index.vue'),
        },{
            path: '/feedback',
            name: 'feedback',
            component: () => import('@/views/Feedback.vue')
        },{
            path: '/notification',
            name: 'notification',
            component: () => import('@/views/Notification.vue')
        },{
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/Profile.vue')
        },
        {
            path: '/propose/:id',
            name: 'propose-detail',
            component: () => import('@/views/propose/[id].vue'),
            props: true,
        }

    ]
})
export default router
