import type { SentryConfig } from './sentry.d'

const onlineOptions: SentryConfig = {
  org: 'goland', 
  project: 'dvdfab_new_en_pc', 
  dsn: '',
  authToken: '20cbf87d9f6942fd9c1318f9f065afb81b7fbae9d58b4400938212e9d1007da6',
  url: 'https://sentry.dvdfab.cn/',
  version: 'dvdfab_new_online@1.0.0',
  sourceMap: true,
  dsnMap: {
    en_pc: 'https://31dd31f47fe33c2a46b244754fc7bf53@sentry.dvdfab.cn/137',
    en_mobile: 'https://324793cd314b43ca423662cc474f6c9f@sentry.dvdfab.cn/138',
    de_pc: 'https://e488ce2e693207048a053ef5fe5f4c1a@sentry.dvdfab.cn/139',
    de_mobile: 'https://364b2c801dc14132ea77cce6dffeade3@sentry.dvdfab.cn/140',
    fr_pc: 'https://e88f25c69c2fed3fcd44bcf33b27d94a@sentry.dvdfab.cn/141',
    fr_mobile: 'https://04a829fe2549165f5203ea6e1c7bceaa@sentry.dvdfab.cn/142',
    zh_pc: 'https://f6f67994418dd332b55e96c082b6a320@sentry.dvdfab.cn/143',
    zh_mobile: 'https://63d4d08145ae309a7a6d6978077e55d9@sentry.dvdfab.cn/144',
  },
}

const testOptions: SentryConfig = {
  org: 'goland',
  project: 'dvdfab_new_test',
  dsn: 'https://443914df08b42725ff6361de82f09f22@sentry.dvdfab.cn/136',
  authToken: '20cbf87d9f6942fd9c1318f9f065afb81b7fbae9d58b4400938212e9d1007da6',
  url: 'https://sentry.dvdfab.cn/',
  version: 'dvdfab_testenv@1.0.0',
  sourceMap: false,
  dsnMap: {},
}

export const getSentryConfig = (env: string | undefined) : SentryConfig => {
  return env === 'prod' ? onlineOptions : testOptions
}
