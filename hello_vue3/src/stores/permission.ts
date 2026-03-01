import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router'
import { Role } from '@/types/user'

const hasPermission = (roles: Role[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta?.roles?.includes(role))
  }
  return true
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: Role[]) => {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  const generateRoutes = (roles: Role[]) => {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      let accessedRoutes
      if (roles.includes(Role.Admin)) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      addRoutes.value = accessedRoutes
      routes.value = constantRoutes.concat(accessedRoutes)
      resolve(accessedRoutes)
    })
  }

  return {
    routes,
    addRoutes,
    generateRoutes
  }
})
