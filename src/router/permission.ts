import router from './index'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { Role } from '@/types/user'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  // Start progress bar
  NProgress.start()

  // Set page title
  document.title = (to.meta.title as string) || 'Vue3 Admin'

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check if user has obtained his permission roles
      const hasRoles = userStore.userInfo && userStore.userInfo.role
      // Check if dynamic routes have been generated
      const hasRoutes = permissionStore.routes && permissionStore.routes.length > 0

      if (hasRoles && hasRoutes) {
        next()
      } else {
        try {
          // Get user info if not exists
          let role = userStore.userInfo?.role
          if (!role) {
            const userInfo = await userStore.getUserInfo()
            role = userInfo.role
          }

          // Generate accessible routes map based on roles
          const roles = Array.isArray(role) ? role : [role]
          const accessRoutes = await permissionStore.generateRoutes(roles as Role[])

          // Dynamically add accessible routes
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // Hack method to ensure that addRoutes is complete
          next({ ...to, replace: true })
        } catch (error) {
          // Remove token and go to login page to re-login
          await userStore.logout()
          ElMessage.error(error instanceof Error ? error.message : 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // Finish progress bar
  NProgress.done()
})
