<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import SidebarItem from './SidebarItem.vue'

const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const routes = computed(() => permissionStore.routes)
</script>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="false"
      :collapse-transition="false"
      mode="vertical"
      router
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<style scoped>
.scrollbar-wrapper {
  height: 100%;
}
</style>
