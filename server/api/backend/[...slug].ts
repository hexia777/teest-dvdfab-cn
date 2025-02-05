import querystring from 'node:querystring'
import CachedFunction from '@nuxt3/api-proxy-cache'
// import CachedFunction from '~/cache/apiCache'
import { getCacheVersion } from '~/cache/cache.js'
import { cacheConfig } from '~/cache/cache.config.js'

const pageCacheEnv: any = {
  dev: 'http://localhost:40010',
  test: 'http://page-cache:40010',
  prod: 'http://page_cache:40010',
}
export default defineEventHandler(async (event) => {
  const { req } = event.node
  const query = getQuery(event)
  const url = getRequestURL(event)
  const slug = getRouterParams(event)?.slug
  // const uri = req.url?.replace('/api/backend/', '')
  const env = useRuntimeConfig().public.ENV

  // console.log('=====================slug', slug, query._cacheKey || `${slug}.${query.locale || query.lang}`)

  // console.log('===================url', url)
  const params = {
    // apiURL: `${query._cacheBaseUrl}${uri}`,
    apiURL: '',
    base: cacheConfig.cache_domain,
    key: (query._cacheKey || `${slug}.${query.locale || query.lang}`) as string,
    bypassCache: env === 'dev' || query._original === '1',
    integrity: getCacheVersion(),
    baseURL: pageCacheEnv[env],
    setSyncCacheUrl: 'http:127.0.0.1:40011/receive_data',
    // isMultiRegion: true,
    // 分区同步的url isMultiRegion为true时候必穿
    // syncUrl: 'http:127.0.0.1:40011/receive_data',
  }
  const queryData: any = { ...query }

  delete queryData._original
  delete queryData._cache
  delete queryData._cacheKey
  delete queryData._cacheBaseUrl
  params.apiURL = `${query._cacheBaseUrl}${url.pathname?.replace(
    '/api/backend/',
    '',
  )}?${querystring.stringify(queryData)}`
  // console.log('===================apiURLapiURL', params.apiURL)
  const cache = new CachedFunction(params)

  return await cache.fetch().catch((error) => {
    console.log('=============API cache缓存失败', error)
    return { msg: '请求失败' }
  })
})
