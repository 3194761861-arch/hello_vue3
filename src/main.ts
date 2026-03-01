import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'

import App from './App.vue'
import router from './router'
import './router/permission' // Import permission control
import { setupPermissionDirective } from '@/directives/permission'
import { lazy } from '@/directives/lazy'

import './assets/main.css'

const app = createApp(App)

// Global Error Handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Error:', err)
  console.error('Instance:', instance)
  console.error('Info:', info)
  ElMessage.error('系统出错了，请稍后再试')
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
setupPermissionDirective(app)
app.directive('lazy', lazy)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
