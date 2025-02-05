const ctx = self

// 处理函数映射
const handlers = {
  calculate: (payload) => {
    // 示例计算函数
    return payload * 2
  },

  processData: (payload) => {
    // 示例数据处理
    return payload.map((item) => ({
      ...item,
      processed: true,
    }))
  },
}

// 监听消息
ctx.addEventListener('message', async (event) => {
  try {
    const { type, payload } = event.data
    const handler = handlers[type]

    if (!handler) {
      throw new Error(`Unknown message type: ${type}`)
    }

    const result = await handler(payload)
    // 发送响应
    ctx.postMessage({
      type,
      data: result,
    })
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
