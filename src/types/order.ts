export enum OrderStatus {
  PendingPayment = 'pending_payment',
  PendingShipment = 'pending_shipment',
  Shipped = 'shipped',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface OrderAddress {
  name: string
  phone: string
  address: string
}

export interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: number
  orderNo: string
  amount: number
  status: OrderStatus
  paymentMethod: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  createTime: string
  payTime?: string
  deliveryTime?: string
  finishTime?: string
  items: OrderItem[]
  logisticsCompany?: string
  logisticsNo?: string
  remark?: string
}

export interface OrderQuery {
  page: number
  pageSize: number
  orderNo?: string
  status?: OrderStatus
  startDate?: string
  endDate?: string
}

export interface OrderListResponse {
  list: Order[]
  total: number
}
