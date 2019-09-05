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

export const listOrgTeamSelf = (employeeCode) => {
  return axios.request({
    url: '/daily/organization/org-team/self/info/' + employeeCode,
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/organization/org-team/check',
    data: formData,
    method: 'post'
  })
}

export const getOrgTeam = (id) => {
  return axios.request({
    url: '/daily/organization/org-team/info/' + id,
    method: 'get'
  })
}

export const createOrgTeam = (formData) => {
  return axios.request({
    url: '/daily/organization/org-team/info',
    data: formData,
    method: 'post'
  })
}

export const updateOrgTeam = (formData) => {
  return axios.request({
    url: '/daily/organization/org-team/info',
    data: formData,
    method: 'put'
  })
}

export const deleteOrgTeam = (id) => {
  return axios.request({
    url: '/daily/organization/org-team/' + id,
    method: 'delete'
  })
}
