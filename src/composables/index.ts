import type { MoGuessInstance } from '@/types/component'
import { ref } from 'vue'

// 猜你喜欢组合式函数
export const useGuessList = () => {
  //猜你喜欢组件实例
  const guessRef = ref<MoGuessInstance>()
  //滚动触底事件
  const onScrolltolwer = () => {
    guessRef.value?.getMore()
  }
  return { guessRef, onScrolltolwer }
}
