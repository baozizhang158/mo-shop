import { http } from '@/utils/http'
import type { LoginResult } from '@/types/member'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http<LoginResult>({
    url: '/login/wxMin',
    method: 'POST',
    data,
  })
}

//内测接口，模拟
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    url: '/login/wxMin/simple',
    method: 'POST',
    data: {
      phoneNumber,
    },
  })
}
