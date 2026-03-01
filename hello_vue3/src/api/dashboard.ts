import request from './request'

// Type definitions for Dashboard Data
export interface DashboardStats {
  todaySales: number
  todayOrders: number
  todayVisits: number
  totalSales: number
}

export interface SalesTrend {
  dates: string[]
  sales: number[]
  orders: number[]
}

export interface ProductCategory {
  name: string
  value: number
}

export interface HotProduct {
  id: number
  name: string
  sales: number
}

export interface DashboardData {
  stats: DashboardStats
  trend: SalesTrend
  categories: ProductCategory[]
  hotProducts: HotProduct[]
}

// Mock Data
const mockData: DashboardData = {
  stats: {
    todaySales: 12580.00,
    todayOrders: 56,
    todayVisits: 1205,
    totalSales: 895600.00
  },
  trend: {
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sales: [12000, 13500, 11000, 15000, 18000, 22000, 25000],
    orders: [50, 65, 45, 70, 85, 110, 130]
  },
  categories: [
    { name: 'Electronics', value: 45 },
    { name: 'Computers', value: 25 },
    { name: 'Audio', value: 15 },
    { name: 'Wearables', value: 10 },
    { name: 'Others', value: 5 }
  ],
  hotProducts: [
    { id: 1, name: 'iPhone 15 Pro Max', sales: 1200 },
    { id: 2, name: 'MacBook Pro M3', sales: 850 },
    { id: 3, name: 'AirPods Pro 2', sales: 650 },
    { id: 4, name: 'iPad Air 5', sales: 420 },
    { id: 5, name: 'Apple Watch S9', sales: 380 },
    { id: 6, name: 'Sony WH-1000XM5', sales: 320 },
    { id: 7, name: 'Dell XPS 15', sales: 280 },
    { id: 8, name: 'Samsung S24 Ultra', sales: 250 },
    { id: 9, name: 'Nintendo Switch', sales: 220 },
    { id: 10, name: 'Kindle Paperwhite', sales: 180 }
  ]
}

enum API {
  STATS = '/dashboard/stats',
  TREND = '/dashboard/trend',
  HOT = '/dashboard/hot'
}

export const getStatisticsData = () => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<DashboardData>((resolve) => {
      setTimeout(() => {
        resolve(mockData)
      }, 500)
    })
  }
  return request.get<any, DashboardData>(API.STATS)
}
