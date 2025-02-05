const http = require('http')
const fs = require('fs')

const cacheDomain = 'www.dvdfab.cn'
const cacheHostName = process.env.CACHE_HOSTNAME
const cachePost = (url, data) => {
  if (cacheDomain) {
    url = url.includes('?') ? url + '&domain=' + cacheDomain : url + '?domain=' + cacheDomain
  }
  return new Promise(function (resolve, reject) {
    // TODO: 必须设置极短的超时时间，以防 page_cache_service 出错或超时导致页面响应极慢
    const options = {
      protocol: 'http:',
      hostname: cacheHostName,
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

const pageCacheResetVersion = (_ts) => {
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

const getTsFirstLine = () => {
  const dir = './publish_ts/ts.txt'
  const ts = fs.readFileSync(dir, 'utf8').split('\n')
  return encodeURIComponent(ts[0])
}

const getCacheVersion = () => {
  const _ts = getTsFirstLine() // 获取版本号
  return _ts
}

const processQueue = () => {
  const _ts = getCacheVersion()
  // 重置版本
  pageCacheResetVersion(_ts)
  // setTimeout(processQueue, 1000 * 600) // 10分钟执行一次
}

processQueue()
// 执行多次确保执行成功
setTimeout(processQueue, 10000)
setTimeout(processQueue, 30000)
setTimeout(processQueue, 60000)
setTimeout(processQueue, 90000)
