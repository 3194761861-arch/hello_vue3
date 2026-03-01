<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { updateOrderStatus, addOrderRemark } from '@/api/order'
import { OrderStatus } from '@/types/order'

const props = defineProps<{
  visible: boolean
  orderId: number
  type: 'ship' | 'remark'
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  logisticsCompany: '',
  logisticsNo: '',
  remark: ''
})

const rules = reactive<FormRules>({
  logisticsCompany: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
  logisticsNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      formRef.value?.resetFields()
      form.logisticsCompany = ''
      form.logisticsNo = ''
      form.remark = ''
    }
  }
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (props.type === 'ship') {
          await updateOrderStatus(props.orderId, OrderStatus.Shipped, {
            company: form.logisticsCompany,
            no: form.logisticsNo
          })
          ElMessage.success('发货成功')
        } else if (props.type === 'remark') {
          await addOrderRemark(props.orderId, form.remark)
          ElMessage.success('添加备注成功')
        }
        emit('success')
        handleClose()
      } catch (error) {
        ElMessage.error('Operation failed')
      }
    }
  })
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="type === 'ship' ? '订单发货' : '添加备注'"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <template v-if="type === 'ship'">
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-input v-model="form.logisticsCompany" placeholder="如：顺丰速运" />
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="form.logisticsNo" placeholder="请输入运单号" />
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item label="备注内容" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入对该订单的备注..."
          />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
