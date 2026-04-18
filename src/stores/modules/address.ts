import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义并导出一个名为 useAddressStore 的地址存储模块
// defineStore 是 Pinia 中定义状态管理模块的函数
export const useAddressStore = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()
  const changeSelectAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }
  return { selectedAddress, changeSelectAddress }
})
