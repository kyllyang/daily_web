import axios from '@/libs/api.request'

export const getDataDictByCode = (code) => {
  return axios.request({
    url: '/sys/code/' + code,
    method: 'get'
  })
}

export const getDataDictByCodeForChildren = (code) => {
  return axios.request({
    url: '/sys/code/' + code + '/children',
    method: 'get'
  })
}

export const listRole = () => {
  return axios.request({
    url: '/sys/role',
    method: 'get'
  })
}
