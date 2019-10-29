import axios from '@/libs/api.request'

export const pageStatisticsProjectSystemItemManhour = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/project-system-item-manhour/page/info',
    data: query,
    method: 'post'
  })
}

export const pageStatisticsProjectSystemItemManhourSelf = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/project-system-item-manhour/self/page/info',
    data: query,
    method: 'post'
  })
}

export const pageStatisticsEmployeeManhour = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/employee-manhour/page/info',
    data: query,
    method: 'post'
  })
}

export const pageStatisticsEmployeeManhourSelf = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/employee-manhour/self/page/info',
    data: query,
    method: 'post'
  })
}

export const pageStatisticsWorklogSummary = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/worklog-summary/page/info',
    data: query,
    method: 'post'
  })
}
