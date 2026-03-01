import request from './request'
import type { LoginParams, LoginResponse, UserInfo } from '@/types/user'
import { Role } from '@/types/user'

enum API {
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  USER_INFO = '/auth/user/info'
}

// Login API
export const login = (data: LoginParams) => {
  // Mock login for demo purposes since we don't have a real backend
  if (import.meta.env.MODE === 'development') {
    return new Promise<LoginResponse>((resolve, reject) => {
      setTimeout(() => {
        if (data.username === 'admin' && data.password === '123456') {
          localStorage.setItem('mock_role', Role.Admin)
          resolve({
            token: 'mock-token-admin-123456',
            userInfo: {
              id: 1,
              username: 'admin',
              role: Role.Admin,
              avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              name: '超级管理员'
            }
          })
        } else if (data.username === 'editor' && data.password === '123456') {
          localStorage.setItem('mock_role', Role.Editor)
          resolve({
            token: 'mock-token-editor-123456',
            userInfo: {
              id: 2,
              username: 'editor',
              role: Role.Editor,
              avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              name: '编辑员'
            }
          })
        } else if (data.username === 'guest' && data.password === '123456') {
          localStorage.setItem('mock_role', Role.Guest)
          resolve({
            token: 'mock-token-guest-123456',
            userInfo: {
              id: 3,
              username: 'guest',
              role: Role.Guest,
              avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              name: '访客'
            }
          })
        } else {
          reject(new Error('用户名或密码错误 (请尝试 admin/123456 或 editor/123456)'))
        }
      }, 1000)
    })
  }
  return request.post<any, LoginResponse>(API.LOGIN, data)
}

// Logout API
export const logout = () => {
  // Mock logout
  if (import.meta.env.MODE === 'development') {
    localStorage.removeItem('mock_role')
    return Promise.resolve()
  }
  return request.post(API.LOGOUT)
}

// Get User Info API
export const getUserInfo = () => {
  // Mock get user info
  if (import.meta.env.MODE === 'development') {
    const role = localStorage.getItem('mock_role') || Role.Admin
    const username = role
    const name = role.charAt(0).toUpperCase() + role.slice(1)

    let id = 1
    if (role === Role.Editor) id = 2
    if (role === Role.Guest) id = 3

    return Promise.resolve<UserInfo>({
      id,
      username,
      role: role as Role,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      name
    })
  }
  return request.get<any, UserInfo>(API.USER_INFO)
}
