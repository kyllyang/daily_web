import axios from '@/libs/api.request'

export const pageWorklogDailyRecord = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/page/info',
    data: query,
    method: 'post'
  })
}

export const pageWorklogDailyRecordSelf = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/self/page/info',
    data: query,
    method: 'post'
  })
}

export const pageWorklogDailyRecordSelfMember = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/self-member/page/info',
    data: query,
    method: 'post'
  })
}

export const pageAuditWorklogDailyRecord = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/audit/page/info',
    data: query,
    method: 'post'
  })
}

export const pageAuditWorklogDailyRecordMember = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/member/audit/page/info',
    data: query,
    method: 'post'
  })
}

export const pageWorklogDailyRecordSelfStatistics = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/self/page/info/statistics',
    data: query,
    method: 'post'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/worklog/daily-record/check',
    data: formData,
    method: 'post'
  })
}

export const getWorklogDailyRecord = (id) => {
  return axios.request({
    url: '/daily/worklog/daily-record/info/' + id,
    method: 'get'
  })
}

export const createWorklogDailyRecord = (formData) => {
  return axios.request({
    url: '/daily/worklog/daily-record/info',
    data: formData,
    method: 'post'
  })
}

export const updateWorklogDailyRecord = (formData) => {
  return axios.request({
    url: '/daily/worklog/daily-record/info',
    data: formData,
    method: 'put'
  })
}

export const auditWorklogDailyRecord = (ids, status, comment) => {
  return axios.request({
    url: '/daily/worklog/daily-record/audit',
    data: {
      ids,
      status,
      comment
    },
    method: 'put'
  })
}

export const deleteWorklogDailyRecord = (id) => {
  return axios.request({
    url: '/daily/worklog/daily-record/' + id,
    method: 'delete'
  })
}

export const exportExcelWorklogDailyRecord = (query) => {
  return axios.request({
    url: '/daily/worklog/daily-record/export/excel/info',
    data: query,
    method: 'post',
    responseType: 'blob'
  })
}
