import { Base64 } from 'js-base64'
import { product } from './store/product'
// export const usePayDataRequest = (params: any) => useApi().apiProducts.getPayData(params, { key: 'payData' })
// export const useCountryRequest = (params: any) => useApi().apiCommon.getCountry(params, { key: 'country' })

// 公共数据
export const useCheckoutCommon = () => {
  const randomNum = ref(Number(useRoute().query?.randomNum) || Math.random() * 100)
  const locales = useI18n().value
  const locale = useStore.common().locale
  const currency = useStore.product().currency[locale]
  // 当前汇率
  const curCy = currency[0]
  const route = useRoute()
  const COUNTRY_CODE = ['US', 'JP', 'DE', 'FR', 'GB', 'AU', 'CA']
  const ip = route.query.ip || useStore.common()?.ip || ''
  // 获取默认支付方式
  const defaultPay = computed(() => {
    return useStore.product()?.defualtPay as any
  })
  // useCountryRequest({ ip })

  // 获取所有可用通道(区分: 订阅 | 非订阅)
  const getPayMethods = (
    params = {
      orderType: 'non_subcribe',
      list: [],
      lang: '',
      country_code: '',
      first_pay: '',
    },
  ) => {
    let data: object[] = []

    if (!params?.list.length || !params.country_code) {
      return data
    }
    const { orderType, list, first_pay, lang, country_code } = params || {}

    const countryCode = COUNTRY_CODE.includes(country_code) ? country_code : 'OTHER_COUNTRY'
    if (list?.length && list[0]?.first_pay) {
      // 过滤出所有的二抛通道
      data = filterPay2nd(list, first_pay, countryCode)
    } else {
      // 过滤出所有的一抛通道(区分:  订阅 | 非订阅)
      data = filterPay1st(orderType, list, lang, countryCode)
    }
    return data
  }

  // 过滤出所有的二抛通道(不区分:  订阅、非订阅)
  const filterPay2nd = (list: any[], first_pay = '', country_code = '') => {
    const data = []
    // 二抛
    for (const item of list) {
      // 订阅 | 非订阅
      if (
        item &&
        item.second_pay_method === 2 &&
        item.first_pay === first_pay &&
        item.country_code.includes(country_code)
      ) {
        data.push(item)
      }
    }
    return data
  }

  // 过滤出所有的一抛通道(区分:  订阅 | 非订阅)
  const filterPay1st = (orderType = 'non_subcribe', list: any[], lang = '', country_code = '') => {
    // console.log('filterPay1st===', orderType, list, lang, country_code, first_pay, pid_array)

    const data = []
    for (const item of list) {
      // orderType 区分非订阅 | 订阅
      if (
        item &&
        item.order_type === orderType &&
        item.langs.includes(lang) &&
        item.country_code.includes(country_code)
      ) {
        data.push(item)
      }
    }
    return data
  }

  interface getPayMethodParams {
    randomNum: number
    filterPayList: any[]
    orderType: string
    countryCode: string
    card: string
    cy: string
    // 订阅产品
    productList?: any[]
    // LFT 产品列表
    orderList?: any[]
    // 推荐产品
    recomList?: any[]
  }
  // 获取最终支付通道
  const getPayMethod = (
    params = {
      randomNum: 0,
      filterPayList: [],
      orderType: 'non_subcribe',
      countryCode: '',
      card: '',
      cy: '',
      productList: [],
      orderList: [],
      recomList: [],
    } as getPayMethodParams,
  ) => {
    // 默认支付方式初始化
    const defPay = defaultPay.value[params.orderType]
    let curPayObj = { pay: defPay, platform: 'default_init' }

    // 链接自带支付通道
    if (route?.params?.pay) {
      const urlPay = route?.params?.pay || ''
      // 拦截已停用支付通道
      const pay = interceptStopPay(urlPay as string, '链接自带支付通道')
      curPayObj = { pay, platform: 'link_20240112' }

      useStore.product().setPay(curPayObj)
      return curPayObj
    }

    let country_code = params.countryCode
    country_code = COUNTRY_CODE.includes(country_code) ? country_code : 'OTHER_COUNTRY'
    let card = ''
    if (params.orderType === 'non_subcribe') {
      card = params.card
    }
    // 优惠券系统 已启用 & 满足条件（country_code、order_type（非订阅）、langs（域名）） 的通道
    const usablePayList = params.filterPayList
    // console.log('params.filterPayList', params.filterPayList)

    // 最终产品 pid
    const pids = []
    // 处理主产品 pid checkout 页面
    if (params.orderType === 'non_subcribe') {
      for (const key in params.orderList) {
        if (params.orderList[key].pid && params.orderList[key].selected) {
          pids.push(params.orderList[key].pid)
        }
      }
    } else if (params.orderType === 'subcribe') {
      // 弹窗订阅
      if (product?.pid) {
        pids.push(product.pid)
      } else {
        pids.push(useStore.product().currentPid)
      }
    }

    // 处理推荐产品 pid
    const recomPids: any[] = []
    for (const key in params.recomList) {
      const item = params.recomList[key]

      // 显示 & 选中 的产品
      if (item && item.status) {
        if (item?.list?.length) {
          for (const info of item.list) {
            if (info.selected && !recomPids.includes(key)) {
              recomPids.push(key)
            }
          }
        } else if (item.selected) {
          recomPids.push(key)
        }
      }
    }

    // 未匹配到后台配置的支付通，走默认支付通道
    if (!usablePayList || !usablePayList.length || (!card && params.orderType === 'non_subcribe')) {
      curPayObj = { pay: defPay, platform: 'default_no_macth' }

      // eslint-disable-next-line no-console
      console.log(
        '最终支付通道1：',
        params.randomNum,
        country_code,
        curPayObj.pay,
        params.cy,
        card,
        curPayObj,
      )

      useStore.product().setPay(curPayObj)
      return curPayObj
    }

    // 二抛
    if (usablePayList?.length && usablePayList[0]?.first_pay) {
      for (const item of usablePayList) {
        if (item.card.includes(card) && item.currency.includes(params.cy)) {
          const pay = item.second_pay
          item.pay = pay
          curPayObj = item || { pay: defPay, platform: 'default_2nd' }
        }
      }
    } else {
      // 一抛
      const data = []
      let dataOrign: any[] = []
      let maxPercentage = 100
      for (const item of usablePayList) {
        // 根据用户在checkout页面选择的 卡种、币种 过滤数据
        if (
          params.orderType === 'non_subcribe' &&
          item.card.includes(card) &&
          item.currency.includes(params.cy)
        ) {
          dataOrign.push(item)
        } else if (params.orderType === 'subcribe' && item.currency.includes(curCy)) {
          // 订阅没有修改汇率的入口，所以拿默认汇率
          dataOrign.push(item)
        }
      }
      // console.log('卡种、币种 过滤数据 dataOrign', JSON.parse(JSON.stringify(dataOrign)))

      // 按产品线过滤支付通道
      dataOrign = getProductLinesData(dataOrign, params.productList)

      // console.log(
      //   '产品线',
      //   getProLinesByProList(params.productList),
      //   '产品线过滤后 dataOrign',
      //   JSON.parse(JSON.stringify(dataOrign)),
      // )

      // 设置分配比例
      for (const item of dataOrign) {
        item.max = maxPercentage
        maxPercentage -= item.percentage
        item.min = maxPercentage
        // console.log(`max:${item.max} - min:${item.min}} - data:${JSON.stringify(item)}`)

        data.push(item)
      }
      // console.log('分配比例过滤后 data', JSON.parse(JSON.stringify(data)))
      // 根据后台配置设置支付通道
      if (data.length === 1) {
        curPayObj = data[0]
      } else {
        const num = params.randomNum || Math.random() * 100
        params.randomNum = num
        for (const item of data) {
          if (num > item.min && num <= item.max) {
            curPayObj = item
          }
        }
      }

      // console.log('分配比例过滤后 curPayObj', JSON.parse(JSON.stringify(curPayObj)))
      // 未匹配到后台配置的支付通，走默认支付通道
      if (!curPayObj?.pay) {
        curPayObj = { pay: defPay, platform: 'default_finally' }
      }

      // 拦截已停用支付通道
      curPayObj = { pay: interceptStopPay(curPayObj.pay, '最终支付通道2'), platform: 'intercept_finally' }

      // eslint-disable-next-line no-console
      console.log(
        '最终支付通道2：',
        params.randomNum,
        country_code,
        curPayObj.pay,
        params.cy,
        card,
        curPayObj,
      )

      useStore.product().setPay(curPayObj)
      return curPayObj
    }
  }

  // 拦截已停用支付通道
  const interceptStopPay = (pay: string, position: string) => {
    // 已停用通道
    if (['stripe', 'stripe_sub'].includes(pay)) {
      // 非订阅通道 non_subcribe
      let payDefault = defaultPay.value.non_subcribe
      // 订阅通道
      if (pay.endsWith('_sub')) {
        payDefault = defaultPay.value.subcribe
      }

      if (position) {
        // eslint-disable-next-line no-console
        console.log(`已停用支付通道拦截 ${position}:`, `${pay} 已停用, 替换为默认通道 ${payDefault}`)
      }

      return payDefault
    }

    return pay
  }
  // 按产品线区分支付通道
  const getProductLinesData = (data: any[], productList: any[]) => {
    // 获取产品线
    const pid_product_lines = getProLinesByProList(productList)

    // 处理 bundles 产品
    // const onedimensionalPids = getOnedimensionalPids(that, pid_array)
    let dataList = data
    const pay_list = [] // 没有配置产品线的规则
    const product_line_pay_list = [] // 配置了产品线的规则
    let mix_product_lines: any[] = [] // 前端产品线和后端返回的产品线的交集
    const mix_product_pids = [] // 前端pids和后端返回的过滤pids的交集
    // 按产品线过滤出来支付通道=
    for (const pay_info of data) {
      // product_lines的交集
      pid_product_lines.forEach((item) => {
        if (pay_info.product_line.includes(item)) {
          mix_product_lines.push(item)
        }
      })
      // bundles 产品判断
      // onedimensionalPids.filter((item) => {
      //   // pass_product 排除产品
      //   if (pay_info.pass_product.includes(item)) {
      //     mix_product_pids.push(item)
      //   }
      // })
      // 没有配置产品线的规则
      if (pay_info.product_line.length === 0) {
        pay_list.push(pay_info)
      } else if (
        mix_product_lines.length &&
        containsAll(mix_product_lines, pay_info.product_line, { type: 'toString' })
      ) {
        // 获取当前产品所属产品线 和 后台支付通道所属产品线的交集
        product_line_pay_list.push(pay_info)
      } else {
        // 如果没有交集 ，即 没有符合条件的支付通道规则
        continue
      }
    }

    mix_product_lines = [...new Set(mix_product_lines)]
    // 配置了产品线的规则要优先于没有配置产品线的规则,当配置了产品线的规则 则返回产品线的规则
    if (product_line_pay_list.length === 0) {
      dataList = pay_list
    } else if (mix_product_lines.includes('musicfab') && product_line_pay_list.length) {
      // 只要包含 musicfab 产品就走 musicfab 通道
      const musicfabPay = product_line_pay_list.filter((item) => {
        return item.product_line.includes('musicfab')
      })
      dataList = musicfabPay || []
    } else {
      // 当配置了产品线的时候 才会处理冲突
      dataList = product_line_pay_list
      if ((mix_product_lines.length > 1 && product_line_pay_list.length > 1) || mix_product_pids.length > 0) {
        // 当配置了几条产品线的时候 走前端默认支付通道 或者 当前pid包含排除pid的时候
        dataList = []
      }
    }

    return dataList
  }

  const getProLinesByProList = (productList: any[]) => {
    const result = productList.map((item) => (item.productLine ? item.productLine : 'other'))

    return result
  }

  const containsAll = (baseArr: any[], compareArr: any[], params = {}) => {
    const set = new Set(baseArr)

    return compareArr.every((item) => {
      if (params?.type === 'toString') {
        return set.has(String(item))
      } else {
        return set.has(Number(item))
      }
    })
  }
  // 拼接参数
  const createUrlParams = (data: { [key: string]: string }) => {
    let params = ''
    for (const k in data) {
      params += `&${k}=${data[k]}`
    }
    params = params.replace('&', '')

    return params
  }
  // 获取跨站支付需要携带的elk参数
  const getCrossDomainElkParams = (email: string) => {
    // 测试域 || 本地（不能获取 elk 参数【带有 EA 的参数】，如 _T_EA_SID、_EA_SID）
    const prefix =
      window.location.host.includes('localhost') || window.location.host.includes('test') ? '_T' : ''
    // _e_ref_source 参数, 用于 elk 判断用户身份
    const eRefSourceObj: { [key: string]: string } = {
      // 取不到的，传递空或者不传
      s_id: useCookie(prefix + '_EA_SID').value || '', // elk session_id
      token_id: useCookie(prefix + '_EA_TID').value || '', // elk token_id
      ref_domain: window.location.host || '',
      email: email || '',
    }
    // 处理 elk 判断用户身份
    return `&_e_ref_source=${Base64.encode(createUrlParams(eRefSourceObj))}` // TOTO 全局 Base64 方法做兼容
  }

  return {
    randomNum,
    locale,
    locales,
    currency,
    curCy,
    route,
    COUNTRY_CODE,
    ip,
    defaultPay,
    getPayMethods,
    getPayMethod,
    getCrossDomainElkParams,
  }
}
