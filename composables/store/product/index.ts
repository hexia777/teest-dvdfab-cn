interface State {
  currency: {
    en: ['USD', '$']
    de: ['EUR', '€']
    fr: ['EUR', '€']
    zh: ['USD', '$']
    ja: ['JPY', '￥']
  }
  currentPid: string
  proInfo: any
  defualtPay: {
    subcribe: string
    non_subcribe: string
  }
  payObj: object
}

export const product = defineStore('product', {
  state: () => {
    return {
      currency: {
        en: ['USD', '$'],
        de: ['EUR', '€'],
        fr: ['EUR', '€'],
        zh: ['USD', '$'],
        ja: ['JPY', '￥'],
      },
      proInfo: {}, // 附加产品
      currentPid: '', // 当前产品页的pid
      defualtPay: {
        subcribe: 'stripe_fabtech_sub',
        non_subcribe: 'stripe_fabtech',
      },
      payObj: {
        pay: 'stripe_fabtech',
        platform: 'default_store',
      },
    } as State
  },
  actions: {
    setCurrentPid(pid: string) {
      // 设置当前产品页的pid
      this.currentPid = pid
    },
    setDefaultPay(defaultPay: any) {
      this.defualtPay = {
        ...this.defualtPay,
        ...defaultPay,
      }
    },
    setPay(pay: object) {
      if (pay) {
        this.payObj = pay
      }
    },
  },
})
