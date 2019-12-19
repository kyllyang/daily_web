import axios from '@/libs/api.request'

export const pageCustomerCompany = (query) => {
  return axios.request({
    url: '/daily/customer/company/page/info',
    data: query,
    method: 'post'
  })
}

export const listCustomerCompany = () => {
  return axios.request({
    url: '/daily/customer/company/all',
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/customer/company/check',
    data: formData,
    method: 'post'
  })
}

export const getCustomerCompany = (id) => {
  return axios.request({
    url: '/daily/customer/company/info/' + id,
    method: 'get'
  })
}

export const createCustomerCompany = (formData) => {
  return axios.request({
    url: '/daily/customer/company/info',
    data: formData,
    method: 'post'
  })
}

export const updateCustomerCompany = (formData) => {
  return axios.request({
    url: '/daily/customer/company/info',
    data: formData,
    method: 'put'
  })
}

export const deleteCustomerCompany = (id) => {
  return axios.request({
    url: '/daily/customer/company/' + id,
    method: 'delete'
  })
}
