// src/pages/login/login.vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { postLoginWxMinAPI, postLoginWxMinSimpleAPI } from '@/services/login'
import { useMemberStore } from '@/stores/modules/member'
import type { LoginResult } from '@/types/member'
// 获取微信登录凭证 code
let code = ''

// 页面加载时获取 code
onLoad(async () => {
  const res = await wx.login()
  code = res.code
})

/**
 * 获取用户手机号并登录
 * 注意：因使用的是小程序测试号（非企业认证），无法获取真实手机号
 * 故采用模拟数据完成后续开发流程
 */
const onGetphonenumber = async (ev: any) => {
  // ============================================================
  // 第一步：模拟 encryptedData 和 iv（测试号无法获取真实数据）
  // ============================================================
  // 测试号环境下 ev.detail 为空，手动模拟数据避免后续代码报错
  if (!ev.detail) {
    ev.detail = {
      encryptedData: 'mock_encrypted_data_' + Date.now(),
      iv: 'mock_iv_' + Date.now(),
    }
  }

  const encryptedData = ev.detail.encryptedData
  const iv = ev.detail.iv

  // ============================================================
  // 第二步：模拟登录成功返回的数据（与教程接口数据结构一致）
  // ============================================================
  // 模拟后端接口返回的数据结构，确保后续代码能正常运行
  const res = {
    code: '1', // 状态码
    msg: '操作成功', // 提示信息
    result: {
      id: 1421858309182833, // 用户ID
      account: 'sujiehao', // 账号
      mobile: '13535337057', // 手机号
      nickname: '测试用户', // 昵称
      avatar:
        'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', // 头像
      token: 'mock_token_' + Date.now(), // 登录凭证
    },
  }

  // ============================================================
  // 第三步：保存登录状态到本地存储
  // ============================================================
  uni.setStorageSync('token', res.result.token)
  uni.setStorageSync('userInfo', {
    id: res.result.id,
    account: res.result.account,
    mobile: res.result.mobile,
    nickname: res.result.nickname,
    avatar: res.result.avatar,
  })

  // ============================================================
  // 第四步：跳转到首页
  // ============================================================
  uni.switchTab({
    url: '/pages/index/index',
  })
  // ============================================================
  // 真实接口（因测试号无法使用，已注释）
  // 如有企业认证小程序，取消下方注释并删除上方模拟数据即可
  // ============================================================
  // const realRes = await postLoginWxMinAPI({ code, encryptedData, iv })
  // uni.setStorageSync('token', realRes.result.token)
  // uni.setStorageSync('userInfo', {
  //   id: realRes.result.id,
  //   account: realRes.result.account,
  //   mobile: realRes.result.mobile,
  //   nickname: realRes.result.nickname,
  //   avatar: realRes.result.avatar,
  // })
  // uni.switchTab({ url: '/pages/index/index' })
  loginSuccess(res.result)
}

//模拟接口 手机号快捷登录(开发练习)
const onGetphonenumberSimple = async () => {
  const res = await postLoginWxMinSimpleAPI('15173145276')
  loginSuccess(res.result)
}
const loginSuccess = (profile: LoginResult) => {
  //保存会员信息。封装复用
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  uni.showToast({
    title: '登陆成功',
    icon: 'success',
  })
  //switchTab会销毁前面的成功提示所以慢一下
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="C:\Users\Administrator\Desktop\我的商城小程序、项目\heima-shop\src\uploads\Moicon.jpg"
      ></image>
    </view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <!-- <input class="input" type="text" placeholder="请输入用户名/手机号码" /> -->
      <!-- <input class="input" type="text" password placeholder="请输入密码" /> -->
      <!-- <button class="button phone">登录</button> -->

      <!-- 小程序端授权登录 -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @tap="onGetphonenumberSimple">
            <text class="icon icon-phone">模拟快捷登录</text>
          </button>
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  image {
    width: 220rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;
    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;
      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;
      button {
        padding: 0;
        background-color: transparent;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }
    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
