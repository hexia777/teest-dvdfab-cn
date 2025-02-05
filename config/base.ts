import type { Config } from './base.d'


// 仅存放公开的配置信息，私密信息不要放这里
export default <Config>{
  locales: ['en', 'ja', 'de', 'fr', 'zh'],
  // 网站域名
  web_domain: {
    en: 'www.dvdfab.cn',
    de: 'dvdfab.at',
    ja: 'dvdfab.org',
    fr: 'dvdfab.fr',
    zh: 'zh.dvdfab.cn',
  },

  // cdn域名
  cdn_domain: 'https://c.dvdfab.cn',
  cdn_domain_subs: [
    'https://c1.dvdfab.cn',
    'https://c2.dvdfab.cn',
    'https://c3.dvdfab.cn',
    'https://c4.dvdfab.cn',
    'https://c5.dvdfab.cn',
    'https://c6.dvdfab.cn',
  ],
  cnd_test_domain: 'https://images1.dvdfab.cn',

  // google ga id
  ga_ids: {
    en: 'UA-2570030-1',
    de: 'UA-2570030-3',
    ja: 'UA-2570030-6',
    fr: 'UA-2570030-4',
    zh: 'UA-2570030-15',
  },

  // web push
  web_push: {
    en: {
      enabled: true,
      appId: '070db304-2364-4cf4-b232-500796275ab5',
      publicKey: 'BKXtmn-w29lytA3-YbbRyv8nyx4V0W4wcLSTXvwZESOertrUbEcWWN0rrcfGFjB3gL3LWbiUyBKwASf1ZDwPStc',
    },
    de: {
      enabled: true,
      appId: '78b1ad25-05f5-4c6c-a7fd-37b583897cc5',
      publicKey: 'BN4hoo7l9DmwRblaQA4fSGa8-t4dL_KoFfz-Mu5-3lkVwHj7DOQCwgZfClqtmykDugBspgJ2VQV-JSpFmB1PzAY',
    },
    fr: {
      enabled: true,
      appId: '2d7c9fc7-0bca-4277-b29d-ad12ca615247',
      publicKey: 'BJTY4fukIsMW1uoc00mZyhIsEP1q0ezoLKGStJUQaHOa7upQFdqSo5jBvGwxSFDg5as_UN8ay7WL0E4M8PtzUas',
    },
    ja: {
      enabled: true,
      appId: '7k12bgau-2pk4-c55o-uuqe-oemkkegu22ct',
      publicKey: 'BB3SVYWhfleWwVEl8T5fI2TmfIG0DYbBmXRssfDLfB-dBt9FXKv4RFi8J8qHPX57y5mgm1wZmG18WSIBk90ObmU',
    },
    zh: {
      enabled: true,
      appId: '79b05850-bdde-4888-a172-e27d2440153e',
      publicKey: 'BD041KbOB2m3AIqilORD_MMq2OTo9wiXq1DENMneFOfpW1L_irI2xuinf5NACfypHgnUjkSi2GYPoUrTk81v7ZY',
    },
  },

  // elk 上报
  servo_report_tbl: {
    de: 'https://servo-report.dvdfab.at',
    en: 'https://servo-report.dvdfab.cn',
    ja: 'https://servo-report.dvdfab.org',
    fr: 'https://servo-report.dvdfab.fr',
    zh: 'https://servo-report.dvdfab.cn',
  },
  // 自有站群强化用户身份识别域名
  diversion_domain_list: [
    'streamfab.com',
    'streamfab.us',
    'streamfab.de',
    'streamfab.jp',
    'streamfab.fr',
    'streamfab.tw',
    'dvdfab.us',
    'ja.dvdfab.us',
    'ja.dvdfab.cn',
    'dvdfabsoft.com',
    'unifab.ai',
    'fr.unifab.ai',
    'de.unifab.ai',
    'zh.unifab.ai',
    'ja.unifab.ai',
  ],

  // 谷歌人机验证site key
  site_key: '6LewemApAAAAADYK2QBW-DuvmbsmBtT44OXyAEy9',

  // 谷歌快捷登录
  client_id: '507523727608-k21t072ed2loddkbs88vb7hu4dsh52sv.apps.googleusercontent.com',

  page_suffix: '.htm',
}
