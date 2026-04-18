## tips

- 启动编译`pnpm run dev:mp-weixin -- --clean`
- 小程序 appID:wx5e0f5b01830de82b
- `pages.json`里注册页面路由
- `typeof xx.value` 获取 xx 的类型
- number 转字符串 `toString()`
- `.toFixed(2)` 保留两位小数
- `if(import.meta.env.DEV)`开发环境
- 打包项目`pnpm build:mp-weixin`

1. 小程序 vscode 三个插件：

- ui-create-view, 【uniapp 文件/组件创建】
- uni-helper, 【悬停代码提示，报错】
- uniapp 小程序扩展 【看官方文档】

2. `ts`类型校验

- 安装依赖 `pnpm i -D @types/wechat-miniprogram @uni-helper/uni-app-types`
- 配置:`"types": [
  "@dcloudio/types",
  "@types/wechat-miniprogram",
  "@uni-helper/uni-app-types"
]`

3. `Json`注释问题

- 项：`manifest.json`和`pags.json` 允许注释 值：`jsonc`

4. 全局请求封装工具 http.ts
   `res.statusCode >= 200 && res.statusCode < 300` → 这是 HTTP 状态码判断,判断网络请求是否成功

5. 小程序 API

- 别人写好、提供给你调用的功能函数 → 都叫 API
- 页面跳转：`uni.navigateTo({ url: '/pages/login/login' })`
- 弹窗提示: `uni.showToast({ ... })`

6. 适配不同机型 头部导航栏

- 隐藏默认导航栏：在 pages.json 里设置`navigationStyle: 'custom'`，
- // 获取屏幕边界到安全区域距离`const {safeAreaInsets} = uni.getSystemInfoSync ()`, `:style="{ paddingTop: safeAreaInsets?.top + 'px' }"`
- 动态样式的写法就是：`:style="{ 样式名: 值 }"`

7. 安全取值`?.` → `a?.b`= 有 a 吗？有就给 a.b，没有就 undefined

8. 在 components 目录中查找 组件自动引入！ 以 Mo 开头的组件，
   失败了！

- - = 全部、所有、随便什么
- .\* = 所有文件
  ` "^Mo(.\*)": "@/components/Mo$1.vue"`
- `!` 叫「非空断言」，就是你告诉 TS：我保证它一定有值，绝对不是 undefined

9. 类型声明文件：

- `UniHelper.SwiperOnChange`
- BannerItem 是类型（interface / type）
  不是普通 JS 变量
  !!TS 规定：导入类型必须写 `import type`
- `.d.ts` 是类型声明文件->可全局复用

- 先转成响应式再传递
- `const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI() // 获取首页轮播图数据
  bannerList.value = res.result // 更新轮播图列表
}`
  // 页面加载
  `onLoad(() => {
  getHomeBannerData()
})`
- `props` 父传子： `<MoSwiper :list="bannerList" />`
- `definePops` 就是子接收父

10. 为什么不加 scope

- 页面组件（index.vue） → 一般加 scoped，避免样式污染
- 公共组件（轮播、按钮、弹窗） → 不加 scoped，方便外部覆盖样式

11. 滚动容器
    `  <scroll-view class="scroll-view" scroll-y>` `scroll-view {
  flex: 1;
}`

12. 全局组件特殊点：

- 猜你喜欢模块在组件内部调用接口合适。应为多个页面都要调用，挂载就能用
- /组件挂载完毕后
  `onMounted(() => {
getHomeGuessLikeAPIData()
})`

13. 导入

- 大括号 `{}` = 按需导入（导入多个里的其中一个）
- 不带大括号 = 默认导入（导入唯一一个）

14. 分页准备 【贼麻烦啊】

- `@scrolltolwer`事件触发获取更多数据
- 获取实例
- 指定对应实例类型
- `defineExpose`暴露给父组件方法
- `Required<PageParams>`
  意思就是：把 PageParams 里所有可选的属性，变成 “必须写”
- 数组追加，页码累加
- 加判断（页码，和后端数据总页数）

15. 用户下拉刷新
    `refresher-enabled`

- 监听下拉`@refresherrefresh=""`
- 滚动容器里
- 关闭动作 `:refresher-triggered="istriggered"`
- `const istriggered = ref(false)`
  `const onrefresherrefresh = async () => {
  istriggered.value = true
  //一起发送
  Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotAPIData()])
  istriggered.value = false
}`

16. 生成骨架屏,转 vue 组件

- 加载完成前显示一个骨架，提升用户体验

17. 热门推荐部分
    封装接口，调用，类型定义

- `<navigator hover-class="none" url="/pages/hot/hot" class="cards">`
- ① <navigator>
  uni-app 里的跳转标签= 网页里的 <a> 标签作用：点击跳转到另一个页面
  ② url="/pages/hot/hot"
  ③ hover-class="none"
  点击时不要高亮、不要变色
  ④ class="cards"
  给这个区域加样式（圆角、背景、阴影之类）
- 带参数传参 :url="`/pages/hot/hot?type=${item.type}`"
- 父传子：Vue3 上个页面给下个页面传值 → 也是用 `defineProps`接收
  - 获取数据
- 交叉类型写法：`data?: PageParams & {
  subType?: string
  otherType?: number
  anotherType?: boolean
}`
- 分页加载
  获取组件实例（在组件内部） 监听滚动触底，获取当前选项，页码累加，调用 API，追加数据到列表里
  - !!!封装成组合式函数复用
- 添加分页条件，页码和页总数

18. ! 很多类型复用
19. Vite 提供的环境变量，用于判断当前是否处于开发模式:` import.meta.env.DEV：`
    开发模式（npm run dev）：值为 true
    生产模式（npm run build）：值为 false
20. 商品分类

- banner 接口调用渲染
- 一级分类和 Tab 交互(封装接口，调用，定义类型<复用>，渲染)
- 二级分类 :
- 提取当前二级分类数据计算属性 需要根据依赖自动更新且有缓存优化
  `const subCategoryList = computed(() => categoryList.value[activeIndex.value]?.children || [])`
- 骨架屏制作加载。提升用户体验 ！！微信开发者工具，快速生成骨架屏->处理成 vue 组件 -`:scroll-y` 期望接收的是布尔值，不加冒号传递的是字符串，类型不匹配导致报错
- <scroll-view scroll-y="true"> → JS 表达式？❌ → 字符串 "true"
  <scroll-view scroll-y="1 + 1"> → JS 表达式？❌ → 字符串 "1 + 1"
  <!-- 加 v-bind：JS 表达式 -->
  <scroll-view :scroll-y="true"> → JS 表达式？✅ → 布尔值 true
  <scroll-view :scroll-y="1 + 1"> → JS 表达式？✅ → 数字 2
  <scroll-view :scroll-y="message"> → JS 表达式？✅ → 变量 message 的值

21. 商品详情页

- <view class="toolbar" `:style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"`>屏幕边界到安全区距离防止遮挡
- 渲染 轮播图是一个数组，不要写 item.id 了，item 自己就是一个字符串（几个图片组）
- 轮播图右下页码 下标更新
- `: UniHelper.SwiperOnChange`!! TypeScript 类型注解，表示这是 uni-app 轮播图的 change 事件类型
- `ev.detail.current` 当前 event 事件轮播图索引
- `const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current
}`
- 大图预览`uni.previewImage` uni-app 的图片预览 API，会打开一个全屏看图界面
- `current: url	`当前点击的那张图片地址（预览时默认显示这张）
  `urls	`所有图片的地址数组（可以左右滑动切换）
- `const onTapImage = (url: string) => {
  uni.previewImage({
    current: url,                        // 当前点击的是哪张图
    urls: goods.value!.mainPictures,     // 所有图片的列表
  })
}`
- 商品详情-页面交互，弹出层，底部弹出层，点击遮罩关闭弹出层
- `uni.popup`
- 两个弹窗显示条件
- 定义了一个只能存储两个特定字符串的响应式变量
  `const popupName = ref<'address' | 'service'>()`
- 子调父，关闭弹出层：`defineEmits`
- `const emit = defineEmits<{ (event: 'close'): void }>()`void 表示"没有返回值"或"忽略返回值"。
  用户在子组件中点关闭按钮 `@tap="emit('close')"` 触发
  ↓
  子组件向父组件发送 'close' 信号
  ↓
  父组件收到 @close="popup?.close()"

22. 登录模块

- 小程序微信快捷登录
- `wx.login()` 是微信小程序官方提供的固定 API 方法名，用于获取用户的临时登录凭证（code）
- onLoad 是生命周期函数，不需要返回值
- 因使用的是小程序测试号（非企业认证），无法获取真实手机号

* 故采用模拟数据完成后续开发流程

- 工作场景：使用企业小程序 appid，且把微信号添加到开发者列表中
- Pinia 持久化存储配置文件 `src/store/index.ts`
- `persist`
  表示开启持久化功能。这是 Pinia 持久化插件提供的配置项。
- 跳转 `tabBar`页面 用`switchTab` tabBar 页面 底部导航栏里的页面
- 点击商品列表进详情页 `navigateTo`
- 支付成功后跳转订单页（订单页不在 tabBar） redirectTo 或 navigateTo
- 退出登录后跳转登录页 `reLaunch`

23. 用户模块 我的 会员中心

- 在 pages.json 加`"navigationStyle": "custom"`隐藏默认导航栏
- 猜你喜欢：
- 封装成组合式函数（命名一般 use 开头）：获取组件实例，监听触底事件，加载分页数据

- 设置页分包和预下载
- 点进我的 页面自动预下载
- 分包加载配置`"subPackages"`
- 分包预下载规则
  `"preloadRule": {
  "pages/my/my": {
    "network": "all",
    "packages": ["pagesMember"]
  }
}`
- 退出登录， 二次确认模块弹窗
- 条件渲染，未登录时候的设置界面

- 个人信息准备页面（分包）
- 修改头像： 调用选择图片 获取路径，上传文件，更新头像
  小程序换头像 图片上传 API:
  `uni.chooseImage({
//文件个数
count: 1,
//文件类型
mediaType: ['image'],
success: (res) => {
  console.log(res)
}),`
  网页端用`formData`
  uniapp 用`uni.uploadFile`

#### 在原本类型挑取类型进行复用：`Pick<原本类型名，'数据1'|'数据2'|'数据3'>&{}&{ }`

#### 修改信息，提供初始值 `const profile = ref<ProfileDetail>({} as ProfileDetail)断言`

- 更新 store 信息
- 个人信息修改 监听 单选事件获取性别`@change="ev => profile.value!.gender = ev.detail.value"`
- `: UniHelper.RadioGroupOnChange` 类型注解，表示这个函数符合 uni-app 的 `radio-group` 的 change 事件类型
- `join() `是数组方法，把数组里的所有元素拼成一个字符串。
- 性别：`radio` 单选按钮
- 昵称：input 双向绑定 `v-model`
- 生日，城市：picker 选择器
- 信息同步用 Pinia 状态管理

24. 设置 地址模块（新建分包页面）

- 获取页面参数
  `const query = defineProps<{ id?: string }>()`
- `v-model` `input`、`textarea` 等表单输入组件 双向绑定，既能显示又能修改
  `:value` `picker`等非输入组件 单向绑定，只显示，不自动更新
- 合并数据到 form：
  `Object.assign(form.value, {
provinceCode,
cityCode,
countyCode,
})`
- 地址模块列表渲染
- `onShow` 每次进入页面都会执行[涉及修改]，`onLoad` 只执行一次
- 数据回显 失败

#### 表单校验

<uni-forms :rules='rules'>

- 删除地址：侧滑组件。还要封装接口

25. SKU 模块 Stock Keeping Unit（库存量单位） 可复用组件

- `:mode="mode"` 是用来控制 SKU 弹窗底部按钮的显示模式的。
- 枚举 提高代码的可读性
  ` enum SkuMode {
Both = 1,
car = 2,
buy = 3,
}`
- 按钮模式
  `const mode = ref<SkuMode>(1)`
- 按钮颜色
  `add-cart-background-color="#FFA868"
buy-now-background-color="#27BA98"`
- 渲染选中值 ：获取组件内部的值-获取组件实例-计算值
- 需要用 computed 的场景
  原始数据需要转换/格式化
  需要过滤/排序数组
  需要从实例获取数据
  依赖多个响应式数据的计算

26. 加入购物车 实现后端添加

- 购物车修改商品数量： 步进器组件 类型声明 属性绑定 事件绑定 修改 API
- 商品选中状态 全选：//计算全选状态
  `const isAllSelected = () => {
  return cartList.value.every((item) => item.selected)
}`

27. 订单页（分包）

- 收货地址 Pinia store 存储使用
- // 定义并导出一个名为 useAddressStore 的地址存储模块
  // defineStore 是 Pinia 中定义状态管理模块的函数
- 看一眼怎么写：
  `export const useAddressStore = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()
  const changeSelectAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }
  return { selectedAddress, changeSelectAddress }
})`
- 阻止冒泡！！`@tap.stop="()=>{}"` 防止点修改的时候执行选择地址
- <!-- 父盒子有点击事件 -->
  <父盒子 @click="父盒子的逻辑">
    <!-- 子盒子不想触发父盒子 → 在子盒子上加 .stop -->
  <子盒子 @click.stop="子盒子的逻辑">
  点我
  </子盒子>
  </父盒子>
- 点击商品页立即购买跳转订单页
- 提交订单，存后端。收货地址必选

#### 关闭当前页面，跳转订单详情

`uni.redirectTo`

28. 订单详情

- 看还有没有上一页 获取页面栈
  `const pages = getCurrentPages()`
  //获取当前页面的实例，数组最后一项
  `const pageInstance = pages.at(-1)`
- 滚动动画需求，不太会
- 等待付款倒计时
  `<uni-countdown :second="order.countdown" @timeup="onTimeup" />`
- 去支付 功能【生产环境（PROD）/开发环境（DEV）】
- `if(import.meta.env.DEV)`开发环境
- 物流信息调用时机：判断订单状态是否为：`if([OrderState.1,OrderState.2,OrderState.3].includes(order.value.orderState))`

29. 订单列表页

#### tabs 滑动切换

- 这里是滑动触发，上面是点击改变 index
  `   <swiper class="swiper" @change="activeIndex = $event.detail.current" :current="activeIndex">`
  `:current`是当前滑块所在下标
- 页面跳转传参，对应高亮
- find () = 找 内容
  `findIndex ()` = 找 下标
- uniapp 路由传参，全部都是字符串
- //获取 my 页面参数
  `const query = defineProps<{ type: string }>()`
  //高亮下标
  `const activeIndex = ref(orderTabs.value.findIndex((v) => v.orderState === Number(query.type)))`
- 封装组件列表

## 项目打包

- 网页端打包，条件编译
- 条件编译语法：`#ifdef`加平台名称，`#endif`结尾

### Git

- 代码仓库
- 版本控制系统
