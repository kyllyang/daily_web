import axios from '@/libs/api.request'

export const pageOrgTeam = (query) => {
  return axios.request({
    url: '/daily/organization/org-team/page/info',
    data: query,
    method: 'post'
  })
}

export const listOrgTeam = () => {
  return axios.request({
    url: '/daily/organization/org-team/all',
    method: 'get'
  })
}

export const deleteOrgTeam = (id) => {
  return axios.request({
    url: '/daily/organization/org-team/' + id,
    method: 'delete'
  })
}
