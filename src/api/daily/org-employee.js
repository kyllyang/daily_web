import axios from '@/libs/api.request'

export const pageOrgEmployee = (query) => {
  return axios.request({
    url: '/daily/organization/org-employee/page',
    data: query,
    method: 'post'
  })
}