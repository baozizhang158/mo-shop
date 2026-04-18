<script setup lang="ts">
import MoSwiper from '@/components/MoSwiper.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import MoGuess from '@/components/MoGuess.vue'
// import type { MoGuessInstance } from '@/types/component'
import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/composables/index'

// 获取轮播图数据
// BannerItem[]规定这个数组里，只能放 “轮播图数据”
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI() // 获取首页轮播图数据
  bannerList.value = res.result // 更新轮播图列表
}

//获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI() // 获取首页分类数据
  categoryList.value = res.result
}

//获取热门分类数据
const hotList = ref<HotItem[]>([])
const getHomeHotAPIData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

/// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolwer } = useGuessList()
const isloading = ref(false)
// 页面加载
onLoad(async () => {
  isloading.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotAPIData()])
  isloading.value = false
})
const istriggered = ref(false)
const onrefresherrefresh = async () => {
  istriggered.value = true
  //重置猜你喜欢数据
  guessRef.value?.resetDate()
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotAPIData(),
    guessRef.value?.getMore(),
  ])
  istriggered.value = false
}
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 滚动容器 -->
  <scroll-view
    refresher-enabled
    @refresherrefresh="onrefresherrefresh"
    :refresher-triggered="istriggered"
    @scrolltolower="onScrolltolwer"
    class="scroll-view"
    scroll-y
  >
    <!-- 骨架屏 -->
    <PageSkeleton v-if="isloading" />
    <template>
      <!-- 自定义轮播图 -->
      <MoSwiper :list="bannerList" />
      <CategoryPanel :list="categoryList" />
      <HotPanel :list="hotList" />
      <!-- 猜你喜欢 -->
      <MoGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
scroll-view {
  flex: 1;
}
</style>
