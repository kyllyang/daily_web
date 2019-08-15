import axios from '@/libs/api.request'

export const pageWorklogDailyRecord = (query) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/page/info',
    data: query,
    method: 'post'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/check',
    data: formData,
    method: 'post'
  })
}

export const getWorklogDailyRecord = (id) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/info/' + id,
    method: 'get'
  })
}

export const createWorklogDailyRecord = (formData) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/info',
    data: formData,
    method: 'post'
  })
}

export const updateWorklogDailyRecord = (formData) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/info',
    data: formData,
    method: 'put'
  })
}

export const deleteWorklogDailyRecord = (id) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/' + id,
    method: 'delete'
  })
}
