import request from './request'
import { OrderStatus } from '@/types/order'
import type { Order, OrderQuery, OrderListResponse } from '@/types/order'

// Mock Data
let orderList: Order[] = Array.from({ length: 50 }).map((_, index) => {
  const statusValues = Object.values(OrderStatus)
  const status = statusValues[Math.floor(Math.random() * statusValues.length)]
  const id = index + 1
  return {
    id,
    orderNo: `ORD${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}${id}`,
    amount: Math.floor(Math.random() * 10000) / 100,
    status,
    paymentMethod: Math.random() > 0.5 ? 'WeChat Pay' : 'Alipay',
    receiverName: `User ${id}`,
    receiverPhone: `1380000${String(id).padStart(4, '0')}`,
    receiverAddress: `No. ${id} Street, City`,
    createTime: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleString(),
    items: [
      {
        productId: 1,
        productName: 'iPhone 15 Pro',
        price: 7999,
        quantity: 1,
        image: 'https://via.placeholder.com/100'
      }
    ],
    remark: ''
  }
})

enum API {
  LIST = '/order/list',
  DETAIL = '/order/detail',
  STATUS = '/order/status',
  REMARK = '/order/remark'
}

export const getOrderList = (query: OrderQuery) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<OrderListResponse>((resolve) => {
      setTimeout(() => {
        let list = [...orderList]

        // Filter by orderNo
        if (query.orderNo) {
          list = list.filter(item => item.orderNo.includes(query.orderNo!))
        }

        // Filter by status
        if (query.status) {
          list = list.filter(item => item.status === query.status)
        }

        // Filter by date range
        if (query.startDate && query.endDate) {
          const start = new Date(query.startDate).getTime()
          const end = new Date(query.endDate).getTime()
          list = list.filter(item => {
            const time = new Date(item.createTime).getTime()
            return time >= start && time <= end
          })
        }

        const total = list.length
        
        // Pagination
        const start = (query.page - 1) * query.pageSize
        const end = start + query.pageSize
        list = list.slice(start, end)

        resolve({
          list,
          total
        })
      }, 500)
    })
  }
  return request.get<any, OrderListResponse>(API.LIST, { params: query })
}

export const getOrderDetail = (id: number) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<Order>((resolve, reject) => {
      setTimeout(() => {
        const order = orderList.find(item => item.id === id)
        if (order) {
          resolve(order)
        } else {
          reject(new Error('Order not found'))
        }
      }, 500)
    })
  }
  return request.get<any, Order>(`${API.DETAIL}/${id}`)
}

export const updateOrderStatus = (id: number, status: OrderStatus, logistics?: { company: string, no: string }) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const order = orderList.find(item => item.id === id)
        if (order) {
          order.status = status
          if (logistics) {
            order.logisticsCompany = logistics.company
            order.logisticsNo = logistics.no
            order.deliveryTime = new Date().toLocaleString()
          }
          if (status === OrderStatus.Completed) {
            order.finishTime = new Date().toLocaleString()
          }
          resolve()
        } else {
          reject(new Error('Order not found'))
        }
      }, 500)
    })
  }
  return request.post(API.STATUS, { id, status, ...logistics })
}

export const addOrderRemark = (id: number, remark: string) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const order = orderList.find(item => item.id === id)
        if (order) {
          order.remark = remark
          resolve()
        } else {
          reject(new Error('Order not found'))
        }
      }, 500)
    })
  }
  return request.post(API.REMARK, { id, remark })
}
