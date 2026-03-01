export enum ProductStatus {
  OnShelf = 1,
  OffShelf = 0
}

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
  image: string
  status: ProductStatus
  description?: string
  createTime?: string
  updateTime?: string
}

export interface ProductQuery {
  page: number
  pageSize: number
  name?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  status?: ProductStatus
}

export interface ProductForm {
  id?: number
  name: string
  price: number
  stock: number
  category: string
  image: string
  status: ProductStatus
  description?: string
}

export interface ProductListResponse {
  list: Product[]
  total: number
}
