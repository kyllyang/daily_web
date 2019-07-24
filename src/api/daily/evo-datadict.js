import axios from '@/libs/api.request'

export const getDataDictByCode = (code) => {
  return axios.request({
    url: '/datadict/code/' + code,
    method: 'get'
  })
}
