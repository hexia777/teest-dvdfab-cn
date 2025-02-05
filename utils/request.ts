import type { FetchResponse, SearchParameters } from 'ofetch'
import type { Ref } from 'vue'
import type { UseFetchOptions } from '#app'
import Qs from 'qs'
import { useStore } from '~/composables/useStore'
import type { Meta } from '~/apis/interface/meta'

export interface ResOptions<T> {
  data?: T
  result?: T
  meta?: Meta
  message?: string
  success?: boolean
  cscode?: number
  error?: {
    code: number
    message: string
  }
  time_now?: number
  msg: string
  code: number
  product_line: string
  promotion_url_type: string // 标记页面类型, unifab 文章页不展示活动入口
  apiType: string
}

type UrlType = string | Request | Ref<string | Request> | (() => string | Request)

export type HttpOption<T> = UseFetchOptions<ResOptions<T>>

const handleError = <T>(response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>) => {
  const err = (text: string) => {
    console.error(text)
  }
  if (!response._data) {
    err('Request timeout, no response from server!')
    return
  }
  const handleMap: { [key: number]: () => void } = {
    404: () => err('The requested resource does not exist'),
    500: () => err('Internal Server Error'),
    403: () => err('No permission to access this resource'),
    401: () => {
      err('Login status has expired and you need to log in again')
    },
  }
  handleMap[response.status] ? handleMap[response.status]() : err('Unknown error！')
}

// get方法传递数组形式参数
const paramsSerializer = (params?: SearchParameters) => {
  if (!params) return

  const query = deepCopy(params)
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

const getBaseURL = (isCache: boolean, apiType?: string) => {
  const {
    public: { API_BASE, API_PREFIX, API_PHP },
  } = useRuntimeConfig() as any
  if (isCache) {
    return API_PREFIX + 'backend'
  }
  if (apiType === 'PHP') {
    return API_PHP + '/'
  }
  return API_BASE + API_PREFIX
}

// 全局参数
const gParamsConfig = () => {
  return {
    locale: useStore.common().locale,
    lang: useStore.common().locale,
    laravel_session: useCookie('laravel_session').value || '',
  }
}

function objectToCacheKeyString(obj: any) {
  let result = 'php'
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          result = result + `.${item}`
        }
      })
    } else if (value) {
      result = result + `.${value}`
    }
  }
  return result
}
/**
 * @description 将 url 的 searchParams 转换成对象
 * @param searchParam url 的 searchParams
 * @returns {IExtraOPtions}
 */
const urlSearchParamsToObject = (searchParam: URLSearchParams) => {
  let obj: any = {}
  try {
    obj = Object.fromEntries(searchParam.entries())
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('urlSearchParamsToObject: ', error)
    // 遍历 searchParams 中的每一个键值对
    for (const [key, value] of searchParam) {
      obj[key] = value
    }
  }
  return obj
}

const getCacheKey = (
  url: UrlType,
  options: { [key: string]: string },
  extraOptions?: { [key: string]: string },
) => {
  if (!options._cache) {
    return ''
  }
  if (options._cacheKey) {
    return `${options._cacheKey}.${useStore.common().locale}`
  }
  const params = options.params || {}
  if (extraOptions?.apiType === 'PHP') {
    const paramsKey = objectToCacheKeyString(params)
    return `${url}.${useStore.common().locale}.${paramsKey}`
  }
  return `${url}.${useStore.common().locale}`
}

export interface IExtraOPtions {
  [key: string]: any
}

const fetch = <T>(
  url: UrlType,
  option: HttpOption<T> & IExtraOPtions,
  extraOptions?: { [key: string]: string },
) => {
  /**
   * 获取路由上的 query 参数, 不使用 useRoute 是因为在中间件调用时会有值不准确的警告
   * */
  const routeQuery: IExtraOPtions = urlSearchParamsToObject(useRequestURL().searchParams)
  const cacheKey = getCacheKey(url, option, extraOptions)
  return useFetch<ResOptions<T>>(url, {
    // 请求拦截器
    onRequest({ options }: { options: { [key: string]: any } }) {
      const gParams: any = gParamsConfig()
      // 缓存参数
      if (options._cache) {
        options.query = {
          ...options.query,
          _cache: options._cache,
          _cacheKey: cacheKey,
          _cacheBaseUrl: options._cacheBaseUrl || getBaseURL(false, extraOptions?.apiType),
          _original: routeQuery._original || '',
        }
      }
      // get方法传递数组形式参数
      if (options.method === 'GET') {
        const params = { ...gParams, ...options.query }
        options.query = paramsSerializer(params)
      } else if (options.method === 'POST') {
        // 表单格式参数
        if (option.formData) {
          options.body = Qs.stringify({ ...gParams, ...Qs.parse(options.body) })
          options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Accept: 'application/json',
          }
        } else if (options.body instanceof Object) {
          // 判断是否是对象
          options.body = { ...gParams, ...options.body }
        } else {
          // body
          options.body = Qs.stringify({ ...gParams, ...Qs.parse(options.body) })
        }
      }

      const baseUrl = getBaseURL(options._cache, extraOptions?.apiType)
      options.baseURL = baseUrl
      /* options.headers = new Headers(options.headers)
      if (useCookie('laravel_session').value) {
        options.headers.set('Authorization', `Bearer ${useCookie('laravel_session').value}`)
      } */
      if (useRuntimeConfig().public.ENV === 'dev') {
        options.headers = new Headers(options.headers)
        options.headers.set('accept-encoding', '*')
      }
    },
    // 响应拦截
    onResponse({ response }) {
      // console.log('=====================response', response, option, response._data)
      if (response.headers.get('content-disposition') && response.status === 200) {
        return response
      }

      // 在这里判断错误
      if (response._data.error) {
        handleError<T>(response)
        return Promise.reject(response._data)
      }

      // 成功返回
      return response._data
    },
    // 错误处理
    onResponseError({ response }) {
      handleError<T>(response)
      return Promise.reject(response?._data ?? null)
    },
    watch: false,
    // 合并参数
    ...option,
  })
}

export default class Http {
  get<T>(url: UrlType, params?: any, option?: HttpOption<T> & IExtraOPtions) {
    return fetch<T>(url, { method: 'get', params, ...option })
  }

  post<T>(url: UrlType, body?: any, option?: HttpOption<T> & IExtraOPtions) {
    return fetch<T>(url, { method: 'post', body, ...option })
  }

  phpGet<T>(url: UrlType, params?: any, option?: HttpOption<T> & IExtraOPtions) {
    return fetch<T>(url, { method: 'get', params, ...option }, { apiType: 'PHP' })
  }

  phpPost<T>(url: UrlType, body?: any, option?: HttpOption<T> & IExtraOPtions) {
    return fetch<T>(url, { method: 'post', body, ...option }, { apiType: 'PHP' })
  }
}
