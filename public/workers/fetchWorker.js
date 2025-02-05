// 错误信息映射
const errorMsgMap = {
  timeout: 'Request timeout, no response from server!',
  unknown: 'Unknown error',
  404: 'The requested resource does not exist',
  500: 'Internal Server Error',
  403: 'No permission to access this resource',
  401: 'Login status has expired and you need to log in again',
}

const ContentType = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  BLOB: 'application/octet-stream',
  ARRAYBUFFER: 'application/octet-stream',
}

const _that = self

// 主要的消息处理逻辑
self.addEventListener('message', async (e) => {
  try {
    const { requests, baseURL } = e.data

    const fetchPromises = requests.map((request) => {
      const url = new URL((request.baseURL || baseURL) + request.url)
      // 处理 query 参数
      if (request.params) {
        Object.entries(request.params).forEach(([key, value]) => {
          url.searchParams.append(key, value)
        })
      }
      return fetch(url, {
        method: request.method || 'GET',
        headers: {
          'Content-Type': ContentType[request.contentType] || ContentType.JSON,
          ...request.headers,
        },
        body: request.data ? JSON.stringify(request.data) : undefined,
      })
    })

    Promise.all(fetchPromises)
      .then(async (results) => {
        const newRes = []
        for (const result of results) {
          let response = null
          const contentType = result.headers.get('Content-Type') || ''
          // 对响应response进行处理
          if (contentType.includes(ContentType.JSON)) {
            response = await result.json()
          } else if (contentType.includes(ContentType.FORM)) {
            response = await result.formData()
          } else if (contentType.includes(ContentType.TEXT)) {
            response = await result.text()
          } else if (contentType.includes(ContentType.BLOB)) {
            response = await result.blob()
          } else if (contentType.includes(ContentType.ARRAYBUFFER)) {
            response = await result.arrayBuffer()
          } else {
            response = await result.json()
          }
          newRes.push(response)
        }
        _that.postMessage(newRes)
      })
      .catch((error) => {
        // TODO: handle error
        _that.postMessage({ error: error })
      })
  } catch (error) {
    _that.postMessage({ error: error.message })
  }
})
