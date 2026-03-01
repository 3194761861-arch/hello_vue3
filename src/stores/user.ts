import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, LoginParams } from '@/types/user'
import { login as loginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // Actions
  const login = async (params: LoginParams) => {
    try {
      const res = await loginApi(params)
      token.value = res.token
      userInfo.value = res.userInfo
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
      token.value = ''
      userInfo.value = null
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await getUserInfoApi()
      userInfo.value = res
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    token,
    userInfo,
    login,
    logout,
    getUserInfo
  }
}, {
  persist: true
})
