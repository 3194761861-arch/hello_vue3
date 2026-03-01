<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Money,
  Goods,
  User,
  TrendCharts
} from '@element-plus/icons-vue'
import { getStatisticsData } from '@/api/dashboard'
import type { DashboardData } from '@/api/dashboard'
import LineChart from '@/components/Charts/LineChart.vue'
import PieChart from '@/components/Charts/PieChart.vue'
import BarChart from '@/components/Charts/BarChart.vue'
import { getOrderList } from '@/api/order'
import type { Order } from '@/types/order'

const loading = ref(false)
const dashboardData = ref<DashboardData | null>(null)
const recentOrders = ref<Order[]>([])

const fetchDashboardData = async () => {
  loading.value = true
  try {
    dashboardData.value = await getStatisticsData()
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  } finally {
    loading.value = false
  }
}

const fetchRecentOrders = async () => {
  try {
    const res = await getOrderList({ page: 1, pageSize: 5 })
    recentOrders.value = res.list
  } catch (error) {
    console.error('加载最近订单失败')
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    case 'pending_payment':
      return 'warning'
    case 'pending_shipment':
      return 'primary'
    case 'shipped':
      return 'info'
    default:
      return ''
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending_payment': '待付款',
    'pending_shipment': '待发货',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

onMounted(() => {
  fetchDashboardData()
  fetchRecentOrders()
})
</script>

<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- Top Cards -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
              <el-icon><Money /></el-icon>
            </div>
          </template>
          <div class="card-value">¥{{ dashboardData?.stats.todaySales.toLocaleString() }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
              <el-icon><Goods /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ dashboardData?.stats.todayOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日访问量</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ dashboardData?.stats.todayVisits.toLocaleString() }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
              <el-icon><TrendCharts /></el-icon>
            </div>
          </template>
          <div class="card-value">¥{{ dashboardData?.stats.totalSales.toLocaleString() }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Row 1 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="16">
        <el-card shadow="hover" header="销售趋势 (最近 7 天)">
          <LineChart
            v-if="dashboardData"
            :x-axis-data="dashboardData.trend.dates"
            :series-data="[
              { name: '销售额', data: dashboardData.trend.sales },
              { name: '订单量', data: dashboardData.trend.orders }
            ]"
            height="350px"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" header="商品分类占比">
          <PieChart
            v-if="dashboardData"
            :data="dashboardData.categories"
            height="350px"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Row 2 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="12">
        <el-card shadow="hover" header="热销商品 Top 10">
          <BarChart
            v-if="dashboardData"
            :x-axis-data="dashboardData.hotProducts.map(p => p.name)"
            :series-data="dashboardData.hotProducts.map(p => p.sales)"
            height="350px"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" header="最近订单">
          <el-table :data="recentOrders" style="width: 100%" height="350">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="receiverName" label="客户名" width="120" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">¥{{ row.amount }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag size="small" :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.mb-4 {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>
