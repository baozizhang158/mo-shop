// 引入轮播图每一项的数据类型（图片、标题、链接等）
import type { PageResult, PageParams } from '@/types/global'
import type { BannerItem, CategoryItem, GuessItem, HotItem } from '@/types/home'
import { http } from '@/utils/http'

/**
 * 首页-广告区域-小程序
 * @param distributionSite 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}

/**
 * 首页-分类区域
 * @param distributionSite 分类区域展示位置（投放位置，1为首页，2为分类商品页）默认是1
 * @returns 分类数据列表
 */
/**
 * 首页-获取分类数据
 * @param distributionSite 投放位置（1为首页，2为分类商品页）默认是1
 */

export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}

/**
 * 首页-猜你喜欢
 * @returns 猜你喜欢商品分页数据
 */
export const getHomeGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
  })
}
