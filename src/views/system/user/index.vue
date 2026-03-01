<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Role } from '@/types/user'

interface UserItem {
  id: number
  username: string
  name: string
  role: Role
  email: string
  status: 'active' | 'inactive'
  createTime: string
}

const loading = ref(false)
const userList = ref<UserItem[]>([
  {
    id: 1,
    username: 'admin',
    name: '超级管理员',
    role: Role.Admin,
    email: 'admin@example.com',
    status: 'active',
    createTime: '2024-01-01'
  },
  {
    id: 2,
    username: 'editor',
    name: '编辑员',
    role: Role.Editor,
    email: 'editor@example.com',
    status: 'active',
    createTime: '2024-01-02'
  },
  {
    id: 3,
    username: 'guest',
    name: '访客',
    role: Role.Guest,
    email: 'guest@example.com',
    status: 'active',
    createTime: '2024-01-03'
  }
])

const getRoleTagType = (role: Role) => {
  switch (role) {
    case Role.Admin:
      return 'danger'
    case Role.Editor:
      return 'warning'
    default:
      return 'info'
  }
}

const getRoleName = (role: Role) => {
  const roleMap: Record<Role, string> = {
    [Role.Admin]: '管理员',
    [Role.Editor]: '编辑员',
    [Role.Guest]: '访客'
  }
  return roleMap[role] || role
}
</script>

<template>
  <div class="user-management-container">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span>用户管理</span>
          <el-button type="primary">新增用户</el-button>
        </div>
      </template>

      <el-table :data="userList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">{{ getRoleName(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.user-management-container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
