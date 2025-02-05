import {
  redirectPage302,
  news_pages,
  unknow_pages,
  checkout_pids_302,
  web_domain as sibling_domain, //
} from '../config/redirect/redirectPages302'
import { pages, jaPages, enPages, dePages, frPages, zhPages } from '../config/redirect/redirectPages301'
import { routes } from '../config/route/nonSuffixRoutes'
import { pages as germanMagazinePages } from '../config/route/germanMagazine'

const setUri = (fullPath: string, uri: string) => {
  let newUri = uri
  if (fullPath.includes('?')) {
    if (uri.includes('?')) {
      newUri = uri.toLowerCase() + '&' + fullPath.split('?')[1]
    } else {
      newUri = uri.toLowerCase() + '?' + fullPath.split('?')[1]
    }
  }
  return newUri
}

// 处理 301 跳转
function handle301(uri: string, host: string, route: { [k: string]: any }) {
  /**
   * @function matchRouteByRoutes
   * @description 判断是否匹配路由
   * @returns {boolean}
   */
  const matchRouteByRoutes = (input: string, array: string[]): boolean => {
    input = input.replace(useAppConfig().page_suffix, '') // 去掉后缀
    let flag = false
    for (const k in array) {
      let item = array[k]
      const arr = item.split('-')
      for (const i in arr) {
        if (Number(i) > 0) {
          // 动态路由
          arr[i] = '[a-zA-Z0-9_-]+'
        } else {
          arr[i] = arr[i].replace(/_/g, '-')
        }
      }
      item = '/' + arr.join('/')
      const regex = new RegExp(item) // 将数组元素中的连字符替换为匹配任意连字符的正则表达式
      if (regex.test(input)) {
        flag = true
        break
      }
    }
    return flag
  }

  const lang = useLocale(host)

  /*
   * 处理带或者不带 后缀的情况
   * 处理二级和多级页面的情况
   * */
  // if (uri.includes('/api/backend')) {
  //   return false
  // }
  if (['/', '/index', '/index.htm'].includes(uri)) {
    // 首页特别处理
  } else if (matchRouteByRoutes(uri, routes)) {
    if (uri.includes(useAppConfig().page_suffix)) {
      // 不需要 .htm 后缀但是带了
      uri = uri.replace(/\.htm\/?$/gi, '')
      console.log('middleware route_redirect +.htm rule5 ' + host + route.fullPath + ' to ' + host + uri)
    }
  } else if (!uri.includes(useAppConfig().page_suffix)) {
    // 需要 后缀但是没带、动态处理产品页
    uri = uri + useAppConfig().page_suffix
    console.log('middleware route_redirect -.htm rule6 ' + host + route.fullPath + ' to ' + host + uri)
  }
  /*
   * 这部分代码换执行位置，请谨慎，前面有加.htm的逻辑，这里需要去掉
   * eg:https://www.dvdfab.cn/upload/tips/how-to-download-music-off-youtube-5.jpeg.htm
   * to
   * https://www.dvdfab.cn/upload/tips/how-to-download-music-off-youtube-5.jpeg
   * */
  if (
    uri.split('.').length === 3 &&
    uri.split('.')[2] === 'htm' &&
    ['jpeg', 'jpg', 'png'].includes(uri.split('.')[1])
  ) {
    uri = uri.replace('.htm', '')
    console.log('middleware route_redirect rule7 ' + host + route.fullPath + ' to ' + host + uri)
  }

  /*
   * reviews 分页301跳转
   *  /reviews/blu-ray-copy/2  to  /reviews/blu-ray-copy?num=2
   * */
  if (uri.indexOf('/reviews') === 0 && uri.split('/').length >= 4) {
    const arr = uri.split('/')
    if (!isNaN(+arr[3])) {
      uri = '/reviews/' + arr[2] + '?' + 'num=' + arr[3]
      console.log('middleware route_redirect rule8 ' + host + route.fullPath + ' to ' + host + uri)
    } else {
      uri = '/reviews/' + arr[2]
      console.log('middleware route_redirect rule9 ' + host + route.fullPath + ' to ' + host + uri)
    }
  }

  /*
   * 这里需要放到 uri 拼接上参数逻辑的上面
   * **/
  // 英语|日语|德语 路由 重定向
  const config = {
    en: enPages,
    ja: jaPages,
    de: dePages,
    fr: frPages,
    zh: zhPages,
  }

  for (const key in config[lang]) {
    if (uri === key) {
      uri = config[lang][key]
      console.log('middleware route_redirect rule10 ' + host + route.fullPath + ' to ' + host + uri)
      break
    }
  }
  /*
   * 部分特殊页面 301 重定向
   * */
  for (const key in pages) {
    if (uri === key) {
      uri = pages[key]
      console.log('middleware route_redirect rule11 ' + host + route.fullPath + ' to ' + host + uri)
      break
    }
  }

  // 全部转为小写
  if (/[A-Z]/g.test(uri)) {
    if (uri.includes('?')) {
      uri = uri.split('?')[0].toLowerCase() + '?' + uri.split('?')[1]
    } else {
      uri = uri.toLowerCase()
    }
    console.log('middleware route_redirect A-Z rule12 ' + host + route.fullPath + ' to ' + host + uri)
  }

  // 去掉多个斜线的问题 eg://///page.htm
  if (/\/{2,}/g.test(uri)) {
    const uri2 = uri.replace(/\/{2,}/g, '/')
    if (uri !== uri2) {
      uri = uri2
      console.log('middleware route_redirect /{2,} ' + host + route.fullPath + ' to ' + host + uri)
    }
  }

  // 下划线转换为中划线
  if (uri.includes('_')) {
    uri = uri.replace(/_/g, '-')
    console.log('middleware route_redirect _ to - ' + host + route.fullPath + ' to ' + host + uri)
  }

  /*
   * /tips/  how-to-copy-dvd-to-computer-pc-hard-drive  .htm 处理帶空格的
   * /tips/how-to-play-back-blu-ray-discs-on- macbook-pro.htm
   * 链接（只能由字母./数字组成）带有特殊字符的 空|”|中文
   * 双斜线 替换成单斜线
   * _替换成-
   * */
  if (uri && /[^a-z0-9-./]/gi.test(uri)) {
    if (uri.includes('?')) {
      uri =
        uri
          .split('?')[0]
          .replace(/_/gi, '-')
          .replace(/[^a-z0-9-./]/gi, '')
          .toLowerCase() +
        '?' +
        uri.split('?')[1]
    } else {
      uri = uri.replace(/_/gi, '-').replace(/[^a-z0-9-./]/gi, '')
    }

    console.log('middleware route_redirect rule13 ' + host + route.fullPath + ' to ' + host + uri)
  }

  // 德语杂志页面 其他语种访问，都301跳转到德语
  let new_host = host
  if (germanMagazinePages.includes(uri) && lang !== 'de') {
    new_host = 'https://' + useAppConfig().web_domain.de
  }
  // uri 拼接上参数
  uri = setUri(route.fullPath, uri)

  if (route.fullPath !== uri || new_host !== host) {
    console.log('middleware route_redirect redirect(301) ' + host + route.fullPath + ' to ' + host + uri)
    return uri
  }
  return false
}

// 处理 302 跳转
function handle302(uri: string, initUri: any, host: string, fullPath: string, to: any) {
  // 重置uri （当一个正常的url时，setUri 改变uri值）
  uri = initUri

  // 部分特殊页面 302 重定向
  for (const key in redirectPage302) {
    if (uri === key) {
      uri = redirectPage302[key]
      console.log('middleware route_redirect(302) rule1 ' + host + fullPath + ' to ' + host + uri)
      break
    }
  }

  // uri 拼接上参数,参数要经过编码解析,防止url中带了特殊编码识别不到参数,如/checkout.htm?pid=200%341&coupon=bpp40
  if (fullPath.includes('?')) {
    uri = uri + '?' + fullPath.split('?')[1]
  }

  if (uri.includes('/promotion.htm') && uri.includes('soft=passkey_client')) {
    uri = '/passkey.htm' + '?' + fullPath.split('?')[1]
    console.log('middleware route_redirect(302) rule2 ' + host + fullPath + ' to ' + host + uri)
  }

  /*
   * 处理客户端 whats news的跳转 news_pages
   * 处理客户端 unknow-version(无效版本)的跳转  unknow_pages
   * */
  if (['/dvd-fab-new.htm', '/unknow-version.htm'].includes(initUri) && uri.includes('client_id')) {
    const params = to.query || {}
    const client_id = params.client_id
    let pages_ = news_pages
    if (initUri === '/unknow-version.htm') {
      pages_ = unknow_pages
    }
    if (pages_[client_id]) {
      let paramsStr = ''
      for (const key in params) {
        if (key !== 'client_id') {
          paramsStr += '&' + key + '=' + params[key]
        }
      }
      uri = pages_[client_id].toLowerCase() + (paramsStr ? paramsStr.replace('&', '?') : '')
      console.log('middleware route_redirect(302) rule2 ' + host + fullPath + ' to ' + host + uri)
    }
  }

  // 客户端或其他第三方网站单品购买Checkout 链接跳转到产品单页
  if (uri.includes('/checkout.htm') && !host.includes('localhost')) {
    const params = to.query || {}
    const referrer = useRequestHeader('referer') || useRequestHeader('referrer') || ''
    let referrerHost = referrer.split('//')[1] ? referrer.split('//')[1].split('/')[0] : ''
    // 兼容测试域
    if (referrerHost.includes('test') || referrerHost.includes('testapi')) {
      referrerHost = referrerHost.replace(/test\d*\./, '').replace(/testapi\d*\./, '')
      if (referrerHost === 'dvdfab.cn') {
        referrerHost = 'www.' + referrerHost
      }
    }
    let isRedirect: boolean = true // 是否跳转
    if (referrerHost) {
      // host 不能是站内的
      const web_domain: { [key: string]: string } = useAppConfig().web_domain
      for (const key in web_domain) {
        if (web_domain[key] === referrerHost) {
          isRedirect = false
          break
        }
      }
      if (isRedirect) {
        // 兄弟站点域名
        sibling_domain.forEach((domain) => {
          if (domain === referrerHost) {
            isRedirect = false
          }
        })
      }
    } else if (!uri.includes('client')) {
      // url 里面必须包含client关键词，避免直接打开checkout页面时也会跳转
      isRedirect = false
    }

    // uri 参数带client的强制跳
    if (!isRedirect && uri.includes('client')) {
      isRedirect = true
    }
    // let url = getProUrl('', params.pid, true, true)
    // // 客户端 购买365 不跳转
    // if (isRedirect && uri.includes('client') && ['dvdfab365'].includes(url)) {
    //   isRedirect = false
    // }
    // if (isRedirect) {
    //   // bundle 不跳转
    //   if (url && !bundles_url.includes(url)) {
    //     url = url.replace(/_/g, '-') + '.htm'
    //     uri = uri.replace('checkout.htm', url)
    //     if (!uri.includes('&open=true')) {
    //       uri += '&open=true'
    //     }
    //   }
    // }
  }

  /// checkout.htm?pid=20041  跳转至 /dvdfab365.htm
  if (uri.startsWith('/checkout.htm') && (uri.includes('20041') || uri.includes('20020'))) {
    const params = to.query || {}
    const params_pids = params.pid ? params.pid.split(',') : []
    if (params.pid) {
      if (params_pids.includes('20041')) {
        uri = '/dvdfab365.htm'
        for (const key in params) {
          if (!(['pid', 'qty', 'coupon', 'discount', ''].includes(key) || key.startsWith('opt'))) {
            uri += (uri.includes('?') ? '&' : '?') + key + '=' + params[key]
          }
        }
      } else if (params_pids.includes('20020')) {
        uri = '/member.htm?a=extended_download_service'
      }
    }
  }

  // checkout链接:pid为stream-player子产品的(pids_301)，手动输入链接统一跳转到新stream-player.htm页面(to_301_page)
  if (uri.startsWith('/checkout.htm') && to.query && to.query.pid) {
    const params = to.query || {}
    const params_pids = params.pid ? params.pid.split(',') : []
    for (const key in checkout_pids_302) {
      if (
        key &&
        Object.keys(checkout_pids_302).length > 0 &&
        Object.keys(checkout_pids_302).includes(params_pids[0])
      ) {
        uri = checkout_pids_302[key] + '?open=true'
        console.log('middleware route_redirect(302) rule2 ' + host + fullPath + ' to ' + host + uri)
        break
      }
    }
  }

  if (fullPath !== uri) {
    console.log('middleware route_redirect redirect(302) ' + host + fullPath + ' to ' + host + uri)
    return uri
  }
  return false
}
// ({ req, redirect }
export default defineNuxtRouteMiddleware((to) => {
  // 以下代码只在服务端执行
  if (import.meta.client) return

  const host = useRequestURL().host
  if (host && to.path) {
    // 针对那种空格的链接做转换
    const initUri = to.path
    let uri = initUri
    // 判斷query参数是否符合
    const { query_string, failed } = parse_query_string(to.query)
    if (failed) {
      // 如果解析失败, 需要进行一次重定向
      const urlParamsStr = new URLSearchParams(query_string).toString()
      const newUri = decodeURI(to.path)
      // urlParamsStr 不为空时，需要拼接到url后面
      uri = urlParamsStr === '' ? newUri : newUri + '?' + urlParamsStr
      console.log('------------------', 'middleware route_redirect failed ' + to.path + ' ' + uri)
      return navigateTo(uri, { redirectCode: 302 })
    }
    // 跳过除 .htm 以外的扩展名
    if (uri.includes('.') && !uri.endsWith(useAppConfig().page_suffix)) {
      return
    }

    const handleRes301 = handle301(uri, host, to)
    if (handleRes301 !== false) {
      return navigateTo(handleRes301, { redirectCode: 301, external: true })
    }

    const handleRes302 = handle302(uri, initUri, host, to.fullPath, to)
    if (handleRes302 !== false) {
      return navigateTo(handleRes302, { redirectCode: 302, external: true })
    }
  }
})

// 解析query参数,过滤掉异常参数
function parse_query_string(query: { [key: string]: any }) {
  let failed = false
  const query_string: { [key: string]: any } = {}
  for (const k in query) {
    try {
      const key = decodeURIComponent(decodeURI(k))
      const org_value = query[k]
      // 修复参数内容中带==号的情况
      const value = decodeURIComponent(decodeURI(org_value))
      // If first entry with this name
      if (typeof query_string[key] === 'undefined') {
        query_string[key] = value
        // If second entry with this name
      } else if (typeof query_string[key] === 'string') {
        const arr = [query_string[key], value]
        query_string[key] = arr
        // If third or later entry with this name
      } else {
        query_string[key].push(value)
      }
    } catch (e) {
      console.log('parse_query_string error:', e)
      failed = true
    }
  }
  return { query_string, failed }
}
