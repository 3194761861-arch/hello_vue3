<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="sidebar-container">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>电商后台管理系统</h1>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userStore.userInfo?.name || '用户' }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}
.sidebar-container {
  background-color: #304156;
  height: 100%;
  overflow: hidden;
}
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
