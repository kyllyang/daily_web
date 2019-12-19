import axios from '@/libs/api.request'

export const pageOrgEmployee = (query) => {
  return axios.request({
    url: '/daily/organization/employee/page/info',
    data: query,
    method: 'post'
  })
}

export const findOrgEmployee = (query) => {
  return axios.request({
    url: '/daily/organization/employee/list/info',
    data: query,
    method: 'post'
  })
}

export const getMaxCode = () => {
  return axios.request({
    url: '/daily/organization/employee/max-code',
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/organization/employee/check',
    data: formData,
    method: 'post'
  })
}

export const getOrgEmployee = (id) => {
  return axios.request({
    url: '/daily/organization/employee/info/' + id,
    method: 'get'
  })
}

export const createOrgEmployee = (formData) => {
  return axios.request({
    url: '/daily/organization/employee/info',
    data: formData,
    method: 'post'
  })
}

export const updateOrgEmployee = (formData) => {
  return axios.request({
    url: '/daily/organization/employee/info',
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
