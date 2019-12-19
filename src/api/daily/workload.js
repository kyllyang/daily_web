import axios from '@/libs/api.request'

export const exportExcelWorkloadManhourSettle = (query) => {
  return axios.request({
    url: '/daily/workload/export/excel/manhour-settle',
    data: query,
    method: 'post',
    responseType: 'blob'
  })
}

export const exportExcelWorkloadTeamQuarter = (query) => {
  return axios.request({
    url: '/daily/workload/export/excel/team-quarter',
    data: query,
    method: 'post',
    responseType: 'blob'
  })
}
