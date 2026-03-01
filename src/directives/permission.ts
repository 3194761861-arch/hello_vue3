import type { App, Directive } from 'vue'
import { useUserStore } from '@/stores/user'
import { Role } from '@/types/user'

const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const role = userStore.userInfo?.role

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value as Role[]
      const hasPermission = role && permissionRoles.includes(role as Role)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

export const setupPermissionDirective = (app: App) => {
  app.directive('permission', permission)
}
