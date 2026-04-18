// ✅ 1. import 必须放在最顶部！
import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // ✅ 2. 加 try-catch 捕获错误，防止页面崩溃
    try {
      // 1. 非 http 开头需拼接地址
      if (!options.url.startsWith('http')) {
        options.url = baseURL + options.url
      }
      // 2. 请求超时，默认 60s
      options.timeout = 10000
      // 3. 添加小程序端请求头标识
      options.header = {
        ...options.header,
        'source-client': 'miniapp',
      }
      // 4. 添加 token 请求头标识
      const memberStore = useMemberStore()
      const token = memberStore.profile?.token
      if (token) {
        options.header.Authorization = token
      }
      console.log(options)
    } catch (err) {
      //  ✅ 3. 捕获所有异常，页面不会崩溃
      console.error('请求拦截器异常', err)
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 请求成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 请求失败
 *    3.1 网络错误 -> 提示用户换网络
 *    3.2 401错误  -> 清理用户信息，跳转到登录页
 *    3.3 其他错误 -> 根据后端错误信息轻提示
 */

// 统一的后端返回数据格式模板
// code：成没成
// msg：提示啥
// result：要展示的真实数据
interface Data<T> {
  code: string
  msg: string
  result: T
}

// <T>是 “泛型”，就是给这个函数加了个 **“类型占位符”**
// 作用：让这个函数能适配不同接口的返回数据类型，比如获取商品列表时T是Goods[]，获取用户信息时T是UserInfo，不用写多个函数
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // res.statusCode >= 200 && res.statusCode < 300 → 这是 HTTP 状态码判断,判断网络请求是否成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 获取数据成功，调用resolve
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401错误，调用reject
          // 401错误  -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res.data)
        } else {
          // 通用错误，调用reject
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res.data)
        }
      },
      // 响应失败
      fail(err) {
        // 网络错误，调用reject
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
