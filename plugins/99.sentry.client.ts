import * as Sentry from '@sentry/vue'
import { getSentryConfig } from '../config/sentry'
import type { SentryConfig } from '../config/sentry.d'

export default defineNuxtPlugin((nuxtApp) => {
  // 计算 dsn，线上环境会区分语言和设备，测试环境不区分语言和设备
  let dsn = ''
  const config: SentryConfig = getSentryConfig(useRuntimeConfig().public.ENV)
  if (config.dsn) {
    dsn = config.dsn
  } else {
    const mobile = isMobile(navigator.userAgent)
    const locale = useLocale(window.location.host)
    const dsnKey = `${locale}_${mobile ? 'mobile' : 'pc'}`
    if (config && 'dsnMap' in config && dsnKey in config.dsnMap) {
      dsn = config.dsnMap[dsnKey]
    }
  }

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1, // 采样率, 正式域 0.2(20%), 测试域 1.0（100%),
    release: config.version,
    environment: 'production',
  })
})
