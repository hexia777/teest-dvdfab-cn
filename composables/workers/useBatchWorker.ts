export const useBatchFetch = <T>() => {
  // 使用 workers 是为能串行创建多个 worker, 每个 worker 处理自己的结束, 不影响其他 workr
  const workers: Set<any> = new Set()

  const execute = (requests: any[]) => {
    const worker = createWorker('/workers/fetchWorker.js?_v=20250106')
    workers.add(worker)

    return new Promise<T[]>((resolve, reject) => {
      worker
        .execute({
          baseURL: useRuntimeConfig().public.API_BASE + useRuntimeConfig().public.API_PREFIX,
          requests,
        })
        .then((result: unknown) => {
          resolve(result as T[])
        })
        .catch((error: Error) => {
          reject(error)
        })
        .finally(() => {
          // 完成后清理 worker
          worker.terminate()
          workers.delete(worker)
        })
    })
  }

  // 清理方法
  const destroy = () => {
    workers.forEach((worker) => {
      worker.terminate()
    })
    workers.clear()
  }

  const { isClient } = useNuxtApp()
  if (isClient) {
    onUnmounted(destroy)
  }

  return {
    execute,
    destroy,
  }
}
