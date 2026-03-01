// Role enum
export enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Guest = 'guest'
}

// User info interface
export interface UserInfo {
  id: number
  username: string
  role: Role | string
  avatar: string
  name?: string
  email?: string
}

// Login params interface
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// Login response interface
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}
