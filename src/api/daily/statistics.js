import axios from '@/libs/api.request'

export const getMineFilled = (workDate) => {
  return axios.request({
    url: '/daily/statistics/worklog/mine/' + workDate + '/filled',
    method: 'get'
  })
}

export const getMineResidue = (workDate) => {
  return axios.request({
    url: '/daily/statistics/worklog/mine/' + workDate + '/residue',
    method: 'get'
  })
}

export const getEmployeeOnJobCount = () => {
  return axios.request({
    url: '/daily/statistics/organization/employee/onjob',
    method: 'get'
  })
}

export const getCurrentMonthManHourShouldFill = () => {
  return axios.request({
    url: '/daily/statistics/worklog/currentmonth/manhour/shouldfill',
    method: 'get'
  })
}

export const getCurrentMonthManHourAlreadyFill = () => {
  return axios.request({
    url: '/daily/statistics/worklog/currentmonth/manhour/alreadyfill',
    method: 'get'
  })
}

export const getCurrentMonthManHourAlreadyApprove = () => {
  return axios.request({
    url: '/daily/statistics/worklog/currentmonth/manhour/alreadyapprove',
    method: 'get'
  })
}

export const pageProjectSystemItemManhour = (query) => {
  return axios.request({
    url: '/daily/statistics/worklog/project-system-item/manhour/page/info',
    data: query,
    method: 'post'
  })
}

export const pageEmployeeManhour = (query) => {
  return axios.request({
    url: '/daily/statistics/worklog/org-employee/manhour/page/info',
    data: query,
    method: 'post'
  })
}

export const pageWorklogSummary = (query) => {
  return axios.request({
    url: '/daily/statistics/worklog/summary/page/info',
    data: query,
    method: 'post'
  })
}
