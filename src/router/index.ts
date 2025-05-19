import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homeView/homeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/addOrder',
      name: 'addOrder',
      component: () => import('../views/addOrder/addOrder.vue')
    },
    {
      path: '/testPage',
      name: 'testPage',
      component: () => import('../views/testPage/testPage.vue')
    }
  ]
})

export default router
