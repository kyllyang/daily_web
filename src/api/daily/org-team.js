import axios from '@/libs/api.request'

export const listOrgTeam = () => {
  return axios.request({
    url: '/daily/organization/org-team/info/list',
    method: 'get'
  })
}
