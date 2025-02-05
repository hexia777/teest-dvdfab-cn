import querystring from 'node:querystring'
import type { FetchContext, FetchResponse } from 'ofetch'
import { $fetch } from 'ofetch'

export interface Options {
  // 必须的字符串属性，表示API的url
  apiURL: string

  // 必须的字符串属性，表示缓存的存储挂载点的名称
  base: string

  // 必须的字符串属性，表示缓存的key
  key: string

  // 可选的字符串属性，表示缓存API的根地址，默认为http://page_cache:40010
  baseURL?: string

  // 可选的字符串属性，表示缓存的key前缀，默认为apiCache
  name?: string

  //  可选的字符串属性，表示缓存的过期时间，单位为毫秒，默认为7天
  maxAge?: number

  // 可选的字符串属性，表示该值在更改时使缓存无效
  integrity?: string

  // 可选的字符串属性，表示是否跳过缓存，默认为false
  bypassCache?: boolean
  // 是否是多区域的
  isMultiRegion?: boolean
  // 分区同步的url isMultiRegion为true时候必穿
  syncUrl?: string
}

interface CacheRequestOptions extends Options {
  method?: 'GET' | 'PUT'
}

/**
 * @function cacheRequest
 * @description Cache Post
 * @param uri
 * @param data {any}
 * @param options {object}
 * @returns Promise<any>
 */
const cacheRequest = async (uri: string, options: CacheRequestOptions, data?: any): Promise<any> => {
  const { name, key, base, maxAge, baseURL, integrity } = options

  const params = {
    key: `${name}_${key}.json`,
    ts: integrity,
    domain: base,
    type: 1,
    maxAge,
  }

  return await $fetch(`${baseURL}${uri}`, {
    method: options?.method || 'GET',
    body: data,
    onResponseError(context: FetchContext & { response: FetchResponse<any> }): Promise<void> | void {
      return Promise.reject(context?.response?._data ?? null)
    },
    query: params,
  })
}

const syncCacheRequest = async (syncUri: string, options: CacheRequestOptions, data?: any): Promise<any> => {
  const { name, key, base, maxAge, integrity } = options

  const params = {
    key: `${name}_${key}.json`,
    ts: integrity,
    domain: base,
    type: 1,
    maxAge,
  }
  const body = {
    url: '/set?' + querystring.stringify(params),
    data: JSON.stringify(data),
  }
  // console.log('===============syncUri', syncUri, body, params)
  return await $fetch(`${syncUri}`, {
    method: 'POST',
    body,
    onResponseError(context: FetchContext & { response: FetchResponse<any> }): Promise<void> | void {
      return Promise.reject(context?.response?._data ?? null)
    },
  })
}

/**
 * @function fetchDataFromCache
 * @description Fetch data from cache
 * @returns Promise<any>
 * @param options
 */
const fetchDataFromCache = async (options: Options): Promise<any | null> => {
  try {
    const cached = await cacheRequest('/get', options)
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached
    }
  } catch (error) {
    console.log('Miss fetching from cache', error)
  }

  return null
}

/**
 * @function fetchDataFromApi
 * @description Fetch data from api
 * @returns Promise<any>
 * @param options
 */

const fetchDataFromApi = async (options: Options): Promise<any> => {
  try {
    return await $fetch(options.apiURL)
  } catch (error) {
    console.error('Error fetching from API:', error)
    throw error
  }
}

/**
 * @function fetchAndCacheData
 * @description Cache api get or set
 * @returns Promise<any>
 * @param options
 */
export const fetchAndCacheData = async (options: Options): Promise<any> => {
  const { key, bypassCache, isMultiRegion, syncUrl } = options

  if (!key || bypassCache) {
    const data = await fetchDataFromApi(options)
    return data ? { ...data, _cache: { status: 'bypass' } } : data
  }

  const cachedData = await fetchDataFromCache(options)
  if (cachedData) {
    console.log(key, 'API hit cache')
    return { ...cachedData, _cache: { status: 'hit' } }
  }

  const newData = await fetchDataFromApi(options)
  if (!bypassCache) {
    try {
      if (isMultiRegion) {
        //
        syncCacheRequest(syncUrl as string, options, newData)
      } else {
        cacheRequest('/set', { method: 'PUT', ...options }, newData)
      }

      console.log(key, 'API set cache')
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  return newData ? { ...newData, _cache: { status: 'miss' } } : newData
}

const errorMap: Record<any, string> = {
  apiURL: 'fetchURL is required',
  key: 'key is required',
  base: 'base is required',
}

class CachedFunction {
  private readonly options: Options

  constructor(options: Options) {
    if (!options) {
      throw new Error('options is required')
    }

    if (typeof options !== 'object') {
      throw new TypeError('options must be an object')
    }

    const validKeys: Array<keyof Options> = ['apiURL', 'key', 'base']
    Object.keys(errorMap).forEach((key) => {
      if (validKeys.includes(key as keyof Options) && !options[key as keyof Options]) {
        throw new Error(errorMap[key])
      }
    })

    this.options = {
      baseURL: 'http://page_cache:40010',
      name: 'apiCache',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      bypassCache: false,
      ...options,
    }
  }

  async fetch() {
    return await fetchAndCacheData(this.options)
  }
}

export default CachedFunction
