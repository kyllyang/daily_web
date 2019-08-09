import axios from '@/libs/api.request'

export const listRole = () => {
  return axios.request({
    url: '/sys/role',
    method: 'get'
  })
}
