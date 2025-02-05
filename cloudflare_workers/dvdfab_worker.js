// -----------------------------------------全局变量---------------------------------------
// @ts-ignore
const kvNamespace = DVDFAB_KV

// KV 中的 key
const GLOBAL_CONFIG = 'GLOBAL_CONFIG'
const VERSION_MODULE = 'VERSION_MODULE'
const TTL_MODULE = 'TTL_MODULE'
const WHITELIST_PARAM_COMMON = 'WHITELIST_PARAM_COMMON'
const WHITELIST_PARAM_PAGE = 'WHITELIST_PARAM_PAGE'
const BLACKLIST_URL = 'BLACKLIST_URL'
const TTL_KVCACHE = 'TTL_KVCACHE'

// 全局配置数据
let globalConfigJson = {}

// 全局配置数据的cache ttl
const secondsOfDay = 24 * 3600
let globalConfigTTl = 3 * secondsOfDay

// -----------------------------------------缓存管理接口基础封装---------------------------------------
const E_SUCCESS = 0
const E_INTERNAL = -1
const E_TOKEN = -2
const E_URL = -3

function successResponse(data) {
  return new Response(
    JSON.stringify({
      code: E_SUCCESS,
      data,
    }),
    { status: 200 },
  )
}

function errorResponse(code, errmsg) {
  return new Response(
    JSON.stringify({
      code,
      errmsg,
    }),
    { status: 200 },
  )
}

// -----------------------------------------缓存管理接口---------------------------------------
// 根据key从全局配置中获取数据
async function getDataByKey(key) {
  const globalConfigJsonStr = await kvNamespace.get(GLOBAL_CONFIG)
  try {
    const globalConfigJson = JSON.parse(globalConfigJsonStr || '{}')
    return key ? globalConfigJson[key] : globalConfigJson
  } catch (error) {
    return {}
  }
}

// 通用查询
async function commonQuery(key) {
  try {
    return successResponse(await getDataByKey(key))
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

// 通用更新
async function commonUpdate(key, data, type = 'obj') {
  try {
    // 解析数据，根据类型构造 newData
    const newData = ['obj', 'arr'].includes(type) ? JSON.parse(data) : data
    const oldData = (await getDataByKey(key)) || (type === 'obj' ? {} : type === 'arr' ? [] : '')
    let updatedData

    // 根据类型更新数据
    switch (type) {
      case 'obj':
        updatedData = { ...oldData, ...newData }
        break
      case 'arr':
        updatedData = Array.from(new Set([...oldData, ...newData]))
        break
      case 'str':
        updatedData = newData
        break
      default:
        return errorResponse(E_INTERNAL, 'Invalid type')
    }
    // 更新全局配置
    await updateGlobalConfig(key, updatedData)

    return successResponse(updatedData)
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

// 通用删除
async function commonDelete(key, data, type = 'obj') {
  try {
    // 解析数据，根据类型构造 newData
    const newData = ['obj', 'arr'].includes(type) ? JSON.parse(data) : data
    const oldData = (await getDataByKey(key)) || (type === 'obj' ? {} : type === 'arr' ? [] : '')
    let updatedData

    // 根据类型删除数据
    switch (type) {
      case 'obj':
        newData.forEach((item) => {
          delete oldData[item]
        })
        updatedData = oldData
        break
      case 'arr':
        updatedData = oldData.filter((item) => !data.includes(item))
        break
      case 'str':
        updatedData = ''
        break
      default:
        return errorResponse(E_INTERNAL, 'Invalid type')
    }
    // 更新全局配置
    await updateGlobalConfig(key, updatedData)

    return successResponse(updatedData)
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

async function updateGlobalConfig(key, val, opera) {
  const globalConfigJson = await getDataByKey()
  if (opera == 'delete') {
    delete globalConfigJson[key]
  } else {
    globalConfigJson[key] = val
  }
  const strGlobalConfig = JSON.stringify(globalConfigJson, (key, value) => {
    if (
      typeof value === 'string' &&
      ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}')))
    ) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
    return value
  })
  await kvNamespace.put(GLOBAL_CONFIG, strGlobalConfig)

  return successResponse(globalConfigJson)
}

// 模块版本号的接口
async function listModuleVersion() {
  return commonQuery(VERSION_MODULE)
}

async function updateModuleVersion(data) {
  await commonUpdate(VERSION_MODULE, data)

  const kvNamespaceKeys = await kvNamespace.list()
  const keyList = kvNamespaceKeys.keys.map((item) => item.name)

  const moduleKeyList = Object.keys(JSON.parse(data)).map((item) => item.toUpperCase())
  const filterKeys = moduleKeyList.flatMap((key) => keyList.filter((name) => name.indexOf(key) === 0))

  await Promise.all(filterKeys.map((key) => kvNamespace.delete(key)))

  return successResponse()
}

async function deleteModuleVersion(data) {
  return commonDelete(VERSION_MODULE, data)
}

// 单个URL版本号的接口
async function listUrlVersion(data) {
  const index = data.indexOf('-')
  if (index === -1) {
    return errorResponse(E_INTERNAL, 'Invalid data format. Missing "-" character.')
  }

  const module = data.substring(0, index).trim().toUpperCase()
  const hash = await calculateHash(data.substring(index + 1).trim())

  const version = await kvNamespace.get(`${module}-${hash}`)

  return successResponse(version)
}

async function listUrlkeys(data) {
  const kvNamespaceKeys = await kvNamespace.list()
  const keyList = kvNamespaceKeys.keys.map((item) => item.name)
  const filterKeys = JSON.parse(data).flatMap((key) =>
    keyList.filter((name) => name.indexOf(key.toUpperCase()) === 0),
  )

  return successResponse(filterKeys)
}

async function updateUrlVersion(_, rawdata) {
  const equalIndex = rawdata.indexOf('=')
  if (equalIndex === -1) {
    return errorResponse(E_INTERNAL, 'Invalid data format. Missing "=" character.')
  }
  const key = rawdata.substring(0, equalIndex).trim()
  const version = rawdata.substring(equalIndex + 1).trim()

  const dashIndex = key.indexOf('-')
  if (dashIndex === -1) {
    return errorResponse(E_INTERNAL, 'Invalid data format. Missing "-" character.')
  }
  const module = key.substring(0, dashIndex).trim().toUpperCase()
  const hash = await calculateHash(key.substring(dashIndex + 1).trim())

  await kvNamespace.put(`${module}-${hash}`, version)

  return successResponse(`${module}-${hash}:${version}`)
}

// 模块TTL的接口
async function listModuleTtl() {
  return commonQuery(TTL_MODULE)
}

async function updateModuleTtl(data) {
  return commonUpdate(TTL_MODULE, data)
}

async function deleteModuleTtl(data) {
  return commonDelete(TTL_MODULE, data)
}

// 白名单详细url的接口
async function listWhiteUrl(data) {
  return commonQuery('URL_LIST_' + data.toUpperCase())
}

async function updateWhiteUrlList(_, rawData) {
  const jsonObject = JSON.parse(rawData)
  const key = Object.keys(jsonObject)[0]
  return commonUpdate('URL_LIST_' + key.toUpperCase(), JSON.stringify(jsonObject[key]), 'arr')
}

async function deleteWhiteUrlList(_, rawData) {
  const jsonObject = JSON.parse(rawData)
  const key = Object.keys(jsonObject)[0]
  return commonDelete('URL_LIST_' + key.toUpperCase(), JSON.stringify(jsonObject[key]), 'arr')
}

// 白名单正则表达式的接口
async function listWhiteRe(data) {
  return commonQuery('URL_RE_' + data.toUpperCase())
}

async function updateWhiteRe(_, rawData) {
  try {
    const dataArr = rawData.split('==')
    if (dataArr.length > 1) {
      return commonUpdate('URL_RE_' + dataArr[0].toUpperCase(), dataArr[1], 'str')
    } else {
      return errorResponse(E_INTERNAL, 'Parameter format error')
    }
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

async function deleteWhiteRe(data) {
  try {
    await updateGlobalConfig('URL_RE_' + data.toUpperCase(), '', 'delete')

    return successResponse()
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

// 所有页面通用的白名单参数
async function listCommonWhiteParam() {
  return commonQuery(WHITELIST_PARAM_COMMON)
}

async function updateCommonWhiteParamList(data) {
  return commonUpdate(WHITELIST_PARAM_COMMON, data, 'arr')
}

async function deleteCommonWhiteParamList(data) {
  return commonDelete(WHITELIST_PARAM_COMMON, data, 'arr')
}

// 单个页面独有的白名单参数
async function listSinglePageWhiteParam(data) {
  try {
    const singePageWhiteJson = await getDataByKey(WHITELIST_PARAM_PAGE)
    if (!data) {
      return successResponse(singePageWhiteJson)
    }
    const dataArr = JSON.parse(data)
    const newData = {}
    for (let i = 0; i < dataArr.length; i++) {
      newData[dataArr[i]] = singePageWhiteJson[dataArr[i]]
    }
    return successResponse(newData)
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

async function updateSinglePageWhiteParam(_, rawData) {
  return commonUpdate(WHITELIST_PARAM_PAGE, rawData)
}

async function deleteSinglePageWhiteParam(_, rawData) {
  return commonDelete(WHITELIST_PARAM_PAGE, rawData)
}

// 黑名单url的接口
async function listBlackUrl() {
  return commonQuery(BLACKLIST_URL)
}

async function updateBlackUrlList(_, rawData) {
  return commonUpdate(BLACKLIST_URL, rawData, 'arr')
}

async function deleteBlackUrlList(_, rawData) {
  return commonDelete(BLACKLIST_URL, rawData, 'arr')
}

// KV cacheTtl的接口
async function listKvCacheTtl() {
  return commonQuery(TTL_KVCACHE)
}

async function updateKvCacheTtl(data) {
  return commonUpdate(TTL_KVCACHE, data)
}

/**
 * 查询全局配置数据
 * @returns {Promise<Object>} 返回全局配置数据对象
 */
async function listGlobalConfig() {
  return commonQuery()
}

// 根据key删除KV中的记录
async function deleteKvByKey(data) {
  try {
    await updateGlobalConfig(data, '', 'delete')

    return successResponse()
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

// 处理接口请求
async function handleCacheManageAPI(req) {
  // 鉴权
  const env = globalThis
  if (req.headers.get('token') !== env.TOKEN) {
    return errorResponse(E_TOKEN, 'Access denied')
  }

  const routers = {
    // 模块版本的接口
    'list-module-version': listModuleVersion,
    'update-module-version': updateModuleVersion,
    'delete-module-version': deleteModuleVersion,
    // 单个URL版本的接口
    'list-url-version': listUrlVersion,
    'list-url-keys': listUrlkeys,
    'update-url-version': updateUrlVersion,
    // 模块TTL的接口
    'list-module-ttl': listModuleTtl,
    'update-module-ttl': updateModuleTtl,
    'delete-module-ttl': deleteModuleTtl,
    // 白名单详细url的接口
    'list-white-url': listWhiteUrl,
    'update-white-url-list': updateWhiteUrlList,
    'delete-white-url-list': deleteWhiteUrlList,
    // 白名单正则表达式的接口
    'list-white-re': listWhiteRe,
    'update-white-re': updateWhiteRe,
    'delete-white-re': deleteWhiteRe,
    // 通用白名单参数的接口
    'list-common-white-param': listCommonWhiteParam,
    'update-common-white-param-list': updateCommonWhiteParamList,
    'delete-common-white-param-list': deleteCommonWhiteParamList,
    // 单页面白名单参数的接口
    'list-single-page-white-param': listSinglePageWhiteParam,
    'update-single-page-white-param': updateSinglePageWhiteParam,
    'delete-single-page-white-param': deleteSinglePageWhiteParam,
    // 黑名单的接口
    'list-black-url': listBlackUrl,
    'update-black-url-list': updateBlackUrlList,
    'delete-black-url-list': deleteBlackUrlList,
    // cache ttl的接口
    'list-kv-cache-ttl': listKvCacheTtl,
    'update-kv-cache-ttl': updateKvCacheTtl,
    // 全局配置的接口
    'list-global-config': listGlobalConfig,
    'delete-kv-by-key': deleteKvByKey,
  }

  try {
    for (const [key, action] of Object.entries(routers)) {
      const urlObj = new URL(req.url)
      if (urlObj.pathname.includes(key)) {
        const data = urlObj.searchParams.get('data')
        const rawData = await req.text()
        return await action(data, rawData)
      }
    }

    return errorResponse(E_URL, 'Invalid request URL')
  } catch (error) {
    return errorResponse(E_INTERNAL, error.message)
  }
}

// -----------------------------------------从前端工程复制过来的方法以及一些工具方法---------------------------------------
function getBrowser(ua) {
  const userAgent = ua || ''
  const browsers = {
    Opera: 'opera',
    Edge: 'edge',
    Firefox: 'ff',
    Safari: 'safari',
    Chrome: 'chrome',
  }

  if (userAgent.includes('compatible') && userAgent.includes('MSIE') && !userAgent.includes('Opera')) {
    return 'ie'
  }

  const detectedBrowser = Object.keys(browsers).find((browser) => userAgent.includes(browser))
  return detectedBrowser ? browsers[detectedBrowser] : 'chrome'
}

function getBrowserLocale(language) {
  if (!language) return undefined
  return language.split(';')[0].split(',')[0]
}

function getOperatingSystemInfo(ua) {
  const osMap = {
    win: /Win32|Windows/i,
    mac: /Mac68K|MacPPC|Macintosh|MacIntel|Mac OS X/i,
  }

  for (const [os, regex] of Object.entries(osMap)) {
    if (regex.test(ua)) {
      return os
    }
  }

  return 'win'
}

function isMobile(ua) {
  const mobileRegex =
    /(?:android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i

  const oldMobileRegex =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i

  return mobileRegex.test(ua) || oldMobileRegex.test(ua ? ua.substr(0, 4) : '')
}

function getCookie(cookies, name) {
  let arr

  if (cookies) {
    arr = cookies.match(RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  }

  return arr != null ? unescape(arr[2]) : null
}

function handlePromotionBannerStatus(event, hitHtml) {
  let proLine = 'common'
  let cookieSuffix = 'default'
  const regex = /data-glob-promotion-name="([^"]*)"/
  const regex2 = /data-glob-promotion-cookie-suffix="([^"]*)"/
  // 访问http://fr.localhost:3000/upload/resource/fr/free-dvd-ripper-mac-vB83.jpeg hitHtml会返回{} hit_html.match报错导致500
  if (typeof hitHtml === 'string') {
    const match = hitHtml.match(regex)
    if (match) {
      proLine = match[1]
    }
    const match2 = hitHtml.match(regex2)
    if (match2) {
      cookieSuffix = match2[1]
    }
  }

  const headerBannerCookie = `close_coupon_${proLine}_${cookieSuffix}`
  const floatBannerCookie = `close_${proLine}_${cookieSuffix}`
  const floatBannerCookie_7 = `pop_${proLine}_${cookieSuffix}`
  const close_float_banner_session = 'close_float_banner_session'

  const headerBannerMagic = `data-style="83d943e0-848f-415a-b93b-6195087f1e6c"`
  const floatBannerMagic = `data-style="6e452cea-3936-49cd-80ba-876e867ea2e0"`
  const hasHeadbanner = `data-has-headbanner="has-headbanner"` // has-headbanner
  let html = hitHtml
  if (getCookie(event, headerBannerCookie)) {
    if (html && typeof html === 'string') {
      html = html.replace(new RegExp(headerBannerMagic, 'g'), `style="display: none;"`)
      html = html.replace(new RegExp(hasHeadbanner, 'g'), ``) // 是否显示banner
    }
  }

  if (
    getCookie(event, floatBannerCookie) ||
    getCookie(event, floatBannerCookie_7) ||
    getCookie(event, close_float_banner_session)
  ) {
    if (html && typeof html === 'string') {
      html = html.replace(new RegExp(floatBannerMagic, 'g'), `style="display: none;"`)
    }
  }

  if (typeof html === 'string') {
    html = html.replace(new RegExp(floatBannerMagic, 'g'), '')
    html = html.replace(new RegExp(headerBannerMagic, 'g'), '')
  }

  return html
}

function getCurrentFormattedTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`
}

async function calculateHash(content) {
  // 计算 SHA1
  const sha1Buffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(content))
  const sha1Array = new Uint8Array(sha1Buffer)
  const sha1Hex = Array.from(sha1Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return sha1Hex
}

// -----------------------------------------缓存处理---------------------------------------
async function getKVGlobalConfig() {
  const globalConfigData = await kvNamespace.get(GLOBAL_CONFIG, { cacheTtl: globalConfigTTl })
  if (globalConfigData) {
    globalConfigJson = JSON.parse(globalConfigData)
  } else {
    // 默认配置
    globalConfigJson = {
      VERSION_MODULE: {},
      TTL_MODULE: {},
      BLACKLIST_URL: [],
      WHITELIST_PARAM_COMMON: [],
      WHITELIST_PARAM_PAGE: {},
      TTL_KVCACHE: {
        GLOBAL_CONFIG: 60,
      },
    }
  }

  if (globalConfigJson[TTL_KVCACHE] && globalConfigJson[TTL_KVCACHE][GLOBAL_CONFIG]) {
    globalConfigTTl = globalConfigJson[TTL_KVCACHE][GLOBAL_CONFIG]
  }
}

async function getAllMoudleInfoList() {
  const set = []
  const moduleVersionJson = globalConfigJson[VERSION_MODULE] || {}
  for (const module in moduleVersionJson) {
    // 获取模块的 URL 列表
    const moduleUrlKey = `URL_LIST_${module.toUpperCase()}`
    const moduleUrlsArr = globalConfigJson[moduleUrlKey] || []

    // 模块TTL数据
    const moduleTtlJson = globalConfigJson[TTL_MODULE] || {}
    const obj = {
      set: new Set(moduleUrlsArr),
      type: module,
      ttl: moduleTtlJson[module] || 0,
    }

    // 获取判断 URL 是否属于模块的正则表达式
    const moduleReKey = `URL_RE_${module.toUpperCase()}`
    const moduleRe = globalConfigJson[moduleReKey] || null
    if (moduleRe) {
      obj.regex = new RegExp(moduleRe)
    }

    set.push(obj)
  }
  return set
}

async function cacheRequest(request, ttl) {
  return await fetch(request, {
    cf: {
      cacheTtl: 0,
      cacheEverything: false,
      cacheTtlByStatus: { 200: ttl, 304: ttl },
    },
  })
}

function strandardUri(url) {
  return new URL(url).pathname.replace('_', '-')
}

async function getReqUrlInfo(req) {
  const bypassRes = { bypass: true, urlType: '', ttl: 0 }
  const uri = strandardUri(req.url)
  if (req.method === 'POST') {
    return bypassRes
  }

  // 不需要缓存的页面
  const notCacheUrlList = globalConfigJson[BLACKLIST_URL] || []
  if (new Set(notCacheUrlList).has(uri)) {
    return bypassRes
  }

  // 根据模块白名单url、模块白名单正则表达式和模块ttl构造Set集合
  const sets = await getAllMoudleInfoList()

  // @ts-ignore
  for (const { set, type, regex, ttl } of sets) {
    if (set.has(uri) || (regex && regex.test(uri))) {
      return { bypass: false, urlType: type, ttl }
    }
  }

  return bypassRes
}

const processWhitelistParams = (url) => {
  // 如果有通用白名单参数，则添加到需要保留的参数列表中
  const needKeepParams = new Set(globalConfigJson[WHITELIST_PARAM_COMMON] || [])
  const uri = strandardUri(url)

  // 如果有单页面特有的白名单参数，则添加到需要保留的参数列表中
  const singlePageWhiteParamJson = globalConfigJson[WHITELIST_PARAM_PAGE] || {}
  if (singlePageWhiteParamJson[uri]) {
    singlePageWhiteParamJson[uri].forEach((param) => needKeepParams.add(param))
  }

  // 从url中提取需要保留的参数
  const params = new URLSearchParams()
  const urlObj = new URL(url)
  for (const [key, value] of urlObj.searchParams) {
    if (needKeepParams.has(key)) {
      params.append(key, value)
    }
  }

  // 对参数进行排序
  urlObj.search = new URLSearchParams([...params.entries()].sort()).toString()

  return urlObj.toString()
}

async function rewriteUrl(req) {
  let url = processWhitelistParams(req.url)

  // 判断浏览器语言locale、系统os、设备device
  const locale = getBrowserLocale(req.headers.get('accept-language'))
  const os = getOperatingSystemInfo(req.headers.get('user-agent'))
  const device = isMobile(req.headers.get('user-agent')) ? 'mobile' : 'pc'
  const key = encodeURIComponent(`${locale}.${os}.${device}`)
  url += url.includes('?') ? `&_client=${key}` : `?_client=${key}`

  const cookie = req.headers.get('cookie')
  if (cookie) {
    const arrCookie = cookie.split(';')
    arrCookie.forEach((cookieItem) => {
      // 去除前后的空白字符
      cookieItem = cookieItem.trim()

      // 如果 cookie 已经在 URL 中，则忽略
      const [cookie_name, cookie_value] = cookieItem.split('=')
      const isCookieInUrl = (name) => url.includes(`?${name}=`) || url.includes(`&${name}=`)
      if (isCookieInUrl(cookie_name)) {
        return
      }

      // ab 测试的 cookie 保留
      if (cookie_name.startsWith('_ab')) {
        url += `&${cookie_name}=${cookie_value}`
      }
    })
  }

  return url
}

async function getUrlVersion(urlType, url) {
  const { protocol, host, pathname } = new URL(url)
  const baseUrl = `${protocol}//${host}${pathname}`
  const hash = await calculateHash(baseUrl)

  return kvNamespace.get(`${urlType.toUpperCase()}-${hash}`, { cacheTtl: globalConfigTTl })
}

async function bypassCache(req) {
  const response = await fetch(req)
  try {
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('text/html')) {
      const html = await response.text()
      const processedHtml = handlePromotionBannerStatus(req.headers.get('cookie'), html)
      return new Response(processedHtml, response)
    } else {
      return response
    }
  } catch (error) {
    console.log('bypassCache error:', error)
    return response
  }
}

async function handleCache(req) {
  const kvStart = new Date().getTime()
  // 获取 KV 的配置数据
  await getKVGlobalConfig()
  const kvDuration = new Date().getTime() - kvStart

  // 根据请求的 url 判断是否绕过缓存，同时获取 url 的类型和 ttl
  const { bypass, urlType, ttl } = await getReqUrlInfo(req)
  if (bypass) {
    return bypassCache(req)
  }

  // 重写 url
  const url = await rewriteUrl(req)

  // 获取URL的版本号
  const urlVersion = await getUrlVersion(urlType, url)

  // 构造缓存Key，优先使用URL的版本号，URL没有单独的版本号则使用模块的版本号
  const version = urlVersion || globalConfigJson[VERSION_MODULE]?.[urlType] || getCurrentFormattedTime()
  const newUrl = `${url}&_version=${urlVersion ? `url_${version}` : `${urlType}_${version}`}`

  // 发起请求，会先从边缘缓存（包括分层缓存）中查找，如果没有再从源站获取
  const newRequest = new Request(newUrl, req)
  newRequest.headers.delete('If-Modified-Since')
  let response = await cacheRequest(newRequest, ttl)

  // 处理促销活动 Banner（是否被关闭）
  const processedHtml = handlePromotionBannerStatus(req.headers.get('cookie'), await response.text())
  response = new Response(processedHtml, response)

  // 设置缓存控制头
  response.headers.delete('Last-Modified')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  const browserType = getBrowser(req.headers.get('user-agent'))
  if (browserType == 'ff') {
    // Firefox 浏览器在 max-age 有效期内不会协商缓存，需要特殊处理
    response.headers.set('Cache-Control', 'public, max-age=0, no-transform') // no-transform 可以保证 ETAG 响应头始终会带上
  } else {
    response.headers.set('Cache-Control', `public, max-age=${ttl}, immutable, no-transform`)
  }

  // 根据处理后的html内容计算etag
  const etag = await calculateHash(processedHtml)
  response.headers.set('Etag', etag)

  // 如果etag没有改变，则返回304响应
  let etagHasChanged = true
  if (etag == newRequest.headers.get('If-None-Match')) {
    etagHasChanged = false
    response = new Response(null, {
      status: 304,
    })
  }

  const { colo, city, country } = req.cf // 边缘数据中心信息

  // 诊断模式响应更多调试信息
  if (req.url.includes('_debug_cf_workers=1')) {
    response.headers.set(
      '_cf_workers_info',
      JSON.stringify({
        newUrl,
        colo,
        city,
        country,
        kvDuration,
        etagHasChanged,
        browserType,
      }),
    )
  }

  // 记录日志
  console.log({
    orignalUrl: req.url,
    cookie: req.headers.get('cookie'),
    newUrl,
    colo,
    city,
    country,
    kvDuration,
    etagHasChanged,
    browserType,
  })

  return response
}

async function handleRequest(event) {
  /* 注意只要是通过域名访问的请求都会请过这里，如图片、Favicon、json、xml、txt、php、js、css等静态资源，都会被拦截 */
  const req = event.request
  try {
    const urlObj = new URL(req.url)

    // 如果携带参数 _original=1 绕过缓存
    if (urlObj.searchParams.get('_original') == '1') {
      return bypassCache(req)
    }

    // 处理缓存管理的接口请求
    if (urlObj.pathname.includes('/-cloudflare-worker/')) {
      return await handleCacheManageAPI(req)
    }

    // 处理缓存
    return await handleCache(req)
  } catch (error) {
    // 报错后绕过缓存
    try {
      const stack = JSON.stringify(error.stack) || error.toString()
      console.log({ _cf_err: error.message, _cf_err_stack: stack })
    } catch (error) {
      console.log('handleRequest has error:', error)
    }
    return bypassCache(req)
  }
}

addEventListener('fetch', (event) => {
  // 如果出现异常，让请求穿透
  event.passThroughOnException()

  return event.respondWith(handleRequest(event))
})
