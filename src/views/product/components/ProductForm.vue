<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ProductStatus } from '@/types/product'
import type { ProductForm } from '@/types/product'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  initialData?: ProductForm
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: ProductForm): void
}>()

const formRef = ref<FormInstance>()
const formData = reactive<ProductForm>({
  name: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  status: ProductStatus.OnShelf,
  description: ''
})

const rules = reactive<FormRules<ProductForm>>({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于或等于 0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于或等于 0', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }]
})

const categories = [
  { label: '电子产品', value: 'Electronics' },
  { label: '电脑', value: 'Computers' },
  { label: '音频设备', value: 'Audio' },
  { label: '平板电脑', value: 'Tablets' },
  { label: '穿戴设备', value: 'Wearables' },
  { label: '其他', value: 'Others' }
]

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.isEdit && props.initialData) {
        Object.assign(formData, props.initialData)
      } else {
        formRef.value?.resetFields()
        Object.assign(formData, {
          name: '',
          price: 0,
          stock: 0,
          category: '',
          image: '',
          status: ProductStatus.OnShelf,
          description: ''
        })
      }
    }
  }
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('submit', { ...formData })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// Mock Upload
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // In a real app, response would contain the URL
  // Here we just use a placeholder or the local URL created by URL.createObjectURL
  formData.image = URL.createObjectURL(uploadFile.raw!)
  ElMessage.success('图片上传成功 (模拟)')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑商品' : '新增商品'"
    width="600px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" status-icon>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择商品分类" style="width: 100%">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品库存" prop="stock">
            <el-input-number v-model="formData.stock" :min="0" :step="1" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商品状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="ProductStatus.OnShelf">上架</el-radio>
          <el-radio :label="ProductStatus.OffShelf">下架</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商品图片" prop="image">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
          :on-change="(file) => handleAvatarSuccess(null, file)"
        >
          <img v-if="formData.image" :src="formData.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入商品描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
