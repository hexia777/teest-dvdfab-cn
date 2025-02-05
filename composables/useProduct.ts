import type { ProductDiffPriceParams, ProductDiffPriceModal } from '~/apis/interface/products'
import type { ProductsAttrsModel } from '~/apis/interface/product'
import { freeProductRoutes } from '~/config/route/productRoutes'
import { routes as productSpecialRoutes } from '~/config/route/productSpecialRoutes'

export const useProductPageRequest = (route: any) => {
  const locale = useStore.common().locale
  const proKeys = [
    'media',
    'downloadUrl',
    'amazon',
    'coupon',
    'services_products',
    'services_product_rels',
    'products',
    'products.product_attrs',
    'products.price',
    'product_rels',
    'related_products',
    'related_products.*',
    'related_product_rels',
    'upgrade_products',
    'product_attrs',
    'product_attrs.media',
    'product_attrs.tags',
    'redirect_products',
    'redirect_products*',
    'imgs',
    'price',
    'client_info',
    'client_info.systemRequirement',
  ]
  const relatedProKeys = [
    'related_products.downloadUrl',
    'related_products.products',
    'related_products.amazon',
    'related_products.media',
    'related_products.imgs',
    'related_products.price',
    'related_products.coupon',
    'related_products.client_info',
    'related_products.client_info.systemRequirement',
    'related_products.product_attrs',
    'related_products.product_attrs.media',
    'related_products.product_attrs.tags',
    'related_products.redirect_products.downloadUrl',
    'related_products.redirect_products.products',
    'related_products.redirect_products.amazon',
    'related_products.redirect_products.media',
    'related_products.redirect_products.imgs',
    'related_products.redirect_products.price',
    'related_products.redirect_products.coupon',
    'related_products.redirect_products.client_info',
    'related_products.redirect_products.client_info.systemRequirement',
    'redirect_products.downloadUrl',
    'redirect_products.products',
    'redirect_products.amazon',
    'redirect_products.media',
    'redirect_products.imgs',
    'redirect_products.price',
    'redirect_products.coupon',
    'redirect_products.client_info',
    'redirect_products.client_info.systemRequirement',
  ]
  const blockKeys = [
    'media',
    'diffMedia',
    'items',
    'items.media',
    'items.items',
    'blockClass',
    'cardDataImg',
    'statusPage',
    'leftData',
    'rightData',
    'videoInfo',
    'items.avatar',
    'manualData',
    'descSub',
    'new',
    'upgrade',
    'complement',
    'titles',
    'listHead',
    'link',
    'productsPrice',
    'paidText',
    'navs',
    'dvdfabDesc',
    'streamfabDesc',
    'unifabDesc',
    'softwares',
    'softwares.media',
    'softwares.product.price',
    'items.products',
    'items.products.price',
    'items.products.product_attrs',
    'items.products.coupon',
    'items.product.price',
    'items.product.coupon',
    'items.product.imgs',
    'items.product.product_attrs',
    'items.product.related_products.price',
    'items.product.related_products.coupon',
    'items.product.related_products.imgs',
    'products.imgs',
    'products.price',
    'products.related_products.imgs',
    'products.related_products.price',
    'products.downloadUrl',
    'items.items.product',
    'items.items.product.downloadUrl',
    'items.items.product.price',
    'items.items.product.coupon',
    'items.items.product.related_products.price',
    'items.items.product.related_products.coupon',
    'items.items.product.related_products.imgs',
    'items.items.product.related_products.downloadUrl',
    'btnList.info',
  ]
  let routeName = route.name || '' // 当前路由名
  // 特殊产品路由, 转换为原始路由名
  for (const route in productSpecialRoutes) {
    for (const lang in productSpecialRoutes[route]) {
      if (productSpecialRoutes[route][lang] === routeName) {
        routeName = route
      }
    }
  }

  const getPageData = async () => {
    const { data: productRes, error } = await useApi().apiProducts.pageProducts(
      {
        'filters[slug][$eq]': routeName.replace(/_/g, '-'),
        'populate[product][populate]': proKeys.join(',') + ',' + relatedProKeys.join(','),
        'populate[blocks][populate]': blockKeys.join(','),
        locale,
      },
      { key: 'page-data' },
    )
    if (error.value) {
      throw createError({ statusCode: 500, statusMessage: 'Server Error' })
    }
    if (productRes.value?.data?.length) {
      for (const item of productRes.value.data) {
        const data1 = getStrapiData(item)
        if (data1 && data1.product) {
          const data2 = getStrapiData(data1.product)
          if (data2 && data2.productLine) {
            productRes.value.product_line = data2.productLine
          }
        }
      }
    }
  }
  return {
    getPageData,
  }
}

export const useProductPage = () => {
  /**
   * @function formatProductData
   * @description 格式化产品信息
   * @returns {Object} products
   * @param product
   */

  const formatProductData = (product: ProductModel | undefined) => {
    const result = {} as { [k: string]: any }
    if (!product) {
      return {}
    }

    result.win = product

    if (getStrapiData(product.attributes?.related_product)?.system === 'mac') {
      result.mac = product.attributes.related_product.data
    }

    return result
  }

  // 根据系统获取产品
  const getProductByOs = (product: ProductsAttrsModel | undefined) => {
    const os = useStore.common().client
    const data = formatProductData(product)

    return getStrapiData(data[os] || data.win)
  }
  const state = reactive<{
    blockData: { win: any; mac: any }
    seoData: {
      win: null
      mac: null
    }
    product: ProductsAttrsModel[]
    articleInfoLevel: string
    isShowBuyDialog: boolean
  }>({
    blockData: {
      win: null,
      mac: null,
    },
    seoData: {
      win: null,
      mac: null,
    },
    product: [] as any,
    articleInfoLevel: '',
    isShowBuyDialog: false,
  })
  const { data: productRes } = useNuxtData('page-data')
  if (productRes.value?.data?.length) {
    productRes.value.data.forEach((item: any) => {
      const data = getStrapiData(item)
      state.articleInfoLevel = data?.articleInfoLevel || ''
      // 设置页面类型
      !useStore.common().pageType && data?.urlType && useStore.common().setPageType(data.urlType)
      const system = data?.system || 'win'
      for (const key in state.blockData) {
        if (system === key) {
          state.blockData[key as 'win' | 'mac'] = formatBlocksData(data?.blocks)
        }
      }
      for (const key in state.seoData) {
        if (system === key) {
          const seo = data?.seo || {}
          state.seoData[key as 'win' | 'mac'] = { title: data?.title, ...seo }
        }
      }
    })
    state.product = productRes.value.data
      .map((item: any) => getProductByOs(getStrapiData(item)?.product?.data))
      .filter((item: any) => item)
    const product: any = state.product && state.product.length ? state.product[0] : {}
    const canOpenBuyDlg = product.system !== 'android' && product.type !== 'aio'
    state.isShowBuyDialog = ![...freeProductRoutes].includes(useRoute().name as string) && canOpenBuyDlg
  }

  const boxImage = computed(() => {
    // product?.[0]?.client_info?.data?.attributes?.systemRequirement || []
    const targetImg: any = state.product[0]?.imgs?.find((item: any) => item.label === 'basic')
    const name = state.product[0]?.name ?? ''
    return {
      url: targetImg?.url ?? '',
      width: 500,
      height: 500,
      alt: name,
    }
  })

  // 关联产品
  const relatedProduct = computed(() => {
    const related = useBlocksDataByOs(state.blockData)?.find(
      (v: any) => v.__component === 'sale.buy-download',
    )
    const leftRightProduct = useBlocksDataByOs(state.blockData)?.find(
      (v: any) => v.__component === 'compare.left-right-product',
    )
    if (related) {
      return getProductByOs(related?.product?.data)
    } else if (leftRightProduct) {
      return getProductByOs(leftRightProduct?.l_product?.data)
    }
  })

  const rightRelatedProduct = computed(() => {
    const leftRightProduct = useBlocksDataByOs(state.blockData)?.find(
      (v: any) => v.__component === 'compare.left-right-product',
    )
    if (leftRightProduct) {
      return getStrapiData(leftRightProduct?.r_product)
    }
  })

  const getBlockMacData = (__component: string) => {
    const macData = state.blockData.mac || null
    if (!macData) {
      return null
    }
    const macRes = macData.find((md: any) => md.__component === __component)
    return macRes
  }

  // 获取 streamfab 用户身份
  const getStreamFabUserType = (userTags: any, route: any) => {
    const params: any = {}
    if (userTags && Object.keys(userTags).length) {
      // 是否有streamfab win的购买记录
      const isFirstUser = !userTags.streamfab_win_bool_buy
      // 是否有streamfab mac的购买记录
      const isMacFirstUser = !userTags.streamfab_mac_bool_buy
      // 是否win的streamfab aio用户
      const isAioUser = userTags.streamfab_win_bool_buy_aio
      // 是否mac的streamfab aio用户
      const isMacAioUser = userTags.streamfab_mac_bool_buy_aio

      const winUserType = isFirstUser ? 1 : isAioUser ? 3 : 2
      const macUserType = isMacFirstUser ? 1 : isMacAioUser ? 3 : 2
      if ((winUserType || macUserType) && !route.fullPath.includes('ext_params_')) {
        if (winUserType === 1 || macUserType === 1) {
          params.ext_params_str_param1 = 'try'
        }
        if (winUserType === 2 || macUserType === 2) {
          params.ext_params_str_param1 = 'paid'
        }
        if (winUserType === 3 || macUserType === 3) {
          params.ext_params_str_param1 = 'aio'
        }
      }
    }
    return params
  }

  return {
    ...toRefs(state),
    freeProductRoutes,
    boxImage,
    relatedProduct,
    rightRelatedProduct,
    getBlockMacData,
    getStreamFabUserType,
  }
}

// 获取差异化价格
export const useProductDiffPrice = () => {
  const locale = useStore.common().locale
  const isMobile = useStore.common().mobile
  const currency = useStore.product().currency[locale]
  const getCurrentEmail = () => {
    return useEmail()
  }
  const userTypeMapKey: any = {
    dvdfab: {
      upgrade_user: 'upgrade',
      complete_user: 'complement',
      is_new_user: 'new',
      is_newest_aio_user: 'new',
    },
    streamfab: {
      new: 'new',
      aio_all: 'new',
      sub: 'new',
      single_upgrade: 'upgrade',
      mycombo_upgrade: 'upgrade',
      aio_upgrade: 'complement',
    },
    musicfab: {
      is_new_user: 'new',
    },
    recordfab: {
      is_new_user: 'new',
    },
    playerfab: {
      is_new_user: 'new',
    },
    bookfab: {
      is_new_user: 'new',
    },
    media_recover: {
      is_new_user: 'new',
    },
    passkey: {
      upgrade_user: 'upgrade',
      complete_user: 'complement',
      is_new_user: 'new',
      is_newest_aio_user: 'new',
    },
  }
  const loadDiffPrice = (
    os: string,
    operation_keys: Array<string | number>,
    email: string,
    appid: string,
  ) => {
    const params: ProductDiffPriceParams = {
      user_info: {
        token_id: useCookie('_EA_TID').value || '',
        machine_id: useCookie('elk_mac').value || '',
        email,
      },
      env: {
        platform: isMobile ? 'mobile' : 'desktop',
        source: 'web',
        domain: '',
        os,
        app_id: appid,
        currency: currency[0],
        return_options: true,
      },
      debug_user_info: true,
      operation_keys,
    }
    return useApi().apiProducts.productDiffPrice(params)
  }
  // 通过 option 获取指定价格
  const getPriceByOpt = (proInfo: any, opt = 'LFT') => {
    const priceItem = proInfo.price?.find((pr: any) => pr.key === opt)
    return priceItem && priceItem.value
  }
  /**
   * 获取最低价
   *** 默认逻辑:
   * streamfab 订阅 1M, 最低价: min(LFT 折扣价 | 1M)
   * 其他产品线 订阅 1Y, 最低价: min(LFT 折扣价 | 1Y)
   * @param proInfo 产品信息,
   * unit: 默认'': 返回带币种价格, hidden: 返回纯数字;
   * getOpt: 默认 false: 不返回对应 opt, true: 返回对应 opt {value: 100 | $100, key: 'LFT'}
   * @return 格式化后的价格
   * */
  const getLowestPrice = (
    proInfo: any,
    params: { unit?: string; getOpt?: boolean } = { unit: '', getOpt: false },
  ) => {
    const { unit, getOpt } = params
    const { productLine: proLine, price: priceInfo, coupon: couponInfo } = proInfo || {}

    // 折扣率
    let couponRate = 1
    if (couponInfo?.length && couponInfo[0]) {
      couponRate = couponInfo[0]?.value
    }
    // LFT 原价
    const LFTOldPrice = priceInfo.find((item: any) => item?.key === 'LFT')?.value
    // LFT 折后价
    const LFTPrice = LFTOldPrice * couponRate
    // 默认逻辑
    let priceInfoResult
    // todo需要讨论出结果:是否需要strapi统一方案
    if (['streamfab', 'media_recover'].includes(proLine) && ![749].includes(+proInfo.pid)) {
      priceInfoResult = getPriceInfo({ key: '1M', priceInfo, LFTPrice, unit, getOpt })
    } else {
      priceInfoResult = getPriceInfo({ key: '1Y', priceInfo, LFTPrice, unit, getOpt })
    }

    if (priceInfoResult) {
      return priceInfoResult
    }

    const price = unit === 'hidden' ? LFTPrice : translatePrice(LFTPrice, currency[1], locale)

    if (getOpt) {
      return { value: price, key: 'LFT' }
    }
    return price
  }
  /**
   * LFT 折后价格比较 | 返回数据格式化
   * @param proInfo 产品信息,
   * unit: 默认'': 返回带币种价格, hidden: 返回纯数字;
   * getOpt: 默认 false: 不返回对应 opt, true: 返回对应 opt {value: 100 | $100, key: 'LFT'}
   * @return 格式化后的价格
   * */
  const getPriceInfo = ({
    key,
    priceInfo,
    LFTPrice,
    unit,
    getOpt,
  }: {
    key: string
    priceInfo: any[]
    LFTPrice: number
    unit?: string
    getOpt?: boolean
  }) => {
    const priceInfoItem = priceInfo.find((item: any) => item?.key === key)

    if (priceInfoItem && priceInfoItem.value < LFTPrice) {
      const price =
        unit === 'hidden' ? priceInfoItem.value : translatePrice(priceInfoItem.value, currency[1], locale)

      if (getOpt) {
        return { value: price, key }
      }

      return price
    }
  }
  const roundDecimal = (num: number, decimalPlaces: number) => {
    const multiplier = Math.pow(10, decimalPlaces)
    return Math.round(num * multiplier) / multiplier
  }
  // 获取默认折扣
  const getDefaultPriceInfo = (proInfo: any, opt = 'LFT') => {
    const couponInfo = opt === 'LFT' && proInfo.coupon?.length ? proInfo.coupon[0] : null
    const originPrice = +getPriceByOpt(proInfo, opt)
    let paymentPrice = originPrice
    if (couponInfo) {
      const rate = couponInfo?.value || 1
      paymentPrice = +(originPrice - originPrice * (1 - rate))
    }
    return {
      code: couponInfo?.key || '',
      currency: currency[0],
      discount_rate: couponInfo?.value || 1,
      discount_type: 'coupon',
      discount_verify: couponInfo?.key || '',
      off_num: couponInfo?.text || 0,
      origin_price: originPrice,
      payment_price: roundDecimal(+paymentPrice, 2),
    } as ProductDiffPriceModal
  }

  // 获取上报的拓展参数
  const getUpgradeExtParams = (_priceData: any, _proData: any, proLine: string, module: string) => {
    const options = _priceData.options || {}

    const ext5Map: any = {
      upgrade_user: 'single_upgrade',
      complete_user: 'aio_upgrade',
      is_new_user: 'new',
      is_newest_aio_user: 'aio_all',
    }
    const extParams5 = _priceData.user_tag_type
      ? ext5Map[_priceData.user_tag_type] || _priceData.user_tag_type
      : 'new'

    let elkParams: any = {}
    if (extParams5 === 'new') {
      const totalIsFull = options.total_options_num === options.has_online_lft_options_num
      elkParams = {
        et_pa: 1,
        ext_params_str_param1: proLine,
        ext_params_str_param4: _proData.system,
        ext_params_str_param5: totalIsFull ? 'all' : 'new',
        ext_params_str_param6: _proData.name,
        ext_params_str_param7: _proData.pid,
        ext_params_str_param8: 'v3',
      }
    } else {
      elkParams = {
        et_pa: 1,
        upgrade: 1,
        // 用户拥有的在售的产品数量（LFT+订阅）
        ext_params_num_param1: options.has_online_options_num,
        // 升级的价格
        ext_params_num_param2: _priceData?.price?.payment_price || 0,
        // 用户拥有的已下线的产品数量（LFT+订阅）
        ext_params_num_param3: options.has_options_num - options.has_online_options_num,
        // 拥有已下线和还在售卖的产品总数  param1+param3
        ext_params_num_param4: options.has_options_num,
        // 用户拥有的在售&已下线的产品数量（LFT）
        ext_params_num_param5: options.has_lft_options_num,
        // 用户拥有的在售&已下线的产品数量（非LFT，排除同option拥有LFT的）
        ext_params_num_param6: options.has_options_num - options.has_lft_options_num,
        // 用户拥有的在售的产品数量（LFT）
        ext_params_num_param7: proLine === 'streamfab' ? options.has_online_lft_options_num : '',
        // 当前最全的option数量
        ext_params_num_param8: proLine === 'streamfab' ? options.total_options_num : '',
        // 用户缺少的在售LFT-option数量
        ext_params_num_param9:
          proLine === 'streamfab' ? options.total_options_num - options.has_online_lft_options_num : '',
        // 产品线，小写 streamfab|dvdfab|passkey|unifab|musicfab
        ext_params_str_param1: proLine,
        // 固定值
        ext_params_str_param2: 'upgrade_price',
        // 代表从哪个模块升级的
        ext_params_str_param3: module,
        // 产品系统
        ext_params_str_param4: _proData.system,
        // 产品身份，不同的产品线值不一样 aio_upgrade | mycombo_upgrade | single_upgrade | sub | aio_all | new
        ext_params_str_param5: extParams5,
        // 产品名统一传英语，因为有空格，建议编码。
        ext_params_str_param6: _proData.name,
        // 产品pid
        ext_params_str_param7: _proData.pid,
        // 版本
        ext_params_str_param8: 'v3',
      }
      if (proLine === 'streamfab') {
        // 是否拥有 youtube 产品
        const lft_owned = options?.lft_owned && options?.lft_owned?.length ? options?.lft_owned : []
        const ytPids = _proData.system === 'win' ? ['822', '838'] : ['1822', '1838']
        const matchedYtPids = Array.isArray(lft_owned) ? lft_owned.filter((pid) => ytPids.includes(pid)) : []
        const hasYoutube = matchedYtPids.length > 0
        elkParams.ext_params_str_param9 = hasYoutube ? 'A' : 'B'
      }
    }
    return elkParams
  }
  const getElkParams = (event: string, _proData: any, extParams: any, type?: string) => {
    const lsitObj: any = {
      pid: _proData.pid,
    }
    if (_proData.payment_price) {
      lsitObj.price = _proData.payment_price || 0
    }
    return {
      event,
      pids: [_proData.pid],
      products: {
        list_count: 1,
        type: type || 'buy_now',
        list: [lsitObj],
      },
      ...extParams,
    }
  }

  // 购买链接
  const getBuyUrl = (
    _proData: any,
    propsInfo: any,
    priceInfo: ProductDiffPriceModal,
    extParams: any,
    opt: string = 'LFT',
    type: string = '',
  ) => {
    let params: any = {}
    if (propsInfo.gTrackInfo && Object.keys(propsInfo.gTrackInfo).length) {
      params = {
        ...params,
        ...propsInfo.gTrackInfo,
      }
    }
    // 优惠券放到前面方便查看
    if (priceInfo?.discount_type) {
      params[priceInfo.discount_type] = priceInfo.code
    }
    for (const key in extParams) {
      if (!['event_label', 'event_category'].includes(key)) {
        params[key] = extParams[key]
      }
    }
    // diff_sign 过长, 放到最后
    if (priceInfo?.discount_type && priceInfo.discount_type === 'discount') {
      params.diff_sign = encodeURIComponent(decodeURIComponent(priceInfo.discount_verify))
    }
    const urlSufix = urlParamsToString(params)
    return getCheckoutUrl(_proData.pid, opt, urlSufix ? '&' + urlSufix : '', { type })
  }

  const getAmazonCouponValue = (_proInfo: any) => {
    let amazonCp = _proInfo.amazon.find((item: any) => item.key === currency[0])
    amazonCp = amazonCp || _proInfo.amazon.find((item: any) => item.key === 'USD')
    if (amazonCp) {
      const text = translatePrice(amazonCp.value, currency[1], locale) as string
      return text.replace(/(\.00)|(,00)/g, '')
    }
    return ''
  }

  // 获取产品名
  const getChildProName = (_proInfo: any, pid: string | number, isShort = false) => {
    const products = _proInfo.products.data
    if (products) {
      const product = products.find((pro: any) => pro.attributes.pid === +pid)
      const nameKey = isShort ? 'name' : 'shortName'
      return product ? product.attributes[nameKey] : ''
    }
    return ''
  }

  // 匹配升级价格
  const getUpgradePriceInfo = (_curProInfo: any, proDiffPrice: any, defaultUserType?: string) => {
    let priceInfo = null
    if (
      proDiffPrice &&
      _curProInfo.pid in proDiffPrice &&
      Object.keys(proDiffPrice[_curProInfo.pid]).length
    ) {
      priceInfo = proDiffPrice[_curProInfo.pid]
    }
    // 支持购买弹窗中的位置信息
    for (const key in proDiffPrice) {
      if (proDiffPrice[key].pid === _curProInfo.pid) {
        priceInfo = proDiffPrice[key]
      }
    }
    // 如果 priceInfo 有值，且不包含 user_tag_type key, 说明是未购买任何产品的原价状态，需要补充
    if (priceInfo && !Object.keys(priceInfo).includes('user_tag_type')) {
      priceInfo.price = { ...getDefaultPriceInfo(_curProInfo), ...priceInfo.price }
      priceInfo.user_tag_type = defaultUserType || 'is_new_user'
    }
    if (!priceInfo) {
      priceInfo = {
        pid: _curProInfo.pid,
        options: {
          has_lft_options_num: 0,
          has_nlt_options_num: 0,
          has_online_lft_options_num: 0,
          has_online_nlt_options_num: 0,
          has_online_options_num: 0,
          has_options_num: 0,
          total_options_num: _curProInfo.products.data.length,
        },
        user_tag_type: defaultUserType || 'is_new_user',
        price: getDefaultPriceInfo(_curProInfo),
      }
    }
    return priceInfo
  }

  return {
    userTypeMapKey,
    getCurrentEmail,
    loadDiffPrice,
    getDefaultPriceInfo,
    getPriceByOpt,
    getLowestPrice,
    getUpgradeExtParams,
    getElkParams,
    getBuyUrl,
    getAmazonCouponValue,
    getChildProName,
    getUpgradePriceInfo,
  }
}
