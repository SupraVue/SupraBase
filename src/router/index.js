import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/database/local',
      name: 'local-database',
      component: () => import('../views/LocalDatabase.vue')
    },
    {
      path: '/database/mysql',
      name: 'mysql-database',
      component: () => import('../views/MySQLDatabase.vue')
    }
  ]
})

export default router 