export const useReport = () => {
  const { $trace } = useNuxtApp() as any

  onMounted(async () => {
    await nextTick()

    $trace.init()
    $trace.tracePageView((params: any) => {
      return { ...params }
    })
    $trace.traceDownload()
    $trace.tracePseudoDownload()
    $trace.trackBuy()
  })
}
