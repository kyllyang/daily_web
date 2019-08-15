import axios from '@/libs/api.request'

export const getDataDictByCode = (code) => {
  return axios.request({
    url: '/datadict/code/' + code,
    method: 'get'
  })
}

export const getDataDictByCodeForChildren = (code) => {
  return axios.request({
    url: '/datadict/code/' + code + '/children',
    method: 'get'
  })
}
