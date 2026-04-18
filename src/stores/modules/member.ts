import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginResult } from '@/types/member'

// 定义 Store

export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<LoginResult>()

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化

  {
    persist: {
      // 告诉 Pinia 用哪个存储工具。因为 Pinia 默认用 Web 的 localStorage，但小程序不支持，所以要换成 uni-app 的存储 API。
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
