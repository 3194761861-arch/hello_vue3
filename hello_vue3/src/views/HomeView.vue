<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <div class="home">
    <h2>欢迎来到首页</h2>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Pinia 状态管理演示</span>
        </div>
      </template>
      <div class="content">
        <p>计数器: {{ counterStore.count }}</p>
        <p>两倍计数: {{ counterStore.doubleCount }}</p>
        <el-button type="primary" @click="counterStore.increment">增加计数</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
