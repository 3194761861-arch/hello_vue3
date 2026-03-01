<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
  basePath: string
}>()

const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false
    } else {
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    return true
  }

  return false
}

const resolvePath = (routePath: string) => {
  if (/^https?:\/\//.test(routePath)) {
    return routePath
  }
  if (/^https?:\/\//.test(props.basePath)) {
    return props.basePath
  }
  return props.basePath === '/'
    ? `/${routePath}`
    : `${props.basePath}/${routePath}`.replace(/\/+/g, '/')
}

const onlyOneChild = computed(() => {
  const children = props.item.children || []
  const showingChildren = children.filter((item) => !item.meta?.hidden)
  if (showingChildren.length === 1) {
    return showingChildren[0]
  }
  if (showingChildren.length === 0) {
    return { ...props.item, path: '', noShowingChildren: true }
  }
  return null
})
</script>

<template>
  <div v-if="!item.meta?.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild?.children || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow
      "
    >
      <el-menu-item :index="resolvePath(onlyOneChild?.path || item.path)">
        <el-icon v-if="onlyOneChild?.meta?.icon || item.meta?.icon">
          <component :is="onlyOneChild?.meta?.icon || item.meta?.icon" />
        </el-icon>
        <template #title>{{ onlyOneChild?.meta?.title || item.meta?.title }}</template>
      </el-menu-item>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>
  </div>
</template>
