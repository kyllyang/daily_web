import axios from '@/libs/api.request'

export const pageCustomerEmployee = (query) => {
  return axios.request({
    url: '/daily/customer/employee/page/info',
    data: query,
    method: 'post'
  })
}

export const listCustomerEmployee = () => {
  return axios.request({
    url: '/daily/customer/employee/all',
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/customer/employee/check',
    data: formData,
    method: 'post'
  })
}

export const getCustomerEmployee = (id) => {
  return axios.request({
    url: '/daily/customer/employee/info/' + id,
    method: 'get'
  })
}

export const createCustomerEmployee = (formData) => {
  return axios.request({
    url: '/daily/customer/employee/info',
    data: formData,
    method: 'post'
  })
}

export const updateCustomerEmployee = (formData) => {
  return axios.request({
    url: '/daily/customer/employee/info',
    data: formData,
    method: 'put'
  })
}

export const deleteCustomerEmployee = (id) => {
  return axios.request({
    url: '/daily/customer/employee/' + id,
    method: 'delete'
  })
}
