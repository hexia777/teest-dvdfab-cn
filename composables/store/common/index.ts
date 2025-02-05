interface State {
  locales: string[]
  locale: 'en' | 'de' | 'fr' | 'ja' | 'zh'
  host: string
  locationOrigin: string
  client: 'win' | 'mac'
  is_x64: boolean
  mobile: boolean
  ip: string | undefined
  country: string | undefined
  pageType: string
  userTagsRes: object
  user_info: {
    isInit: boolean
    vip: number
    username: string
    email: string
    uid: string
    token: string
  }
  server_location: string
  backend_host: string
  pageProLine: string
}
export const common = defineStore('common', {
  state: () => {
    return {
      locales: useAppConfig().locales,
      locale: 'en',
      host: '',
      locationOrigin: '',
      client: 'win',
      is_x64: false,
      mobile: false,
      ip: '',
      country: '',
      pageType: '', // 页面类型
      userTagsRes: {}, // 用户画像结果
      user_info: { isInit: true },
      server_location: '',
      backend_host: '', // 传给后端接口的host
      pageProLine: '', // 页面属于哪个产线
    } as State
  },
  actions: {
    setLocale(locale: 'en' | 'de' | 'fr' | 'ja' | 'zh') {
      if (this.locales.includes(locale)) {
        this.locale = locale
      }
    },
    setHost(host: string) {
      this.host = host
    },
    setClient(client: 'win' | 'mac') {
      this.client = client
    },
    setIsX64(isX64: boolean) {
      this.is_x64 = isX64
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setIp(ip: string | undefined) {
      this.ip = ip
    },
    setUserInfo(user_info: State['user_info']) {
      if (!user_info) {
        return
      }
      this.user_info = user_info
    },
    async setCountry() {
      // 设置当前国家
      const params = {
        ip: this.ip,
      }
      const res = await useApi().apiCommon.getCountry(params)
      const resData = res?.data || {}

      if (resData?.value && resData?.value?.cscode === 0) {
        const data = resData?.value?.data || {}
        const { country_code = '' } = data || {}

        this.country = country_code || ''

        return country_code
      }
    },
    setPageType(pageType: string) {
      this.pageType = pageType
    },
    setUserTagsRes(data: object) {
      this.userTagsRes = data
    },
    setServeLocation(location: string) {
      let data = location || ''
      if (!data) {
        if (!process.browser) {
          data = process.env.LOCATION || ''
        } else {
          const el = document.getElementById('__api__')
          if (el) {
            data = el.getAttribute('data-server') || ''
          }
        }
      }
      if (['us', 'fr', 'de', 'ja'].includes(data)) {
        this.backend_host = data
      }
      this.server_location = data
    },
    setPageProLine(data: string) {
      this.pageProLine = data
    },
  },
  getters: {},
})
