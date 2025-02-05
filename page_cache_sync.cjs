// https://www.npmjs.com/package/simple-in-memory-queue
const http = require('http')
const url = require('url')
const { createQueue, QueueOrder } = require('simple-in-memory-queue')
const cacheIpList = process.env.CACHE_IPS.split(',')
const cacheHostName = process.env.CACHE_HOSTNAME
// 本地测试
// const cacheIpList = ['127.0.0.1']
// const cacheHostName = 'localhost'
console.log(cacheIpList)

// 创建队列实例
const dataQueue = createQueue({
  order: QueueOrder.FIRST_IN_FIRST_OUT,
})
// const dataQueue = []
// dataQueue.push([{ key: 'key1', value: 'value1' }])
// dataQueue.push('123')
// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  if (req.url === '/receive_data' && req.method === 'POST') {
    const p = url.parse(req.url, true)
    // const uri = p.pathname
    // const key = p.query ? p.query['key'] : undefined
    console.log('p==', p)
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      console.log('get html data')
    })
    req.on('end', () => {
      console.log('set data to queue')
      const data = body
      // 将数据放入队列
      dataQueue.push(data)
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Data received and queued successfully.')
    })
  } else {
    res.writeHead(404)
    res.end()
  }
})

const port = 40011
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// 数据发送到page cache缓存中
function sendDataToPageCache(hostname, url, data) {
  // console.log('sendDataToPageCache============', hostname, url, data)
  try {
    return new Promise(function (resolve, reject) {
      // TODO: 必须设置极短的超时时间，以防 page_cache_service 出错或超时导致页面响应极慢
      const options = {
        protocol: 'http:',
        hostname,
        port: 40010,
        path: url,
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      }
      // console.log('options: sendDataToPageCache', JSON.stringify(options, null, 2))
      console.log('options: sendDataToPageCache')
      const req = http.request(options, function (res) {
        let html = ''
        res.on('data', function (chunk) {
          html += chunk
        })

        res.on('end', function () {
          resolve(1)
        })
      })
      req.on('error', function (e) {
        console.log(
          'page_cache, problem with request, url: ' + url + ', error: ' + e.message + '\n' + e.stack,
        )
        resolve(0)
      })

      // 设置超时时间为50毫秒
      const timeout = 500
      const timeoutError = new Error('Request Timeout')
      const timeoutId = setTimeout(() => {
        req.abort() // 终止请求
        resolve(0)
      }, timeout)

      if (data) {
        req.write(data)
      }
      req.end()
    })
  } catch (error) {
    console.error('Error sending data:', error)
  }
}

// 把数据发送到本地缓存
function sendDataToLocalCache(url, data) {
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
    console.log('options:', options)
    // console.log('options: sendDataToLocalCache', cacheHostName, JSON.stringify(options, null, 2))
    const req = http.request(options, function (res) {
      let html = ''
      res.on('data', function (chunk) {
        html += chunk
      })

      res.on('end', function () {
        resolve(html)
      })
    })
    /* req.setTimeout(100, function () {
      req.destroy()
      console.log('timeout!! request destroyed')
    }) */
    req.on('error', function (e) {
      // eslint-disable-next-line no-console
      console.log('page_cache, problem with request, url: ' + url + ', error: ' + e.message + '\n' + e.stack)
      reject(e)
    })
    // 设置超时时间为100毫秒
    const timeout = 100
    const timeoutError = new Error('Request Timeout')
    const timeoutId = setTimeout(() => {
      req.abort() // 终止请求
      resolve(0)
    }, timeout)

    if (data) {
      req.write(data)
    }
    req.end()
  })
}
// dataQueue.on.push.subscribe(({ item }) => {
//   console.log('this is item 发送到其他内容中')
//   console.log(item)
// })

// 从队列中取出元素并处理
const processQueue = async () => {
  // if (dataQueue.length == 0) {
  //   console.log('Queue is empty')
  //   setTimeout(processQueue, 1000)
  //   return
  // }
  // const item = dataQueue.shift()
  if (dataQueue.size == 0) {
    console.log('Queue is empty')
    setTimeout(processQueue, 1000)
    return
  }
  const item = dataQueue.pop()
  if (item) {
    console.log('Popped item:', item)
    // 取出数据,[ { data: [ 'set/key/dvdfab-url/125466', '<a>test</a>' ] } ]
    if (item.length > 0) {
      console.log('start send data to page cache')
      const data = JSON.parse(item[0])
      if (data && data.url && data.data) {
        let url = data.url
        const content = data.data
        // 如果存在data.data[2，，就需要取data.data[2]
        const cache_domain = data.domain
        if (cache_domain) {
          url = url.includes('?') ? url + '&domain=' + cache_domain : url + '?domain=' + cache_domain
        }
        console.log('url:', url)
        // console.log('content:', content)
        // 遍历cacheIpList
        let resFlag = 0
        for (let i = 0; i < cacheIpList.length; i++) {
          console.log('cacheIpList[i]:', cacheIpList[i])
          const res = await sendDataToPageCache(cacheIpList[i], url, content)
          console.log('res:', res)
          if (res == 1) {
            resFlag = 1
          }
        }
        // 如果resFlag == 0，则说明所有page cache服务都发送失败，需要重新发送数据
        if (resFlag == 0) {
          await sendDataToLocalCache(url, content)
        }
      }
    }
  }
  setTimeout(processQueue, 1000)
}

processQueue()
