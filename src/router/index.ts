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
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/loginView/loginView.vue')
    },
    {
      path: '/add',
      name: 'add',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/addView/addView.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/detailView/detailView.vue')
    },
    {
      path: '/trend',
      name: 'trend',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/trendView/trendView.vue')
    },
    {
      path: '/tagManage',
      name: 'tagManage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/tagManageView/tagManage.vue')
    },
    {
      
      path: '/MyCalendar',
      name: 'MyCalendar',
      component: () => import('../views/myCalendarView/myCalendarView.vue')
    }
  ]
})

export default router
