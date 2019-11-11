import axios from '@/libs/api.request'

export const exportExcelWorkloadManhourSettle = (query) => {
  return axios.request({
    url: '/daily/worklog/workload/export/excel/manhour-settle',
    data: query,
    method: 'post',
    responseType: 'blob'
  })
}
