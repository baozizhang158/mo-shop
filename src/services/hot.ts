import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'

export const getHotRecommendAPI = async (url: string, data?: PageParams & { subType?: string }) => {
  return await http<HotResult>({
    method: 'GET',
    url,
    data,
  })
}
