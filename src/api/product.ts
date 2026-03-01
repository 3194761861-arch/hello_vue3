import request from './request'
import { ProductStatus } from '@/types/product'
import type { Product, ProductQuery, ProductForm, ProductListResponse } from '@/types/product'

// Mock Data
let productList: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 9999,
    stock: 100,
    category: 'Electronics',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692875661000',
    status: ProductStatus.OnShelf,
    createTime: '2023-09-22 10:00:00',
    description: 'The most powerful iPhone ever.'
  },
  {
    id: 2,
    name: 'MacBook Pro 16',
    price: 18999,
    stock: 50,
    category: 'Computers',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202',
    status: ProductStatus.OnShelf,
    createTime: '2023-01-15 14:30:00',
    description: 'M3 Max chip, 36GB RAM, 1TB SSD.'
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    price: 1899,
    stock: 200,
    category: 'Audio',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1660803972361',
    status: ProductStatus.OnShelf,
    createTime: '2023-05-10 09:15:00',
    description: 'Active Noise Cancellation.'
  },
  {
    id: 4,
    name: 'iPad Air 5',
    price: 4799,
    stock: 80,
    category: 'Tablets',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688',
    status: ProductStatus.OffShelf,
    createTime: '2022-03-18 11:20:00',
    description: 'Supercharged by M1.'
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    price: 2999,
    stock: 120,
    category: 'Wearables',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-midnight-nc-45-s9-ab-midnight-sport-loop-midnight-202309?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692823661000',
    status: ProductStatus.OnShelf,
    createTime: '2023-09-22 10:00:00',
    description: 'Smarter. Brighter. Mightier.'
  }
]

enum API {
  LIST = '/product/list',
  CREATE = '/product/create',
  UPDATE = '/product/update',
  DELETE = '/product/delete',
  STATUS = '/product/status'
}

// Get Product List
export const getProductList = (query: ProductQuery) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<ProductListResponse>((resolve) => {
      setTimeout(() => {
        let list = [...productList]

        // Filter by name
        if (query.name) {
          list = list.filter(item => item.name.toLowerCase().includes(query.name!.toLowerCase()))
        }

        // Filter by category
        if (query.category) {
          list = list.filter(item => item.category === query.category)
        }

        // Filter by status
        if (query.status !== undefined) {
          list = list.filter(item => item.status === query.status)
        }
        
        // Filter by price range
        if (query.minPrice !== undefined) {
           list = list.filter(item => item.price >= query.minPrice!)
        }
        if (query.maxPrice !== undefined) {
           list = list.filter(item => item.price <= query.maxPrice!)
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
  return request.get<any, ProductListResponse>(API.LIST, { params: query })
}

// Create Product
export const createProduct = (data: ProductForm) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          id: productList.length + 1,
          ...data,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        }
        productList.unshift(newProduct)
        resolve()
      }, 500)
    })
  }
  return request.post(API.CREATE, data)
}

// Update Product
export const updateProduct = (data: ProductForm) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const index = productList.findIndex(item => item.id === data.id)
        if (index !== -1) {
          productList[index] = {
            ...productList[index],
            ...data,
            updateTime: new Date().toLocaleString()
          }
          resolve()
        } else {
          reject(new Error('Product not found'))
        }
      }, 500)
    })
  }
  return request.post(API.UPDATE, data)
}

// Delete Product
export const deleteProduct = (id: number) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const index = productList.findIndex(item => item.id === id)
        if (index !== -1) {
          productList.splice(index, 1)
          resolve()
        } else {
          reject(new Error('Product not found'))
        }
      }, 500)
    })
  }
  return request.post(API.DELETE, { id })
}

// Update Status
export const updateStatus = (id: number, status: ProductStatus) => {
  if (import.meta.env.MODE === 'development') {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const product = productList.find(item => item.id === id)
        if (product) {
          product.status = status
          product.updateTime = new Date().toLocaleString()
          resolve()
        } else {
          reject(new Error('Product not found'))
        }
      }, 500)
    })
  }
  return request.post(API.STATUS, { id, status })
}
