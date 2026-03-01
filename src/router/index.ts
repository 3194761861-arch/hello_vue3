import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { Role } from '@/types/user'

// Extend RouteMeta interface
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    requiresAuth?: boolean
    roles?: Role[]
    hidden?: boolean
  }
}

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, title: '登录' }
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'Odometer', requiresAuth: true }
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页', icon: 'HomeFilled', requiresAuth: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true, title: '404' }
  }
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/product',
    component: BasicLayout,
    meta: { title: '商品管理', icon: 'Goods', roles: [Role.Admin, Role.Editor] },
    children: [
      {
        path: 'index',
        name: 'product',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '商品列表' }
      }
    ]
  },
  {
    path: '/order',
    component: BasicLayout,
    meta: { title: '订单管理', icon: 'List', roles: [Role.Admin, Role.Editor] },
    children: [
      {
        path: 'index',
        name: 'order',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '订单列表' }
      }
    ]
  },
  {
    path: '/system',
    component: BasicLayout,
    meta: { title: '系统管理', icon: 'Setting', roles: [Role.Admin] },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
