import MoGuess from '@/components/MoGuess.vue'
/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    //
  }
}
export type MoGuessInstance = InstanceType<typeof MoGuess>
