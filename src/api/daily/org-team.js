import axios from '@/libs/api.request'

export const pageOrgTeam = (query) => {
  return axios.request({
    url: '/daily/organization/team/page/info',
    data: query,
    method: 'post'
  })
}

export const listOrgTeam = (query) => {
  return axios.request({
    url: '/daily/organization/team/list/info',
    data: query,
    method: 'post'
  })
}

export const treeOrgTeam = (query) => {
  return axios.request({
    url: '/daily/organization/team/tree/info',
    data: query,
    method: 'post'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/organization/team/check',
    data: formData,
    method: 'post'
  })
}

export const getOrgTeam = (id) => {
  return axios.request({
    url: '/daily/organization/team/info/' + id,
    method: 'get'
  })
}

export const createOrgTeam = (formData) => {
  return axios.request({
    url: '/daily/organization/team/info',
    data: formData,
    method: 'post'
  })
}

export const updateOrgTeam = (formData) => {
  return axios.request({
    url: '/daily/organization/team/info',
    data: formData,
    method: 'put'
  })
}

export const deleteOrgTeam = (id) => {
  return axios.request({
    url: '/daily/organization/team/' + id,
    method: 'delete'
  })
}
