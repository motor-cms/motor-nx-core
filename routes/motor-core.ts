import { RouteRecordRaw } from 'vue-router'
import checkAuth from '@/router/checkAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'admin.login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // beforeEnter: checkAuth,
    meta: {
      layout: 'AuthLayout', // we add new meta layout here to use it later
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/admin/Login.vue'),
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    beforeEnter: checkAuth,
    meta: {
      layout: 'AdminLayout', // we add new meta layout here to use it later
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/admin/Dashboard.vue'),
  },
]

export default routes
