/**
 * 页面缓存中间件
 */
import nuxtOs from 'os'
import type { IncomingMessage } from 'node:http'
import type { H3Event, EventHandlerRequest } from 'h3'
// import { noHheaderPages } from '../../config/promotion/layoutRoute'
import { getOperatingSystemInfo, isMobile, getBrowser } from '../../utils/ua'
import { cachePost, cachePostSync, getCacheConfig, getCacheVersion } from '~/cache/cache.js'

type PageCacheQueryParams = { [key: string]: string[] }
const cacheConfig = getCacheConfig()

// TODO: 是不是抽出去
const getLocale = (host?: string) => {
  let locale = 'en'
  if (!host) {
    return locale as 'en' | 'ja' | 'de' | 'zh' | 'fr'
  }

  if (host.includes('de') || host.includes(useAppConfig().web_domain.de)) {
    locale = 'de'
  } else if (host.includes('fr')) {
    locale = 'fr'
  } else if (host.includes('ja') || host.includes(useAppConfig().web_domain.ja)) {
    locale = 'ja'
  } else if (host.includes('zh')) {
    locale = 'zh'
  }
  return locale as 'en' | 'ja' | 'de' | 'zh' | 'fr'
}

// 配置不缓存的页面
const nonCacheUris = [
  '/checkout.htm',
  '/card-info-pay.htm',
  '/card-info-onerway.htm',
  '/payment.htm',
  '/subscription-cancel.htm',
  '/member.htm',
  '/invoice.htm',
  '/google-auth-for-client.htm',
  '/faq/search-result.htm',
  '/__nuxt_error',
  '/--nuxt-error',
  '/-nuxt-error',
  '/_nuxt_error',
]

// 正则匹配不缓存的页面
const nonUrisRe = /^\/(clientad-.*\.htm)|(api\/.*)/i

const _post = cachePost
const _post_sync = cachePostSync

/**
 * @function htmlAddReferer
 * @param req
 * @param html
 * @returns {string}
 */
const htmlAddReferer = (req: { [k: string]: any }, html: string) => {
  if (req && req.headers) {
    const referer = req.headers.referer || ''
    const el = `<div id="__ref__" data-ref="${referer}" style="display: none"></div>`
    if (html && typeof html === 'string') {
      html = html.replace(/<body(.*?)>/, '<body $1>' + el)
    }
  }

  return html
}

const getPageCacheKey = (req: IncomingMessage, uri: string, event: H3Event<EventHandlerRequest>) => {
  if (uri === '/') {
    uri = '/index.htm'
  }

  // 路由缓存参数白名单
  const pageCacheQueryParams = cacheConfig.page_cache_query_params ? cacheConfig.page_cache_query_params : {}
  // 判断uri是否在pageCacheQueryParams中
  if (uri in pageCacheQueryParams) {
    const queryParams = (pageCacheQueryParams as PageCacheQueryParams)[uri]

    const parsedUrl = getRequestURL(event) as any
    if (parsedUrl?.searchParams?.toString()) {
      const query = parsedUrl.searchParams.toString() as string
      const queryArr = []
      for (const item of query.split('&')) {
        if (queryParams.includes(item.toLowerCase().split('=')[0])) {
          queryArr.push(item)
        }
      }
      if (queryArr.length) {
        queryArr.sort()
        uri += '?' + queryArr.join('&')
      }
    }
  }
  // 去掉 trackID 参数
  // const pageCacheIgnoreQueryParams = cacheConfig.page_cache_ignore_query_params
  //   ? cacheConfig.page_cache_ignore_query_params
  //   : []
  // const parsedUrl = getRequestURL(event) as any
  // if (parsedUrl?.searchParams?.toString()) {
  //   const query = parsedUrl.searchParams.toString() as string
  //   const queryArr = []
  //   for (const item of query.split('&')) {
  //     if (!pageCacheIgnoreQueryParams.includes(item.toLowerCase().split('=')[0])) {
  //       queryArr.push(item)
  //     }
  //   }
  //   if (queryArr.length) {
  //     queryArr.sort()
  //     uri += '?' + queryArr.join('&')
  //   }
  // }

  const pageCacheKeyFormat = cacheConfig.page_cache_key_format
  let pageCacheKeyStr = pageCacheKeyFormat
  // page_cache_key_str = page_cache_key_str.replace('$uri', uri)

  // 当前系统判断
  if (pageCacheKeyFormat.includes('$os')) {
    const os = getOperatingSystemInfo(req.headers['user-agent'] as string)
    // if (os === 'win') {
    //   if (isX64(req.headers['user-agent'] as string)) {
    //     os += '_64'
    //   }
    // }
    pageCacheKeyStr = pageCacheKeyStr.replace('$os', os)
  }
  // webp判断
  if (pageCacheKeyFormat.includes('$webp')) {
    let isWebp = 'nonWepb'
    if (req.headers.accept && req.headers.accept.includes('image/webp')) {
      isWebp = 'webp'
    }
    pageCacheKeyStr = pageCacheKeyStr.replace('$webp', isWebp)
  }
  // pc和 mobile 判断
  if (pageCacheKeyFormat.includes('$device')) {
    const device = isMobile(req.headers['user-agent'] as string) ? 'mobile' : 'pc'
    pageCacheKeyStr = pageCacheKeyStr.replace('$device', device)
  }
  // locale 判断
  if (pageCacheKeyFormat.includes('$locale')) {
    const locale = getLocale(req.headers.host as string)
    pageCacheKeyStr = pageCacheKeyStr.replace('$locale', locale)
  }
  // domain 判断
  if (pageCacheKeyFormat.includes('$domain')) {
    pageCacheKeyStr = pageCacheKeyStr.replace('$domain', req.headers.host as string)
  }
  // 浏览器判断
  if (pageCacheKeyFormat.includes('$browser')) {
    const browserType = getBrowser(req.headers['user-agent'] as string) === 'firefox' ? 'ff' : 'other_browser'
    pageCacheKeyStr = pageCacheKeyStr.replace('$browser', browserType)
  }
  // 登录状态判断
  if (pageCacheKeyFormat.includes('$loginStatus')) {
    const loginStatus = getCookie(event, cacheConfig.page_cache_login_cookie_name) ? 'logged' : 'no_logged'
    pageCacheKeyStr = pageCacheKeyStr.replace('$loginStatus', loginStatus)
  }

  return encodeURIComponent(pageCacheKeyStr + '.' + uri)
}

export default defineEventHandler(async (event) => {
  const { req, res } = event.node

  // 在线上及测试域开启缓存
  const online = useRuntimeConfig().public.ENV === 'prod'
  const test = useRuntimeConfig().public.ENV === 'test' && cacheConfig.page_cache_test_open
  const { pathname } = getRequestURL(event)
  if ((online || test) && req.url && pathname) {
    const uri = pathname.replace('_', '-')
    // nuxt 头部需要返回的数据
    const nuxtStartTime = new Date().valueOf()
    // 通过路由判断，进行缓存
    if (!nonCacheUris.includes(uri) && !uri.match(nonUrisRe) && !uri.includes('nuxt-error')) {
      const key = getPageCacheKey(req, uri, event)

      const _ts = getCacheVersion()
      const suffix = '&ts=' + _ts
      await _post('/get?key=' + key + suffix)
        .then((html: string) => {
          if (html) {
            // 页面有缓存
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.setHeader('Accept-Ranges', 'none')
            res.setHeader(
              '_nuxt_cache',
              JSON.stringify({
                hostname: nuxtOs.hostname(),
                pid: process.pid,
                cache_version: _ts,
                cost_time: new Date().valueOf() - nuxtStartTime,
              }),
            )
            if (html) {
              html = htmlAddReferer(req, html)
              res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'))

              console.log(
                '------------------------ hit',
                uri,
                key,
                html.length,
                Buffer.byteLength(html, 'utf-8'),
              )
            }
            res.end(html, 'utf-8')
          } else {
            res.setHeader(
              '_nuxt_cache',
              JSON.stringify({
                hostname: nuxtOs.hostname(),
                pid: process.pid,

                cache_version: -1,
                cost_time: new Date().valueOf() - nuxtStartTime,
              }),
            )
            // 页面没有命中缓存
            res.original_end = res.end
            res.end = function (html: string) {
              if (res.statusCode === 200) {
                // _post('/set?key=' + key + '&ts=' + _ts, html)
                const url = '/set?key=' + key + '&ts=' + _ts
                const jsonData = {
                  url,
                  data: html,
                }
                _post_sync('/receive_data', jsonData)
              }

              if (html) {
                html = htmlAddReferer(req, html)
                res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'))

                console.log('------------------------ miss', html.length, Buffer.byteLength(html, 'utf-8'))
              }
              res.original_end(html, 'utf-8')
            } as any
          }
        })
        .catch((e) => {
          console.log('page_cache, problem with _post, error: ' + e.message + '\n' + e.stack)
          // 生活这么艰难，但是还得继续
          // 降级：即使 page_cache_service 不正常响应，但是页面还需要正常渲染
          res.setHeader(
            '_nuxt_cache',
            JSON.stringify({
              hostname: nuxtOs.hostname(),
              pid: process.pid,

              cache_version: -2,
              cost_time: new Date().valueOf() - nuxtStartTime,
            }),
          )
          res.original_end = res.end
          res.end = function (html: string) {
            if (html) {
              html = htmlAddReferer(req, html)
              res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'))

              console.log('------------------------ catch', html.length, Buffer.byteLength(html, 'utf-8'))
            }
            res.original_end(html, 'utf-8')
          } as any
        })
    } else {
      // 页面不缓存
      res.setHeader(
        '_nuxt_cache',
        JSON.stringify({
          hostname: nuxtOs.hostname(),
          pid: process.pid,
          cache_version: -3,
          cost_time: new Date().valueOf() - nuxtStartTime,
        }),
      )
      res.original_end = res.end
      res.end = function (html: string) {
        if (html) {
          html = htmlAddReferer(req, html)
          res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'))

          console.log('------------------------ not cache', html.length, Buffer.byteLength(html, 'utf-8'))
        }
        res.original_end(html, 'utf-8')
      } as any
    }
  } else {
    // 不是线上环境或 _parsedOriginalUrl 为空
    res.original_end = res.end
    res.end = function (html: string) {
      if (html) {
        html = htmlAddReferer(req, html)
        res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'))
      }
      res.original_end(html, 'utf-8')
    } as any
  }
})
