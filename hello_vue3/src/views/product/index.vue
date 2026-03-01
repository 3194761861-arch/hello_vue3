<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatus
} from '@/api/product'
import { useProductStore } from '@/stores/product'
import type { Product, ProductForm } from '@/types/product'
import { ProductStatus } from '@/types/product'
import ProductFormDialog from './components/ProductForm.vue'

const productStore = useProductStore()
const loading = ref(false)
const list = ref<Product[]>([])
const total = ref(0)

const formVisible = ref(false)
const isEdit = ref(false)
const currentProduct = ref<ProductForm | undefined>(undefined)

const categories = [
  { label: '全部', value: '' },
  { label: '电子产品', value: 'Electronics' },
  { label: '电脑', value: 'Computers' },
  { label: '音频设备', value: 'Audio' },
  { label: '平板电脑', value: 'Tablets' },
  { label: '穿戴设备', value: 'Wearables' },
  { label: '其他', value: 'Others' }
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getProductList(productStore.query)
    list.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  productStore.query.page = 1
  fetchData()
}

const handleReset = () => {
  productStore.resetQuery()
  fetchData()
}

const handleSizeChange = (val: number) => {
  productStore.query.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  productStore.query.page = val
  fetchData()
}

const handleCreate = () => {
  isEdit.value = false
  currentProduct.value = undefined
  formVisible.value = true
}

const handleEdit = (row: Product) => {
  isEdit.value = true
  currentProduct.value = { ...row }
  formVisible.value = true
}

const handleDelete = (row: Product) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteProduct(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleStatusChange = async (row: Product) => {
  const newStatus =
    row.status === ProductStatus.OnShelf ? ProductStatus.OffShelf : ProductStatus.OnShelf
  const actionText = newStatus === ProductStatus.OnShelf ? '上架' : '下架'

  try {
    await updateStatus(row.id, newStatus)
    ElMessage.success(`${actionText}成功`)
    row.status = newStatus // Optimistic update or refresh
    // fetchData() // Or fetch data to be safe
  } catch (error) {
    ElMessage.error(`${actionText}失败`)
  }
}

const handleFormSubmit = async (data: ProductForm) => {
  try {
    if (isEdit.value) {
      await updateProduct(data)
      ElMessage.success('修改成功')
    } else {
      await createProduct(data)
      ElMessage.success('添加成功')
    }
    formVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '添加失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-container">
    <!-- Search Bar -->
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="productStore.query">
        <el-form-item label="商品名称">
          <el-input
            v-model="productStore.query.name"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="productStore.query.category"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格范围">
          <div class="price-range">
            <el-input-number
              v-model="productStore.query.minPrice"
              :min="0"
              placeholder="最小"
              controls-position="right"
              style="width: 100px"
            />
            <span class="separator">-</span>
            <el-input-number
              v-model="productStore.query.maxPrice"
              :min="0"
              placeholder="最大"
              controls-position="right"
              style="width: 100px"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Toolbar -->
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleCreate"
            v-permission="['admin', 'editor']"
            >新增商品</el-button
          >
        </div>
      </template>

      <!-- Table -->
      <el-table v-loading="loading" :data="list" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              style="width: 50px; height: 50px"
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" align="center" />
        <el-table-column prop="price" label="价格" width="120" align="center">
          <template #default="{ row }"> ¥{{ row.price }} </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.stock < 10 ? 'danger' : 'success'">{{ row.stock }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === ProductStatus.OnShelf ? 'success' : 'info'">
              {{ row.status === ProductStatus.OnShelf ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
              v-permission="['admin', 'editor']"
              >编辑</el-button
            >
            <el-button
              size="small"
              :type="row.status === ProductStatus.OnShelf ? 'warning' : 'success'"
              @click="handleStatusChange(row)"
              v-permission="['admin', 'editor']"
            >
              {{ row.status === ProductStatus.OnShelf ? '下架' : '上架' }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDelete(row)"
              v-permission="['admin']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="productStore.query.page"
          v-model:page-size="productStore.query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Product Form Dialog -->
    <ProductFormDialog
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :initial-data="currentProduct"
      @submit="handleFormSubmit"
    />
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
.price-range {
  display: flex;
  align-items: center;
}
.separator {
  margin: 0 10px;
}
</style>
