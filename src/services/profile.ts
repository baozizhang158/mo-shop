import { http } from '@/utils/http'
import type { ProfileDetail, ProfileParams } from '@/types/member'
//获取个人信息 从服务器
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}

//修改个人信息 提交给后端
export const putMemberProfileAPI = (data: ProfileParams) => {
  return http<ProfileDetail>({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
}
