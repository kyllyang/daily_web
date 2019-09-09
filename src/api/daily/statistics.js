import axios from '@/libs/api.request'

export const pageStatisticsSummary = (query) => {
  return axios.request({
    url: '/daily/worklog/worklog-daily-record/page/info/statistics/summary',
    data: query,
    method: 'post'
  })
}
