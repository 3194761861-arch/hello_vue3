import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductQuery, Product } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const query = ref<ProductQuery>({
    page: 1,
    pageSize: 10,
    name: '',
    category: '',
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined
  })

  const currentProduct = ref<Product | null>(null)

  const setQuery = (newQuery: Partial<ProductQuery>) => {
    query.value = { ...query.value, ...newQuery }
  }

  const resetQuery = () => {
    query.value = {
      page: 1,
      pageSize: 10,
      name: '',
      category: '',
      status: undefined,
      minPrice: undefined,
      maxPrice: undefined
    }
  }

  const setCurrentProduct = (product: Product | null) => {
    currentProduct.value = product
  }

  return {
    query,
    currentProduct,
    setQuery,
    resetQuery,
    setCurrentProduct
  }
})
