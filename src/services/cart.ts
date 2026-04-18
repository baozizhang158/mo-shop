import { http } from '@/utils/http'
import type { CartItem } from '@/types/cart'
/**
 *
 * @param data_
 */
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}

// GET/member/cart
/**
 * 获取购物车列表
 */
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })
}

/**
 * 删除/清空购物车单品
 * @param data 请求体参数
 */
export const deleteMemberCartAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}

// 修改购物车单品
// PUT/member/cart/{skuId}
export const putMemberCartBySkuIdAPI = (
  skuId: string, // SKU ID
  data: { selected?: boolean; count?: number }, // 选中状态、数量
) => {
  return http({
    method: 'PUT', // 请求方法
    url: `/member/cart/${skuId}`, // 请求地址
    data, // 请求参数
  })
}

/**
 * 购物车全选/取消全选
 * @param data selected 是否选中
 */
export const putMemberCartSelectedAPI = (data: { selected: boolean }) => {
  return http({
    method: 'PUT',
    url: '/member/cart/selected',
    data,
  })
}
