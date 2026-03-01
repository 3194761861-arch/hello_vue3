<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginParams } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const loginFormRef = ref<FormInstance>()

const loginForm = reactive<LoginParams>({
  username: 'admin',
  password: '123456',
  remember: false
})

const rules = reactive<FormRules<LoginParams>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '长度至少为 6 个字符', trigger: 'blur' }
  ]
})

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>系统登录</h2>
        <p>Vue3 + TypeScript + Element Plus</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        class="login-form"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名 (admin)"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码 (123456)"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin(loginFormRef)"
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin(loginFormRef)"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <p>测试账号：admin / 123456 (管理员)</p>
          <p>测试账号：editor / 123456 (编辑员)</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.login-header {
  text-align: center;
  margin-bottom: 40px;
}
.login-header h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}
.login-header p {
  color: #999;
  font-size: 14px;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.login-button {
  width: 100%;
}
.login-hint {
  margin-top: 20px;
  padding: 10px;
  background-color: #f6f8fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}
</style>
