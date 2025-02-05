export enum ApiType {
  PHP = 'PHP', // php 后台
  OM = 'OM', // om 后台
}

export type UrlType = string | Request | Ref<string | Request> | (() => string | Request)
export type UrlCacheOption = {
  cache: boolean
  cacheKey?: string
  cacheBaseUrl?: string
  apiType?: ApiType
}
/**
 * 请求方法类型
 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 请求头类型
 */
export type HeadersType = {
  'Content-Type'?: string
  Authorization?: string
  [key: string]: string | undefined
}

/**
 * 请求配置类型
 */
export type RequestConfig = {
  /** 请求方法 */
  method?: RequestMethod
  /** 请求URL */
  url: string
  /** 请求基础URL */
  baseURL?: string
  /** 请求头 */
  headers?: HeadersType
  /** 请求数据（用于POST等方法） */
  data?: Record<string, any>
  /** 超时时间 */
  timeout?: number
  /** 是否携带凭证 */
  withCredentials?: boolean
  /** 响应类型 */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'
  /** 请求参数 */
  params?: Record<string, any>
}
