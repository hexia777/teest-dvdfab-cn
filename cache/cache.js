import http from 'http'
import fs from 'fs'
import querystring from 'querystring'
import myUrl from 'url'
import { cacheConfig } from './cache.config.js'

const config = cacheConfig
const cacheDomain = cacheConfig.cache_domain
const apiCacheList = config.api_cache_list
const cacheIgnoreParams = config.cache_ignore_params
const env = process.env.VITE_PACK_ENV // 本地才会生效
const CACHE_HOSTNAME = process.env.CACHE_HOSTNAME // 配置在pm2的配置文件

const pageCacheHostName = CACHE_HOSTNAME || (env === 'dev' ? cacheConfig.test_hostname : cacheConfig.hostname)

export const cacheApi = (res, url) => {
  return cachePost(url)
    .then((html) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Accept-Ranges', 'none')
      res.setHeader('Content-Length', Buffer.byteLength(html))
      res.end(html, 'utf-8')
    })
    .catch((e) => {
      console.error(e)
    })
}

export const cachePost = (url, data) => {
  if (cacheDomain) {
    url = url.includes('?') ? url + '&domain=' + cacheDomain : url + '?domain=' + cacheDomain
  }
  return new Promise(function (resolve, reject) {
    // TODO: 必须设置极短的超时时间，以防 page_cache_service 出错或超时导致页面响应极慢
    const options = {
      protocol: 'http:',
      hostname: pageCacheHostName,
      port: 40010,
      path: url,
      method: 'POST',
      // timeout: 50,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    }
    const req = http.request(options, function (res) {
      let html = ''
      res.on('data', function (chunk) {
        html += chunk
      })

      res.on('end', function () {
        resolve(html)
      })
    })

    req.on('error', function (e) {
      console.log('page_cache, problem with request, url: ' + url + ', error: ' + e.message + '\n' + e.stack)
      reject(e)
    })
    if (data) {
      req.write(data)
    }
    req.end()
  })
}

export const cachePostSync = (url, jsonData) => {
  if (cacheDomain) {
    jsonData.domain = cacheDomain
  }
  return new Promise(function (resolve, reject) {
    const options = {
      protocol: 'http:',
      host: '127.0.0.1',
      port: 40011,
      path: url,
      method: 'POST',
      // timeout: 50,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const req = http.request(options, function (res) {
      let html = ''
      res.on('data', function (chunk) {
        html += chunk
      })

      res.on('end', function () {
        resolve(html)
      })
    })

    req.on('error', function (e) {
      console.log('page_cache, problem with request, url: ' + url + ', error: ' + e.message + '\n' + e.stack)
      reject(e)
    })
    if (jsonData) {
      req.write(JSON.stringify(jsonData))
    }
    req.end()
  })
}

export const pageCacheResetVersion = (_ts) => {
  cachePost('/setVersion?ts=' + _ts).then((html) => {
    console.log('reset version--------------')
    if (html) {
      console.log(html)
    }
  })
  cachePost('/setVersion?type=1&ts=' + _ts).then((html) => {
    console.log('reset api version--------------')
    if (html) {
      console.log(html)
    }
  })
}

export const clearPageCacheByVersion = (_ts) => {
  cachePost('/clearByVersion?ts=' + _ts).then((html) => {
    // _post('/test?ts=' + _ts).then((html) => {

    console.log('clean--------------')
    if (html) {
      console.log(html)

      console.log('clean-------------keys print end')
    }
  })
}

export const requestCacheGet = async (key) => {
  // return axios.create().get('/get?type=1&key=' + key)
  // 添加接口缓存的版本号信息
  const _ts = getCacheVersion()
  const suffix = '&ts=' + _ts
  return await cachePost('/get?type=1&key=' + key + suffix)
    .then((body) => {
      if (body && typeof body === 'string') {
        return JSON.parse(body)
      }
      return body
    })
    .catch((e) => {
      console.log('requestCacheGet, problem with cache_post, error: ' + e.message + '\n' + e.stack)
    })
}

export const requestCacheSet = async (key, data) => {
  console.log('$$$$$ requestCacheSet start!!----------------------------')
  const _ts = getCacheVersion()
  const suffix = '&ts=' + _ts
  const url = '/set?type=1&key=' + key + suffix
  const jsonData = {
    url,
    data,
  }
  return await cachePostSync('/receive_data', jsonData)
    .then((body) => {
      // if (body) {
      //   return JSON.parse(body)
      // }
      return body
    })
    .catch((e) => {
      console.log('requestCacheSet, problem with cache_post, error: ' + e.message + '\n' + e.stack)
    })
}

export const urlKey = (config, ignoreParams) => {
  const urlInfo = myUrl.parse(config.url)
  const baseUrl = urlInfo.host
  const uri = urlInfo.pathname
  let params = urlInfo.query
  params = querystring.parse(params)
  if (config.params && Object.keys(config.params).length > 0) {
    Object.assign(params, config.params)
  }
  // 去掉多余的params 参数
  Object.assign(ignoreParams, cacheIgnoreParams)
  ignoreParams.forEach((value) => {
    delete params[value]
  })
  const qs = querystring.stringify(params)
  const cacheKey = baseUrl + uri + '?' + qs
  return encodeURIComponent(cacheKey)
}

export const determineCache = (config) => {
  // 服务端，并且是get请求，并且在缓存白名单里或者设置了要缓存
  // 应该也去掉 json 等静态文件请求
  const uri = myUrl.parse(config.url).pathname
  const production = process.env.NODE_ENV === 'production'
  const whiteCacheUrl = apiCacheList.includes(uri) || config.cache
  const isServerSide = !process.browser || config.is_server_request
  // console.log(production, 'production@@@@@@@')
  // console.log(whiteCacheUrl, 'whiteCacheUrl@@@@@@@')
  // console.log(isServerSide, 'isServerSide@@@@@@@')
  // console.log(!process.browser, '!process.browser@@@@@@@')
  return (
    isServerSide && production && config.method === 'get' && whiteCacheUrl && !config.url.endsWith('.json')
  )
}

export const pageCacheStatus = (req) => {
  const pageCacheDevSwitch = config.page_cache_dev_switch
  let online = true
  if (pageCacheDevSwitch) {
    if (pageCacheDevSwitch === 'on') {
      online = true
    } else if (pageCacheDevSwitch === 'off') {
      online = false
    }
  } else {
    online = !req.headers.host.includes(':3000')
  }
  return online
}

export const getCacheConfig = () => {
  return cacheConfig
}

export const axiosRequestOnFullFilled = async (config) => {
  // TODO 判断是否是自己的域名 在自己域名域名下操作添加
  // Append the params, I use jquery param but you can change to whatever you use
  if (determineCache(config)) {
    const cacheKey = urlKey(config)
    const data = await requestCacheGet(cacheKey)
    if (data) {
      data.__fromCache = true

      console.log('$$$$$ api cache hit!!!' + config.url + '------------------------')
      config.data = data
      config.adapter = () => {
        console.log('$$$$$ axios_request_on_full_filled 【config.adapter】------------------------')
        return Promise.resolve({
          data,
          status: config.status,
          statusText: config.statusText,
          headers: config.headers,
          config,
          request: config,
        })
      }
    } else {
      console.log('$$$$$ api cache miss!!!' + config.url + '-----------------------')
    }
  }

  // do something before request is sent
  return config
}

export const axiosResponseOnFullFilled = (response) => {
  const res = response.data
  if (res.cscode == 200 || res.result || res.code == 200 || res.cscode == 0) {
    // 加入缓存

    if (
      determineCache(response.config) &&
      !(Object.prototype.hasOwnProperty.call(response.data, '__fromCache') && response.data.__fromCache)
    ) {
      const cacheKey = urlKey(response.config)

      console.log('$$$$$ api cache response set cache!!!' + response.config.url + '-----------------------')
      requestCacheSet(cacheKey, JSON.stringify(response.data))
    } else {
      console.log(
        '$$$$$ api cache response not set cache~~~' + response.config.url + '-----------------------',
      )
    }
  }
  // return Promise.reject(new Error(res.msg || 'Error'))

  // console.log('$$$$$ 【axios_response_on_full_filled】 res', res)
  return res
}

// 获取 ts 文件第一行（ts文件在发布时会更新）,获取发布后的版本号
export const getTsFirstLine = () => {
  const dir = './publish_ts/ts.txt'
  const ts = fs.readFileSync(dir, 'utf8').split('\n')
  return encodeURIComponent(ts[0])
}

// 获取全局保存的版本信息
export const getCacheVersion = () => {
  let _ts = ''
  if (!global.cacheVersion) {
    _ts = getTsFirstLine() // 获取版本号
    global.cacheVersion = _ts
  } else {
    _ts = global.cacheVersion
  }
  return _ts
}
