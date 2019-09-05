import axios from '@/libs/api.request'

export const pageProjectSystem = (query) => {
  return axios.request({
    url: '/daily/project/project-system/page/info',
    data: query,
    method: 'post'
  })
}

export const pageProjectSystemSelf = (query) => {
  return axios.request({
    url: '/daily/project/project-system/self/page/info',
    data: query,
    method: 'post'
  })
}

export const listProjectSystem = () => {
  return axios.request({
    url: '/daily/project/project-system/all',
    method: 'get'
  })
}

export const checkByBackend = (formData) => {
  return axios.request({
    url: '/daily/project/project-system/check',
    data: formData,
    method: 'post'
  })
}

export const getProjectSystem = (id) => {
  return axios.request({
    url: '/daily/project/project-system/info/' + id,
    method: 'get'
  })
}

export const createProjectSystem = (formData) => {
  return axios.request({
    url: '/daily/project/project-system/info',
    data: formData,
    method: 'post'
  })
}

export const updateProjectSystem = (formData) => {
  return axios.request({
    url: '/daily/project/project-system/info',
    data: formData,
    method: 'put'
  })
}

export const deleteProjectSystem = (id) => {
  return axios.request({
    url: '/daily/project/project-system/' + id,
    method: 'delete'
  })
}
