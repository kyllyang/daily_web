import axios from '@/libs/api.request'

export const pageProjectSystemItem = (query) => {
  return axios.request({
    url: '/daily/project/system-item/page/info',
    data: query,
    method: 'post'
  })
}

export const listProjectSystemItem = (query) => {
  return axios.request({
    url: '/daily/project/system-item/list/info',
    data: query,
    method: 'post'
  })
}

export const getCode = (systemCode) => {
  return axios.request({
    url: '/daily/project/system-item/new-code/' + systemCode,
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/project/system-item/check',
    data: formData,
    method: 'post'
  })
}

export const getProjectSystemItem = (id) => {
  return axios.request({
    url: '/daily/project/system-item/info/' + id,
    method: 'get'
  })
}

export const createProjectSystemItem = (formData) => {
  return axios.request({
    url: '/daily/project/system-item/info',
    data: formData,
    method: 'post'
  })
}

export const updateProjectSystemItem = (formData) => {
  return axios.request({
    url: '/daily/project/system-item/info',
    data: formData,
    method: 'put'
  })
}

export const deleteProjectSystemItem = (id) => {
  return axios.request({
    url: '/daily/project/system-item/' + id,
    method: 'delete'
  })
}
