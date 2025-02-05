import tracing from '@elk/analytics'
import installJSON from '../config/elk/install.json'

export default defineNuxtPlugin((nuxtApp) => {
  const refererEl = document.getElementById('__ref__')
  const refererUrl = refererEl ? refererEl.getAttribute('data-ref') : ''
  let domain = useAppConfig().servo_report_tbl[useStore.common().locale] || useAppConfig().servo_report_tbl.en
  if (window.location.host.includes('test') || window.location.host.includes(':')) {
    domain = domain.replace('https://', 'https://test-')
  }
  nuxtApp.vueApp.use(tracing, {
    requestUrl: `${domain}/api/web/report`,
    isDev: process.env.NODE_ENV === 'development',
    refererUrl,
    installData: installJSON,
    pv: false,
    domainList: [
      'dvdfab.cn',
      'download.musicfab.org',
      useRuntimeConfig().public.API_OAPI.replace('https://', ''),
      ...Object.values(useAppConfig().web_domain),
    ],
    defaultAppIdData: {
      streamfab: 'streamfab',
      playerfab: 'playerfab',
      musicfab: 'musicfab',
    },
    includeStrengthenUserIdentityDomain: [
      ...Object.values(useAppConfig().web_domain),
      ...useAppConfig().diversion_domain_list,
    ],
    excludeStrengthenUserIdentityUrls: ['/mlink/download.php'],
  })

  nuxtApp.provide('trace', tracing)
})
