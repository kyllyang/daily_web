import axios from '@/libs/api.request'

export const getSystemHolidays = () => {
  return axios.request({
    url: '/daily/system/system-holidays/info',
    method: 'get'
  })
}

export const saveSystemHolidays = (formData) => {
  return axios.request({
    url: '/daily/system/system-holidays/info',
    data: formData,
    method: 'post'
  })
}
