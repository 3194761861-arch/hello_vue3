<script setup lang="ts">
import { computed } from 'vue'
import { OrderStatus } from '@/types/order'
import type { Order } from '@/types/order'
import {
  User,
  Location,
  Tickets,
  Timer,
  Van,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const handleClose = () => {
  emit('update:visible', false)
}

const activeStep = computed(() => {
  if (!props.order) return 0
  const status = props.order.status
  switch (status) {
    case OrderStatus.PendingPayment:
      return 0
    case OrderStatus.PendingShipment:
      return 1
    case OrderStatus.Shipped:
      return 2
    case OrderStatus.Completed:
      return 3
    case OrderStatus.Cancelled:
      return 4
    default:
      return 0
  }
})

const statusType = computed(() => {
  if (!props.order) return ''
  switch (props.order.status) {
    case OrderStatus.Completed:
      return 'success'
    case OrderStatus.Cancelled:
      return 'danger'
    case OrderStatus.PendingPayment:
      return 'warning'
    default:
      return 'primary'
  }
})
const getStatusText = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PendingPayment]: '待付款',
    [OrderStatus.PendingShipment]: '待发货',
    [OrderStatus.Shipped]: '已发货',
    [OrderStatus.Completed]: '已完成',
    [OrderStatus.Cancelled]: '已取消'
  }
  return statusMap[status] || status
}

const getPaymentText = (method: string) => {
  const paymentMap: Record<string, string> = {
    'WeChat Pay': '微信支付',
    Alipay: '支付宝',
    'Credit Card': '信用卡',
    'Bank Transfer': '银行转账'
  }
  return paymentMap[method] || method
}
</script>

<template>
  <el-drawer :model-value="visible" title="订单详情" size="50%" @close="handleClose">
    <div v-if="order" class="order-detail">
      <!-- Steps -->
      <el-steps :active="activeStep" finish-status="success" align-center class="mb-4">
        <el-step title="下单" :icon="Tickets" />
        <el-step title="付款" :icon="Timer" />
        <el-step title="发货" :icon="Van" />
        <el-step title="完成" :icon="CircleCheck" />
      </el-steps>

      <el-divider content-position="left">基础信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="statusType">{{ getStatusText(order.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ order.amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{
          getPaymentText(order.paymentMethod)
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ order.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ order.updateTime || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">收货人信息</el-divider>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="收货人">
          <el-icon><User /></el-icon> {{ order.receiverName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ order.receiverPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">
          <el-icon><Location /></el-icon> {{ order.receiverAddress }}
        </el-descriptions-item>
        <el-descriptions-item v-if="order.logisticsCompany" label="物流信息">
          {{ order.logisticsCompany }} ({{ order.logisticsNo }})
        </el-descriptions-item>
      </el-descriptions>

      <el-divider v-if="order.remark" content-position="left">备注信息</el-divider>
      <div v-if="order.remark" class="remark-box">
        {{ order.remark }}
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.order-detail {
  padding: 0 20px;
}
.mb-4 {
  margin-bottom: 20px;
}
.remark-box {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
}
</style>
