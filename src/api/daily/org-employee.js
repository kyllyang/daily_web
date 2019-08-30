import axios from '@/libs/api.request'

export const pageOrgEmployee = (query) => {
  return axios.request({
    url: '/daily/organization/org-employee/page/info',
    data: query,
    method: 'post'
  })
}

export const listOrgEmployee = (query) => {
  return axios.request({
    url: '/daily/organization/org-employee/all',
    method: 'get'
  })
}

export const listOrgEmployeeSelfMember = (code) => {
  return axios.request({
    url: '/daily/organization/org-employee/self-member/info/' + code,
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/organization/org-employee/check',
    data: formData,
    method: 'post'
  })
}

export const getOrgEmployee = (id) => {
  return axios.request({
    url: '/daily/organization/org-employee/info/' + id,
    method: 'get'
  })
}

export const createOrgEmployee = (formData) => {
  return axios.request({
    url: '/daily/organization/org-employee/info',
    data: formData,
    method: 'post'
  })
}

export const updateOrgEmployee = (formData) => {
  return axios.request({
    url: '/daily/organization/org-employee/info',
    data: formData,
    method: 'put'
  })
}

export const updateOrgEmployeePassowrd = (id, password) => {
  return axios.request({
    url: '/sys/user/password',
    data: {
      id,
      password
    },
    method: 'put'
  })
}

export const deleteOrgEmployee = (id) => {
  return axios.request({
    url: '/daily/organization/org-employee/' + id,
    method: 'delete'
  })
}
