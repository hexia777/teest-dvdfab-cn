export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.errorHandler = (err: Error, vm: any, info: string) => {
    window.onload = function () {
      // 将错误信息发送到服务器
      if (err.name === 'TypeError' || err.message.includes('read properties of undefined')) {
        vm.$trace.traceCustomEvent({
          event: 'error',
          xargs_event_category: 'page_type_error',
          event_label: err.name + ' ' + err.message || '',
          event_value: err.stack || info,
        })
      }
    }

    // eslint-disable-next-line no-console
    console.error('nuxtApp.errorHandler, err: ' + err.name + ' ' + err.message + ' ' + err.stack)
  }
})
