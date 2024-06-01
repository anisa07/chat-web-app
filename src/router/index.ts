import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
// import Login from '../Login.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: Dashboard
    // }
  ]
})

export default router
