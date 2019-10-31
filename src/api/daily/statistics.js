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

export const listStatisticsEmployeeManhourYear = (query) => {
  return axios.request({
    url: '/daily/worklog/statistics/employee-manhour/year',
    data: query,
    method: 'get'
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

export const countStatisticsAmountEmployeeOnjobCount = () => {
  return axios.request({
    url: '/daily/organization/statistics/amount/employee/onjob/count',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourShouldFillSum = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/shouldfill/sum',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourAlreadyFillSum = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/alreadyfill/sum',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourAlreadyApproveSum = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/alreadyapprove/sum',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourShouldFillSumSelf = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/self/shouldfill/sum',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourAlreadyFillSumSelf = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/self/alreadyfill/sum',
    method: 'get'
  })
}

export const countStatisticsAmountCurrentMonthManHourAlreadyApproveSumSelf = () => {
  return axios.request({
    url: '/daily/worklog/statistics/amount/currentmonth/manhour/self/alreadyapprove/sum',
    method: 'get'
  })
}
