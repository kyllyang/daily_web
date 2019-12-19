import axios from '@/libs/api.request'

export const findOrgRole = () => {
  return axios.request({
    url: '/daily/organization/role/list/info',
    method: 'post'
  })
}
