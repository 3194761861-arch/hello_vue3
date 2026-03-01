<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, View, Edit, Promotion, List } from '@element-plus/icons-vue'
import { getOrderList, updateOrderStatus } from '@/api/order'
import type { Order, OrderQuery } from '@/types/order'
import { OrderStatus } from '@/types/order'
import OrderProcess from './components/OrderProcess.vue'
import OrderDetail from './components/OrderDetail.vue'

const loading = ref(false)
const list = ref<Order[]>([])
const total = ref(0)
const query = reactive<OrderQuery>({
  page: 1,
  pageSize: 10,
  orderNo: '',
  status: undefined,
  startDate: '',
  endDate: ''
})

const dateRange = ref<[string, string] | null>(null)

// Dialog controls
const processVisible = ref(false)
const processType = ref<'ship' | 'remark'>('ship')
const currentOrderId = ref<number>(0)
const detailVisible = ref(false)
const currentOrder = ref<Order | null>(null)

const statusOptions = [
  { label: '待付款', value: OrderStatus.PendingPayment },
  { label: '待发货', value: OrderStatus.PendingShipment },
  { label: '已发货', value: OrderStatus.Shipped },
  { label: '已完成', value: OrderStatus.Completed },
  { label: '已取消', value: OrderStatus.Cancelled }
]

const fetchData = async () => {
  loading.value = true
  try {
    if (dateRange.value) {
      query.startDate = dateRange.value[0]
      query.endDate = dateRange.value[1]
    } else {
      query.startDate = undefined
      query.endDate = undefined
    }
    const res = await getOrderList(query)
    list.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.page = 1
  fetchData()
}

const handleReset = () => {
  query.page = 1
  query.pageSize = 10
  query.orderNo = ''
  query.status = undefined
  dateRange.value = null
  fetchData()
}

const handleSizeChange = (val: number) => {
  query.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  query.page = val
  fetchData()
}

const handleDetail = (row: Order) => {
  currentOrder.value = row
  detailVisible.value = true
}

const handleShip = (row: Order) => {
  currentOrderId.value = row.id
  processType.value = 'ship'
  processVisible.value = true
}

const handleRemark = (row: Order) => {
  currentOrderId.value = row.id
  processType.value = 'remark'
  processVisible.value = true
}

const handleCancel = (row: Order) => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateOrderStatus(row.id, OrderStatus.Cancelled)
      ElMessage.success('订单已取消')
      fetchData()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

const handleComplete = (row: Order) => {
  ElMessageBox.confirm('确定要完成该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    try {
      await updateOrderStatus(row.id, OrderStatus.Completed)
      ElMessage.success('订单已完成')
      fetchData()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

const handleProcessSuccess = () => {
  fetchData()
}

const getStatusType = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return 'success'
    case OrderStatus.Cancelled:
      return 'danger'
    case OrderStatus.PendingPayment:
      return 'warning'
    case OrderStatus.PendingShipment:
      return 'primary'
    case OrderStatus.Shipped:
      return 'info'
    default:
      return ''
  }
}

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

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-container">
    <!-- Search Bar -->
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="query">
        <el-form-item label="订单号">
          <el-input
            v-model="query.orderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="query.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Table -->
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
        </div>
      </template>

      <el-table v-loading="loading" :data="list" border style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" align="center" />
        <el-table-column prop="amount" label="订单金额" width="120" align="center">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120" align="center" />
        <el-table-column prop="createTime" label="下单时间" width="180" align="center" />
        <el-table-column label="操作" min-width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === OrderStatus.PendingShipment"
              size="small"
              type="primary"
              :icon="Promotion"
              @click="handleShip(row)"
              v-permission="['admin', 'editor']"
            >
              发货
            </el-button>
            <el-button size="small" :icon="Edit" @click="handleRemark(row)">备注</el-button>
            <el-button
              v-if="row.status === OrderStatus.PendingPayment"
              size="small"
              type="danger"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="row.status === OrderStatus.Shipped"
              size="small"
              type="success"
              @click="handleComplete(row)"
            >
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Components -->
    <OrderProcess
      v-model:visible="processVisible"
      :order-id="currentOrderId"
      :type="processType"
      @success="handleProcessSuccess"
    />

    <OrderDetail v-model:visible="detailVisible" :order="currentOrder" />
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
