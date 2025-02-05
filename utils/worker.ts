class WorkerWrapper {
  private worker: Worker

  constructor(workerScript: string) {
    this.worker = new Worker(workerScript)
  }

  // 向 worker 发送数据并返回 Promise
  execute<T, R>(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        this.worker.removeEventListener('message', handleMessage)
        this.worker.removeEventListener('error', handleError)

        // 检查是否有错误响应
        if (event.data && event.data.error) {
          reject(event.data)
          return
        }

        resolve(event.data as R)
      }

      const handleError = (error: ErrorEvent) => {
        this.worker.removeEventListener('message', handleMessage)
        this.worker.removeEventListener('error', handleError)
        reject(new Error(`Worker error: ${error.message}`))
      }

      this.worker.addEventListener('message', handleMessage)
      this.worker.addEventListener('error', handleError)

      // 确保发送的数据是可序列化的
      const transferableData = JSON.parse(JSON.stringify(data))
      this.worker.postMessage(transferableData)
    })
  }

  terminate() {
    this.worker.terminate()
  }
}

// 工厂函数创建 worker 实例
export const createWorker = (workerScript: string) => {
  return new WorkerWrapper(workerScript)
}
