import axios from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from './loading'

const defaultHeaders = new Headers({
  'Content-Type': 'application/json',
})
const CSRF_COOKIE_KEY = 'ctoken'
const CSRF_HEADER_KEY = 'x-csrf-token'

const filterRequestOpt = (req) => {
  const actualRequest = { ...req }
  Reflect.deleteProperty(actualRequest, 'loading')
  Reflect.deleteProperty(actualRequest, 'isHandleError')
  return actualRequest
}
const defaultOpt = {
  baseURL: '/',
  url: '',
  method: 'GET',
  loading: false,
  isHandleError: false,
}

function mergeHeaders(options) {
  options.headers = { ...defaultHeaders, ...(options.headers || {}) }
}

function isSafeMethod(method) {
  return !['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())
}

// 请求的resolve处理
function resolveHandler (response, opt) {
  hideLoading(opt)
  if (!response) return
  const { data } = response
  if (data.code) {
    data.success = data.code === '0'
    data.errorMsg = data.message
  }
  if (!data) {
    if (opt.isHandleError) {
      return Promise.reject(response || {})
    }
    message.error(`网络错误，请稍后再试！[${response.status}]`)
    return Promise.resolve(null)
  }
  // 这里逻辑可以根据自己业务接口字段进行修改适配
  if (data.success) {
    return Promise.resolve(data.data)
  }
  if (opt.isHandleError) {
    return Promise.reject(response.data || {})
  }
  if (response.data && response.data.errorMsg) {
    if (opt.isHandleError) {
      return Promise.reject(response.data)
    }
    message.error(response.data.errorMsg)
    return Promise.reject(null)
  }
  return Promise.reject(opt.isHandleError ? response.data : {})
}

// 请求的reject处理
function rejectHandler (error, opt) {
  hideLoading(opt)
  // 请求丢失时触发
  const emptyError = {
    data: null,
  }
  const response = error.response || emptyError
  if (error.message === 'Network Error') {
    error.message = '网络错误，请稍后再试！'
    if (!response.data) response.data = {}
    response.data.Message = '网络错误，请稍后再试！'
  }
  if (opt.isHandleError) {
    return Promise.reject(response.data || {})
  }
  if (response.data && response.data.errorMsg) {
    setTimeout(() => {
      hideLoading(opt)
      message.error(response.data.errorMsg)
    }, 0)
    return Promise.resolve(null)
  }
  if (error.message) {
    setTimeout(() => {
      hideLoading(opt)
      message.error(error.message)
    }, 0)
    return Promise.resolve(null)
  }
  // isHandleError表示是否自定义错误处理
  return Promise.reject(opt.isHandleError ? response.data || {} : {})
}

/**
 *
 * @param {*} options
 * @param isHandleError 页面中是否自定义处理异常
 * @param loading 接口是否展示loading
 */
export default function (
  options = { url: '', method: 'GET', loading: false, isHandleError: false },
) {
  // merge 默认参数到 options
  mergeHeaders(options)
  // mock 环境使用 fetch； 日常、预发、线上使用 asgard api
  if (!isSafeMethod(options.method)) {
    options = {
      ...defaultOpt,
      ...options,
      xsrfCookieName: CSRF_COOKIE_KEY,
      xsrfHeaderName: CSRF_HEADER_KEY,
    }
  }
  if (options.loading) {
    showLoading(options)
  }
  const actualRequest = filterRequestOpt(options)
  const out = axios(actualRequest)
    .then(
      (res) => resolveHandler(res, options),
      (error) => rejectHandler(error, options),
    )
    .catch((err) => {
      // 这里自行定制逻辑，可删除
      console.error(err)
      return Promise.reject(err)
    })

  return out
}
