import { useBatchFetch } from '@/composables/workers/useBatchWorker'
export const useBuyDialog = (props?: any) => {
  const { $trace } = useNuxtApp() as any
  const {
    getDefaultPriceInfo,
    getBuyUrl,
    getElkParams,
    getCurrentEmail,
    getUpgradeExtParams,
    getAmazonCouponValue,
    userTypeMapKey,
  } = useProductDiffPrice()
  // 订阅弹窗
  const { getPayMethods, getPayMethod } = useCheckoutCommon()
  const { apiWorker } = useApi()
  /** -------------- 基础变量 start ---------- */
  // 用于刷新按钮的上报状态, 达到可以触发 'show' 上报
  const reloadBtnData = reactive({
    reloadOs: {
      win: false,
      mac: false,
    } as any, // 已经重新 reload 过的系统
    value: true, // 已经重新 reload 过的系统
  })
  const state = reactive<{
    defaultPay: any
    dialogData: any
    products: any
    proInfo: any
    macProInfo: any
    dlgTitle: string
    proLine: string
    recomPlanItems: any
    bottomRecomPlanItem: any
    relatedProInfo: any
    safeguardListData: any
    // 支付通道相关
    countryCode: string
    payways: any
    productDiffInfo: any
    osText: string
    userTagsRes: any
    isFristLoad: boolean
  }>({
    defaultPay: {
      subcribe: 'stripe_fabtech_sub',
      non_subcribe: 'stripe_fabtech',
    } as any, // 初始的支付方式
    dialogData: {} as any,
    proInfo: {} as any,
    products: [] as any,
    macProInfo: {} as any,
    dlgTitle: '',
    proLine: '',
    recomPlanItems: [{}, {}, {}] as any,
    bottomRecomPlanItem: {} as any,
    relatedProInfo: {} as any,
    safeguardListData: [] as any,
    countryCode: '-',
    payways: {} as any,
    productDiffInfo: {} as any,
    osText: 'win',
    userTagsRes: {} as any,
    isFristLoad: true,
  })
  // 基础变量和
  const randomNum = ref(Number(useRoute().query?.randomNum) || Math.random() * 100)
  const commonJson = useI18n().value.common
  const locale = useStore.common().locale
  const ip = useStore.common().ip
  const currency = useStore.product().currency[locale]
  const loadingStatus = ref(true)
  const routeName = useRoute().name as string

  /** -------------- 基础变量 end ---------- */

  /** -------------- 配置项变量 start ---------- */
  // 用来判断dvdfab 是否为 old aio，用于上报
  const dvdfabType1 = [700, 701, 806, 810, 826, 1700, 1701, 1806, 1810, 1826]
  // 各产品线的 trackdata 上报参数
  const trackDataKey: any = {
    dvdfab: {
      track_data: {
        key: 'dvdfab_buy_window',
        version: 1,
      },
    },
    streamfab: {
      track_data: {
        key: 'streamfab_buy_window',
        version: 1,
      },
    },
    musicfab: {
      track_data: {
        key: 'muscifab_buy_window',
        version: 1,
      },
    },
    playerfab: {
      track_data: {
        key: 'playerfab_buy_window',
        version: 1,
      },
    },
    passkey: {
      track_data: {
        key: 'passkey_buy_window',
        version: 1,
      },
    },
    bookfab: {
      track_data: {
        key: 'bookfab_buy_window',
        version: 1,
      },
    },
    recordfab: {
      track_data: {
        key: 'recordfab_buy_window',
        version: 1,
      },
    },
    media_recover: {
      track_data: {
        key: 'media_recover_buy_window',
        version: 1,
      },
    },
  }
  // 各方案对应的 eventLabel 参数值，不区分产品线（特殊部分单独配置了）
  const eventLabelMap: any = {
    '1M': 'productpage_subscribe_1month',
    '1Y': 'productpage_subscribe_1year',
    LFT: 'productpage_buy_now_lifetime',
    // aio: 'productpage_popup_bundle',
    // bundle: 'productpage_popup_bundle',
    // other: 'productpage_popup_bundle',
    aio: 'productpage_buy_now_bundle',
    bundle: 'productpage_buy_now_bundle',
    other: 'productpage_buy_now_bundle',
    mycombo: 'productpage_custom_now_combo',
  }

  // 获取产品信息的接口参数
  const proKeys = [
    'media',
    'downloadUrl',
    'amazon',
    'coupon',
    'services_products',
    'services_product_rels',
    'products',
    'product_rels',
    'related_products',
    'related_products.*',
    'related_product_rels',
    'upgrade_products',
    'product_attrs',
    'product_attrs.media',
    'product_attrs.tags',
    'redirect_products',
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
  ]
  // 弹窗关联的产品信息
  // productLine 作为 key
  const relatedProductMap: any = {
    dvdfab: {
      aio: 712,
      bundle: 62121,
    },
    streamfab: {
      aio: 757,
      mycombo: 20051,
      other: 771,
      ultimate: 62021,
    },
    musicfab: {
      aio: 775,
    },
    recordfab: {
      aio: 757,
    },
    playerfab: {
      aio: 760,
      lifetime_774: 774,
      lifetime_1774: 1774,
      bundle: 1728,
    },
    passkey: {
      aio: 742,
    },
    bookfab: {
      aio: 879,
    },
    media_recover: {
      aio: 62037,
    },
  }
  // 获取位置信息数据信息
  const oprationKeyMap: any = {
    dvdfab: {
      win: {
        aio: '712',
        bundle: 'dvdfab_win_multiproduct_popup3',
        bottom: 'dvdfab_win_product_popup4',
        bundle_bottom: 'dvdfab_win_multiproduct_popup4',
      },
      mac: {
        aio: '1712',
        bundle: 'dvdfab_mac_multiproduct_popup3',
        bottom: 'dvdfab_mac_product_popup4',
        bundle_bottom: 'dvdfab_mac_multiproduct_popup4',
      },
    },
    streamfab: {
      win: {
        aio: 'streamfab_win_productpage_buypopup3',
        aio_822: '757',
        other_950: 'streamfab_win_drmm3u8_buypopup3',
        other_953: 'streamfab_win_drmmpd_buypopup3',
        bottom: 'streamfab_win_product_buypopup4',
        mycombo: 'streamfab_win_productpage_buypopup3',
        ultimate: 'streamfab_win_product_buypopup4',
      },
      mac: {
        aio: 'streamfab_mac_productpage_buypopup3',
        aio_822: '1757',
        other_950: 'streamfab_mac_productpage_buypopup3',
        other_953: 'streamfab_mac_productpage_buypopup3',
        bottom: 'streamfab_mac_product_buypopup4',
        mycombo: 'streamfab_mac_productpage_buypopup3',
        ultimate: 'streamfab_mac_product_buypopup4',
      },
    },
    recordfab: {
      win: {
        aio: '757',
      },
      mac: {
        aio: '1757',
      },
    },
    playerfab: {
      win: {
        bundle: '1728',
        other_968: '968',
      },
      mac: {
        bundle: '1728',
        other_968: '968',
      },
    },
    passkey: {
      win: {
        aio: '742',
      },
      mac: {
        aio: '742',
      },
    },
    bookfab: {
      win: {
        aio: '879',
      },
      mac: {
        aio: '879',
      },
    },
    media_recover: {
      win: {
        aio: '62037',
      },
      mac: {
        aio: '62037',
      },
    },
  }

  // 强制固定折扣的产品(有差异化 但展示新用户的产品信息)
  const fixedProductMap: any = {
    700: [
      {
        key: 700,
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 1700,
        opt: 'lft',
        common_discount: true,
      },
    ],
    62001: [
      {
        key: 62001,
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 62004,
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 'streamfab_win_product_buypopup4',
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 'streamfab_mac_product_buypopup4',
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 'streamfab_win_productpage_buypopup3',
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 'streamfab_mac_productpage_buypopup3',
        opt: 'lft',
        common_discount: true,
      },
    ],
    749: [
      {
        key: 749,
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 62037,
        opt: 'lft',
        common_discount: true,
      },
    ],
    822: [
      757,
      1757,
      {
        key: 'streamfab_win_product_buypopup4',
        opt: 'lft',
        common_discount: true,
      },
      {
        key: 'streamfab_mac_product_buypopup4',
        opt: 'lft',
        common_discount: true,
      },
    ],
  }
  /** -------------- 配置项变量 end ---------- */

  /** -------------- 配置项方法 start ---------- */
  // 获取差异化的请求参数
  const getOprationKeys = (os: string, proLine: string) => {
    let oprationKeys: any = []
    const macProInfo = state.macProInfo
    let curPids = [state.proInfo.pid]
    if (macProInfo) {
      curPids.push(macProInfo.pid)
    }
    if (Object.keys(fixedProductMap).includes(state.proInfo.pid + '')) {
      curPids = [...curPids, ...fixedProductMap[state.proInfo.pid]]
    }
    if (proLine === 'dvdfab') {
      const bundlePros = state.relatedProInfo?.bundle.products?.data
      const bundlePids = bundlePros.map((pro: any) => pro.attributes.pid)
      if (bundlePids.includes(state.proInfo.pid)) {
        oprationKeys = [
          ...curPids,
          'dvdfab_win_multiproduct_popup3',
          'dvdfab_mac_multiproduct_popup3',
          'dvdfab_win_multiproduct_popup4',
          'dvdfab_mac_multiproduct_popup4',
        ]
      } else {
        oprationKeys = [...curPids, '712', '1712', 'dvdfab_win_product_popup4', 'dvdfab_mac_product_popup4']
      }
    } else if (proLine === 'streamfab') {
      if ([950, 953].includes(state.proInfo.pid) && os === 'win') {
        const opkey =
          state.proInfo.pid === 950 ? 'streamfab_win_drmm3u8_buypopup3' : 'streamfab_win_drmmpd_buypopup3'
        oprationKeys = [
          ...curPids,
          opkey,
          'streamfab_mac_productpage_buypopup3',
          'streamfab_win_product_buypopup4',
          'streamfab_mac_product_buypopup4',
        ]
      } else if (state.proInfo.pid === 62001) {
        oprationKeys = [...curPids]
      } else if (state.proInfo.pid === 822) {
        oprationKeys = [...curPids]
      } else {
        oprationKeys = [
          ...curPids,
          'streamfab_win_productpage_buypopup3',
          'streamfab_mac_productpage_buypopup3',
          'streamfab_win_product_buypopup4',
          'streamfab_mac_product_buypopup4',
        ]
      }
    } else if (proLine === 'recordfab') {
      oprationKeys = [...curPids, 757]
    } else if (proLine === 'passkey') {
      oprationKeys = [...curPids, '742']
    } else if (proLine === 'playerfab') {
      oprationKeys = [...curPids]
      if (state.proInfo.pid === 1832 || state.proInfo.pid === 1830) {
        oprationKeys = [...curPids, '1728']
      }
    } else if (proLine === 'media_recover') {
      oprationKeys = [...curPids, '62037']
    } else {
      oprationKeys = [...curPids]
    }
    return oprationKeys
  }
  // 获取差异化数据相关的位置类型, 用于获取展示的数据
  const getPosiType = (proline: string, os: string, oprationKeyVal: string) => {
    const oprationKeyData = oprationKeyMap[proline]
    if (!oprationKeyData) {
      return ''
    }
    const osData = oprationKeyData[os]
    return osData[oprationKeyVal]
  }
  /** -------------- 配置项方法 end ---------- */

  /** -------------- 工具方法 start ---------- */
  // 获取对应位置价格信息
  const getPriceInfoWitPosiType = (posiType: string) => {
    const info = state.productDiffInfo[posiType] || {}
    return Object.keys(info).length ? info : null
  }

  // 获取礼物信息
  const getGiftItems = (_curProInfo: any, proline: string, userType: string) => {
    const amazonPriceText = getAmazonCouponValue(_curProInfo)
    let giftText = []
    const productAttrs = _curProInfo.product_attrs?.data || []
    if (productAttrs && productAttrs.length) {
      const giftMediaSlug =
        _curProInfo.system === 'win' ? 'all-in-one-gift-common' : 'all-in-one-mac-gift-common'
      const giftNameType = ['upgrade_user', 'complete_user'].includes(userType) ? userType : 'is_new_user'
      const giftMediaTags =
        proline === 'dvdfab'
          ? productAttrs.find(
              (giftItem: any) =>
                giftItem.attributes.slug === giftMediaSlug && giftItem.attributes.name === giftNameType,
            )
          : productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
      if (giftMediaTags) {
        giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
          return { value: gText.value.replace('{num}', amazonPriceText) }
        })
      }
    }
    return giftText
  }

  // 获取当前用户的类型(以 aio 为判断的)
  const getAioUserTagType = (proline: string, os: string) => {
    let posiKey = 'aio'
    if ([950, 953].includes(state.proInfo.pid) && os === 'win') {
      posiKey = 'other_' + state.proInfo.pid
    }
    if ([822].includes(state.proInfo.pid)) {
      posiKey = 'aio_822'
    }
    if (proline === 'dvdfab') {
      const bundlePros = state.relatedProInfo?.bundle.products?.data
      const bundlePids = bundlePros.map((pro: any) => pro.attributes.pid)
      if (bundlePids.includes(state.proInfo.pid)) {
        posiKey = 'bundle'
      }
    }
    if (proline === 'playerfab' && [968].includes(+state.proInfo.pid)) {
      posiKey = 'other_' + state.proInfo.pid
    }
    const posi = oprationKeyMap[proline]?.[os][posiKey] || ''
    if (posi) {
      const diffInfo = state.productDiffInfo[posi]
      const curProInfo = os === 'win' ? state.proInfo : state.macProInfo || state.proInfo
      const hasCurrentLFT = diffInfo?.options?.lft_owned.includes(curProInfo.pid + '')
      return {
        hasCurrentLFT,
        userType: diffInfo?.user_tag_type || 'new',
      }
    }
    return {
      hasCurrentLFT: false,
      userType: 'new',
    }
  }

  // 获取 aio 的拓展上报参数
  const getAioExtParams = (userType: string, proLine: string) => {
    const params1Map: any = {
      dvdfab: 'dvdfab_productpage_popup',
      streamfab: 'streamfab_productpage_popup',
      musicfab: '',
      recordfab: 'streamfab_productpage_popup',
      playerfab: 'playerfab_productpage_popup',
      passkey: 'passkey_productpage_popup',
    }
    if (!params1Map[proLine]) {
      return {}
    }
    const extParams: any = {
      et_pa: 1,
      ext_params_str_param1: params1Map[proLine],
      ext_params_str_param2: '',
      ext_params_str_param3: '',
    }
    // 补全用户（产品线userType 和下面不一致时需要补充）
    if (userType === 'aio_upgrade' || userType === 'complete_user') {
      extParams.ext_params_str_param2 = 'aio_up'
      extParams.ext_params_str_param3 = 'non_all'
    } else {
      // 其他
      extParams.ext_params_str_param2 = 'aio_buy'
      extParams.ext_params_str_param3 = 'other'
    }

    if (proLine === 'passkey') {
      extParams.ext_params_str_param2 = 'aio_buy'
      if (userType === 'is_newest_aio_user') {
        // passkey aio用户
        extParams.ext_params_str_param3 = 'passkey_all'
      } else {
        extParams.ext_params_str_param3 = 'new'
      }
    }
    if (userType === 'is_new_user' && proLine === 'dvdfab' && !dvdfabType1.includes(state.proInfo.pid)) {
      extParams.ext_params_str_param4 = 'aio_old'
    }
    return extParams
  }

  // 获取各产品线 lft 的拓展上报参数
  const getDvdfabLftExtParams = (userTypes: Array<any>, hasCurrentLFT: boolean, discountCode: string) => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'dvdfab_productpage_popup',
      ext_params_str_param2: 'lft100',
      ext_params_str_param3: 'other',
    }
    const newTags = userTypes.filter((type) => type.includes('new'))
    if (newTags.length === userTypes.length || userTypes.includes('is_newest_aio_user') || hasCurrentLFT) {
      if (userTypes.includes('new') || userTypes.includes('is_new_user')) {
        extPramas.ext_params_str_param3 = 'new'
      }
      if (hasCurrentLFT) {
        extPramas.ext_params_str_param3 = 'same'
      }
      if (userTypes.includes('is_newest_aio_user')) {
        extPramas.ext_params_str_param3 = 'dvdfab_all'
      }
    } else if (discountCode.includes('dvdfab_dc_h8')) {
      extPramas.ext_params_str_param2 = 'lft40'
      // 拥有DVDFab不全AIO (option≥8）
      extPramas.ext_params_str_param3 = 'dvdfab_h8'
    } else if (discountCode.includes('dvdfab_dc_l8')) {
      extPramas.ext_params_str_param2 = 'lft25'
      // 拥有DVDFab不全AIO (option≥8）
      extPramas.ext_params_str_param3 = 'dvdfab_l8'
    }
    if (discountCode.includes('dvdfab_cros_sg')) {
      extPramas.ext_params_str_param2 = 'lft20'
      extPramas.ext_params_str_param3 = 'cros_pro'
    }
    return extPramas
  }
  const getStreamfabLftExtParams = (userTypes: Array<any>, hasCurrentLFT: boolean, discountCode: string) => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'streamfab_productpage_popup',
      ext_params_str_param2: 'lft100',
      ext_params_str_param3: 'other',
    }
    const newTags = userTypes.filter((type) => type.includes('new'))
    if (newTags.length === userTypes.length || userTypes.includes('aio_all') || hasCurrentLFT) {
      if (userTypes.includes('new')) {
        extPramas.ext_params_str_param3 = 'new'
      }
      if (hasCurrentLFT) {
        extPramas.ext_params_str_param3 = 'same'
      }
      if (userTypes.includes('aio_all')) {
        extPramas.ext_params_str_param3 = 'streamfab_all'
      }
    } else if (discountCode.includes('streamfab_dc_h13')) {
      extPramas.ext_params_str_param2 = 'lft40'
      extPramas.ext_params_str_param3 = 'streamfab_h13'
    } else if (discountCode.includes('streamfab_dc_l13')) {
      extPramas.ext_params_str_param2 = 'lft25'
      extPramas.ext_params_str_param3 = 'streamfab_l13'
    }

    if (discountCode.includes('streamfab_cros_sg')) {
      extPramas.ext_params_str_param2 = 'lft20'
      extPramas.ext_params_str_param3 = 'cros_pro'
    }
    return extPramas
  }
  const getMusicLftExtParams = () => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'paid',
    }
    return extPramas
  }

  const getPlayerLftExtParams = (
    userTypes: Array<any>,
    hasCurrentLFT: boolean,
    discountCode: string,
    pid: [string | number],
  ) => {
    if (+pid === 968) {
      const extPramas = {
        et_pa: 1,
        ext_params_str_param1: 'playerfab_productpage_popup',
        ext_params_str_param2: '',
      }
      const newTags = userTypes.filter((type) => type.includes('new'))
      if (discountCode.includes('streamplayer_old_user_new')) {
        extPramas.ext_params_str_param2 = 'has_player_pro'
      } else if (
        newTags.length === userTypes.length ||
        userTypes.includes('is_newest_aio_user') ||
        hasCurrentLFT
      ) {
        if (userTypes.includes('new') || userTypes.includes('is_new_user')) {
          extPramas.ext_params_str_param2 = 'new'
        }
        if (hasCurrentLFT) {
          extPramas.ext_params_str_param2 = 'same'
        }
      }
      return extPramas
    } else {
      const extPramas = {
        et_pa: 1,
        ext_params_str_param1: 'paid',
      }
      return extPramas
    }
  }
  const getBookfabLftExtParams = (userTypes: Array<any>, hasCurrentLFT: boolean, discountCode: string) => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'bookfab_productpage_popup',
      ext_params_str_param2: 'lft100',
      ext_params_str_param3: 'other',
    }
    const newTags = userTypes?.filter((type) => type.includes('new'))
    if (discountCode.includes('dvdfab_aio_bf_new')) {
      extPramas.ext_params_str_param2 = 'lft40'
      extPramas.ext_params_str_param3 = 'dvdfab_aio'
    } else if (discountCode.includes('bookfab_old_25_new')) {
      extPramas.ext_params_str_param2 = 'lft25'
      extPramas.ext_params_str_param3 = 'bookfab_old'
    } else if (discountCode.includes('bookfab_cros_sg_new')) {
      extPramas.ext_params_str_param2 = 'lft20'
      extPramas.ext_params_str_param3 = 'cros_pro'
    } else if (newTags.length === userTypes?.length || userTypes?.length || hasCurrentLFT) {
      if (userTypes?.includes('new') || userTypes?.includes('is_new_user')) {
        extPramas.ext_params_str_param3 = 'new'
      }
      // 因为就没有aio，所以也没有aio授权 故使用user_tag_type
      if (userTypes?.includes('is_buy_user') || hasCurrentLFT) {
        extPramas.ext_params_str_param3 = 'same'
      }
      if (userTypes?.includes('aio_user')) {
        extPramas.ext_params_str_param3 = 'dvdfab_aio'
      }
      if (userTypes?.includes('old_use')) {
        extPramas.ext_params_str_param3 = 'bookdab_old'
      }
      if (userTypes?.includes('cross_single_user')) {
        extPramas.ext_params_str_param3 = 'other_non_aio'
      }
      if (userTypes?.includes('cross_aio_user')) {
        extPramas.ext_params_str_param3 = 'other_aio'
      }
      if (userTypes.includes('aio_all')) {
        extPramas.ext_params_str_param3 = 'bookfab_all'
      }
    }
    return extPramas
  }
  const getPasskeyLftExtParams = (userTypes: Array<any>, hasCurrentLFT: boolean, discountCode: string) => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'passkey_productpage_popup',
      ext_params_str_param2: 'lft100',
      ext_params_str_param3: 'other',
    }
    const newTags = userTypes.filter((type) => type.includes('new'))
    if (newTags.length === userTypes.length || userTypes.includes('is_newest_aio_user') || hasCurrentLFT) {
      if (userTypes.includes('new') || userTypes.includes('is_new_user')) {
        extPramas.ext_params_str_param3 = 'new'
      }
      if (hasCurrentLFT) {
        extPramas.ext_params_str_param3 = 'same'
      }
      if (userTypes.includes('is_newest_aio_user')) {
        extPramas.ext_params_str_param3 = 'passkey_all'
      }
    } else if (discountCode.includes('passkey_dc_h4')) {
      extPramas.ext_params_str_param2 = 'lft40'
      // 拥有DVDFab不全AIO (option≥8）
      extPramas.ext_params_str_param3 = 'passkey_h4'
    } else if (discountCode.includes('passkey_dc_l4')) {
      extPramas.ext_params_str_param2 = 'lft20'
      // 拥有DVDFab不全AIO (option≥8）
      extPramas.ext_params_str_param3 = 'passkey_l4'
    }
    if (discountCode.includes('passkey_cros_sg')) {
      extPramas.ext_params_str_param2 = 'lft20'
      extPramas.ext_params_str_param3 = 'cros_pro'
    }
    return extPramas
  }

  // 获取 recordfab lft 的上报
  const getRecordLftExtParams = (userTypes: Array<any>, userTagType: string, discountCode: string) => {
    const extPramas = {
      et_pa: 1,
      ext_params_str_param1: 'recordfab_productpage_popup',
      ext_params_str_param2: 'lft15',
      ext_params_str_param3: 'other',
    }
    const isSfAio =
      state.userTagsRes.streamfab_win_bool_buy_aio || state.userTagsRes.streamfab_mac_bool_buy_aio
    const sfNumH13 =
      state.userTagsRes.streamfab_win_num_options_lft_count >= 13 ||
      state.userTagsRes.streamfab_mac_num_options_lft_count >= 13
    const isSf = state.userTagsRes.streamfab_win_bool_buy || state.userTagsRes.streamfab_mac_bool_buy
    const isFullAio = userTypes.includes('aio_all')
    const newTags = userTypes.filter((type) => type.includes('new'))
    if (newTags.length === userTypes.length || isFullAio || userTagType) {
      if (userTypes.includes('new')) {
        extPramas.ext_params_str_param3 = 'new'
      }
      if (userTagType === 'is_buy') {
        extPramas.ext_params_str_param3 = 'same'
      }
      if (isFullAio) {
        extPramas.ext_params_str_param3 = 'streamfab_all'
      }
    } else if (sfNumH13) {
      extPramas.ext_params_str_param3 = 'streamfab_h13'
    } else if (isSfAio || isSf) {
      extPramas.ext_params_str_param3 = 'streamfab_l13'
    }
    if (discountCode.includes('recordfab_cros_sg') && userTagType !== 'is_buy' && userTagType !== 'is_new') {
      if (sfNumH13) {
        extPramas.ext_params_str_param2 = 'lft40'
        extPramas.ext_params_str_param3 = 'streamfab_h13'
      } else if (isSfAio || isSf || userTagType === 'is_sub') {
        extPramas.ext_params_str_param2 = 'lft25'
        extPramas.ext_params_str_param3 = 'streamfab_l13'
        if (userTagType && userTagType === 'is_sub') {
          extPramas.ext_params_str_param3 = 'same'
        }
      } else if (state.userTagsRes?.common_bool_buy) {
        extPramas.ext_params_str_param2 = 'lft20'
        extPramas.ext_params_str_param3 = 'cros_pro'
      }
    }
    return extPramas
  }
  /** -------------- 工具方法 end ---------- */

  /** -------------- 方案渲染 start ---------- */
  // 获取方案的详细信息
  const getRecomItem = (
    opt: string,
    recomType: string,
    type: string,
    isBest: boolean,
    oriProInfo: any,
    os: string,
    proline: string,
    oprationKeyVal: string,
    posiIndex: number,
  ) => {
    let _proInfo = oriProInfo.system === os ? oriProInfo : getStrapiData(oriProInfo.related_products?.data[0])
    // win mac正常显示此mac弹窗
    if (routeName === 'mac_blu_ray_player') {
      _proInfo = oriProInfo
    }
    const recomList = JSON.parse(JSON.stringify(state.dialogData[type] || state.dialogData.normal))

    let recomItem = recomList.find((item: any) => item.key === recomType)

    let priceInfo = {
      pid: _proInfo.pid,
      options: {
        has_lft_options_num: 0,
        has_nlt_options_num: 0,
        has_online_lft_options_num: 0,
        has_online_nlt_options_num: 0,
        has_online_options_num: 0,
        has_options_num: 0,
        total_options_num: _proInfo.products.data.length,
      },
      user_tag_type: 'is_new_user',
      price: getDefaultPriceInfo(_proInfo, opt),
    }
    let diffPriceInfo: any = null
    if (oprationKeyVal && opt !== '1M' && opt !== '1Y') {
      const posiType = oprationKeyVal === 'lft' ? _proInfo.pid : getPosiType(proline, os, oprationKeyVal)
      if (posiType) {
        const _diffPriceInfo = getPriceInfoWitPosiType(posiType)
        diffPriceInfo = _diffPriceInfo
        if (_diffPriceInfo) {
          priceInfo = _diffPriceInfo
        }
      }
    }
    if (
      posiIndex === 3 &&
      (recomType === 'bundle' || recomType === 'other' || recomType === 'mycombo') &&
      +priceInfo.pid !== _proInfo.pid
    ) {
      // recomItem = state.dialogData.dvdfab.aio
      recomType = 'aio'
      recomItem = recomList.find((item: any) => item.key === recomType)
      _proInfo =
        oriProInfo.system === os
          ? state.relatedProInfo?.aio
          : getStrapiData(state.relatedProInfo?.aio.related_products?.data[0])
    }

    recomItem.elkParams = {
      event_label: eventLabelMap[opt],
    }
    recomItem.gTrackInfo = {}
    recomItem.opt = opt
    recomItem.isUpgrade = false
    recomItem.title = recomItem.title.includes('{proname}')
      ? recomItem.title.replace('{proname}', _proInfo.name)
      : recomItem.title
    recomItem.isBest = isBest
    recomItem.bestText = isBest ? state.dialogData.bestSeller : ''
    recomItem.price = translatePrice(priceInfo?.price.payment_price, currency[1], locale)
    recomItem.oriPrice =
      priceInfo?.price.off_num > 0 ? translatePrice(priceInfo.price.origin_price, currency[1], locale) : ''

    if (priceInfo?.price.off_num) {
      recomItem.rightTopTag = commonJson.coupon_num_2.replace('{num}', priceInfo?.price.off_num + '')
      if (isBest) {
        recomItem.rightTopTag = ''
        const userTypeTags = ['new', 'is_new_user', 'is_new', 'is_buy']
        recomItem.bestText = userTypeTags.includes(priceInfo?.user_tag_type)
          ? state.dialogData.bestSeller +
            ': ' +
            commonJson.coupon_num_2.replace('{num}', priceInfo?.price?.off_num + '')
          : state.dialogData.tag?.discountTitle.replace('{num}', priceInfo?.price.off_num + '')
      }
    }

    if (recomType === 'mycombo') {
      recomItem.rightTopTag = recomItem.tag
      recomItem.elkParams.event_label = eventLabelMap.mycombo
    }

    if (recomType === 'bundle' && routeName !== 'mac_blu_ray_player') {
      recomItem.includeItems = _proInfo.products.data
      recomItem.elkParams.event_label = eventLabelMap.bundle
      recomItem.rightTopTag = recomItem.tag
      if (['one_option'].includes(priceInfo.user_tag_type)) {
        recomItem.isUpgrade = true
        recomItem.title = state.dialogData.tag?.upgradeTitle.replace('{pro}', recomItem.title)
      }
    }
    if (recomType === 'aio' && proline === 'passkey') {
      recomItem.includeItems = _proInfo.products.data
    }
    // passkey aio升级的时候不展示右上角的tag
    if (recomType === 'bundle' && routeName === 'mac_blu_ray_player') {
      recomItem.rightTopTag = ''
    }
    if (recomType === 'other') {
      recomItem.elkParams.event_label = eventLabelMap.other
      const descList = recomItem.descList.flatMap((desc: any) => {
        const newDesc = { ...desc }
        newDesc.value = newDesc.value.replace('{num}', _proInfo.products?.data?.length)
        return newDesc
      })
      recomItem.descList = descList
    }
    recomItem.specialGiftValue = []
    recomItem.giftProImg = null

    if (recomType === 'aio') {
      recomItem.elkParams.event_label = eventLabelMap.aio
      if (['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)) {
        recomItem.isUpgrade = true
        const upgradeInfo = recomList.find((item: any) => item.key === 'upgrade')
        recomItem.title = state.dialogData.tag?.upgradeTitle.replace('{pro}', recomItem.title)
        const noLftNum = priceInfo.options?.total_options_num - priceInfo.options?.has_online_lft_options_num
        const avgPrice = (priceInfo.price.payment_price / noLftNum).toFixed(2)
        const giftNameType = ['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)
          ? priceInfo.user_tag_type
          : 'is_new_user'
        recomItem.giftItems = getGiftItems(_proInfo, proline, giftNameType)
        const giftProImg = _proInfo.imgs.find((img: any) => img.label === 'basic')
        const imgSuffix = getProImg(priceInfo.pid, locale)
        if (imgSuffix) {
          const urls = giftProImg.url.split('/box/')
          giftProImg.url = urls[0] + '/box/' + imgSuffix
        }
        recomItem.giftProImg = giftProImg
        recomItem.rightTopTag =
          priceInfo.user_tag_type === 'complete_user'
            ? state.dialogData.tag.aioUpgradeOff
            : state.dialogData.tag.aioUpgradeOffNew.replace(
                '{num}',
                translatePrice(avgPrice, currency[1], locale) as string,
              )
        // passkey aio升级的时候不展示右上角的tag
        if (proline === 'passkey') {
          recomItem.rightTopTag = state.dialogData.tag.aioUpgradeOff
        }
        if (upgradeInfo) {
          recomItem.descList = upgradeInfo.descList
        }
      } else if (recomItem?.specialGift?.length) {
        const giftDesc = recomItem.specialGift.find((gift: any) => gift.key === os)
        if (proline === 'recordfab') {
          recomItem.includeItems = [giftDesc]
        } else {
          recomItem.specialGiftValue = [giftDesc]
        }
      }
    }
    if (proline === 'bookfab') {
      const giftDesc = recomItem.specialGift.find((gift: any) => gift.key === os)
      recomItem.giftItems = [giftDesc]
    }
    if (recomType === 'lifetime_stream_player') {
      recomItem.bestText = state.dialogData.tag?.lifetimeCouponDesc.replace(
        '{num}',
        Math.floor(+priceInfo.price.off_num / 10) * 10,
      )
    }
    if (recomType === 'aio_youtube_pro') {
      recomItem.elkParams.event_label = eventLabelMap.aio
    }
    if (recomType === 'bottom_youtube_pro') {
      recomItem.elkParams.event_label = eventLabelMap.bundle
      recomItem.desc = recomItem.desc.replace('{num}', _proInfo.products.data?.length)
      if (isBest) {
        recomItem.bestText = commonJson.coupon_num_2.replace('{num}', priceInfo?.price?.off_num + '')
        recomItem.proImg = _proInfo.imgs.find((img: any) => img.label === 'basic')
      }
    }
    if (recomType === 'bottom' || recomType === 'bundle_bottom') {
      if (!diffPriceInfo) {
        return null
      }
      recomItem.elkParams.event_label = eventLabelMap.aio
      recomItem.desc = recomItem.desc.replace('{num}', _proInfo.products.data?.length)
      const descList = recomItem.descList.flatMap((desc: any) => {
        const newDesc = { ...desc }
        if (!newDesc.key || newDesc.key === os) {
          return newDesc
        }
        return []
      })
      recomItem.descList = descList
      if (isBest) {
        recomItem.title = recomItem.title.replace('<br>', ' ')
        recomItem.bestText = commonJson.coupon_num_2.replace('{num}', priceInfo?.price?.off_num + '')
        const proImg = _proInfo.imgs.find((img: any) => img.label === 'basic')
        const imgSuffix = getProImg(priceInfo.pid, locale)
        if (imgSuffix) {
          const urls = proImg.url.split('/box/')
          proImg.url = urls[0] + '/box/' + imgSuffix
        }
        recomItem.proImg = proImg
      }
      if (['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)) {
        recomItem.title = state.dialogData.tag?.upgradeTitle.replace('{pro}', recomItem.title)
        recomItem.desc = state.dialogData.tag?.dvdfabAioUpgradeDesc
        const noLftNum = priceInfo.options?.total_options_num - priceInfo.options?.has_online_lft_options_num
        const avgPrice = (priceInfo.price.payment_price / noLftNum).toFixed(2)
        recomItem.priceDesc = commonJson.per_pro.replace(
          '{num}',
          translatePrice(avgPrice, currency[1], locale) as string,
        )
        const giftNameType = ['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)
          ? priceInfo.user_tag_type
          : 'is_new_user'
        recomItem.descList = []
        recomItem.giftItems = getGiftItems(_proInfo, proline, giftNameType)
        recomItem.isUpgrade = true
        recomItem.bestText = state.dialogData.bestSeller
      }
    }
    const _new_proInfo = JSON.parse(JSON.stringify(_proInfo))
    _new_proInfo.pid = priceInfo.pid
    // 数据上报部分
    let extParams: any = {}
    if (recomType !== 'aio' && recomType !== 'aio_822' && recomType !== 'bottom') {
      const winUseTypeObj = getAioUserTagType(proline, 'win')
      const macUseTypeObj = getAioUserTagType(proline, 'mac')
      const osHasCurrentLFT = os === 'win' ? winUseTypeObj.hasCurrentLFT : macUseTypeObj.hasCurrentLFT
      switch (proline) {
        case 'dvdfab': {
          extParams = getDvdfabLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            osHasCurrentLFT,
            priceInfo?.price?.code || '',
          )
          if (recomType === '1Y') {
            extParams = {
              ...extParams,
              ext_params_str_param1: 'paid',
              ext_params_str_param2: '',
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          if (recomType === 'bundle') {
            if (priceInfo.user_tag_type && priceInfo.user_tag_type.includes('option')) {
              extParams = getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
            } else {
              extParams = {
                ...extParams,
                ext_params_str_param2: 'dvd_bundle_buy',
                ext_params_str_param3: 'new',
              }
            }
          }
          break
        }
        case 'streamfab': {
          extParams = getStreamfabLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            osHasCurrentLFT,
            priceInfo.price?.code || '',
          )
          if (recomType === '1M' || recomType === '1Y_youtube_pro') {
            extParams = {
              ...extParams,
              ext_params_str_param1: '',
              ext_params_str_param2: '',
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          if (recomType === 'other' || recomType === 'bundle_bottom') {
            extParams = {
              ...extParams,
              event_category: recomItem.elkParams.event_label,
              ext_params_str_param2: priceInfo.pid + '_bundle_' + priceInfo.price?.off_num,
              ext_params_str_param3: '',
            }
          }
          if (recomType === 'mycombo') {
            extParams = {
              ...extParams,
              event_label: 'productpage_custom_now_combo',
              event_category: 'productpage_custom_now_combo',
              pids: [_new_proInfo.pid],
              ext_params_str_param1: 'streamfab_productpage_popup',
              ext_params_str_param2: 'mycombo_customize',
              ext_params_str_param3: '',
            }
          }
          if (recomType === 'lifetime_youtube_pro') {
            extParams = {
              ...extParams,
              ext_params_str_param2: '',
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          if (recomType === 'bottom_youtube_pro') {
            extParams = {
              ...extParams,
              ext_params_str_param2: priceInfo.pid + '_bundle_' + priceInfo.price?.off_num,
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          if (recomType === 'aio_youtube_pro') {
            extParams = getAioExtParams(priceInfo.user_tag_type, proline)
          }
          break
        }
        case 'musicfab': {
          extParams = getMusicLftExtParams()
          extParams = {
            ...extParams,
            ext_params_str_param1: '',
            event_category: recomItem.elkParams.event_label,
          }
          break
        }
        case 'playerfab': {
          extParams = getPlayerLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            osHasCurrentLFT,
            priceInfo.price?.code || '',
            _proInfo.pid,
          )
          extParams = {
            ...extParams,
            event_category: recomItem.elkParams.event_label,
          }
          break
        }
        case 'passkey': {
          extParams = getPasskeyLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            osHasCurrentLFT,
            priceInfo?.price?.code || '',
          )
          if (recomType === '1Y') {
            extParams = {
              ...extParams,
              ext_params_str_param1: 'paid',
              ext_params_str_param2: '',
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          break
        }
        case 'recordfab': {
          extParams = getRecordLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            priceInfo.user_tag_type,
            priceInfo.price?.code || '',
          )
          if (recomType === '1Y') {
            extParams = {
              ...extParams,
              ext_params_str_param1: '',
              ext_params_str_param2: '',
              ext_params_str_param3: '',
              event_category: recomItem.elkParams.event_label,
            }
          }
          break
        }
        case 'bookfab': {
          extParams = getBookfabLftExtParams(
            [winUseTypeObj.userType, macUseTypeObj.userType],
            osHasCurrentLFT,
            priceInfo?.price?.code || '',
          )
          extParams = {
            ...extParams,
            event_category: recomItem.elkParams.event_label,
          }
          break
        }
        case 'media_recover': {
          if (
            recomType === '1Y_dvd_blu_ray' ||
            recomType === 'lifetime_dvd_blu_ray' ||
            recomType === 'aio_dvd_blu_ray'
          ) {
            extParams = {
              event_label: '',
              event_category: '',
            }
          }
          break
        }
        default: {
          break
        }
      }
    } else {
      // getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
      extParams = {}
      if (proline === 'musicfab') {
        extParams = getMusicLftExtParams()
      } else if (proline === 'streamfab') {
        // extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        if (priceInfo.user_tag_type && priceInfo.user_tag_type !== 'new') {
          extParams = getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
        } else {
          extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        }
      } else if (proline === 'dvdfab') {
        if (priceInfo.user_tag_type && priceInfo.user_tag_type !== 'is_new_user') {
          extParams = getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
        } else {
          extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        }
      } else if (proline === 'passkey') {
        if (priceInfo.user_tag_type === 'upgrade_user') {
          extParams = getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
          // user_info.tags.passkey_win_bool_buy_aio 如果为true就是 补全，如果是false就是升级
          if (state.userTagsRes?.passkey_win_bool_buy_aio) {
            extParams.ext_params_str_param5 = 'aio_upgrade'
          }
        } else {
          extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        }
      } else if (proline === 'playerfab') {
        if (priceInfo.user_tag_type && priceInfo.user_tag_type !== 'is_new_user') {
          extParams = getUpgradeExtParams(priceInfo, _new_proInfo, proline, 'upgrade_license')
        } else if (recomType !== 'aio') {
          // playerfab aio上报
          extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        }
      }
    }

    if (posiIndex === 3 && (proline === 'streamfab' || proline === 'recordfab')) {
      const useTypeObj = getAioUserTagType(proline, os)
      if (['single_upgrade', 'mycombo_upgrade', 'aio_upgrade'].includes(useTypeObj.userType)) {
        recomItem.isUpgrade = true
        const _recomList = JSON.parse(JSON.stringify(state.dialogData.streamfab))
        const upgradeRecomItem = _recomList.find((item: any) => item.key === 'upgrade')
        const aioItem = _recomList.find((item: any) => item.key === 'aio')
        const aioTitle = aioItem.title.replace('{proname}', state.relatedProInfo?.aio.name)
        const isCompelete = useTypeObj.userType === 'aio_upgrade'
        const noLftNum = priceInfo.options?.total_options_num - priceInfo.options?.has_online_lft_options_num
        const avgPrice = (priceInfo.price.payment_price / noLftNum).toFixed(2)

        recomItem.title = isCompelete
          ? upgradeRecomItem.title
              .replace('{num}', translatePrice(avgPrice, currency[1], locale) as string)
              .replace('{pnum}', 'X ' + noLftNum)
          : state.dialogData.tag?.upgradeTitle.replace('{pro}', aioTitle)
        recomItem.descList = aioItem.descList
        // .map((dli: any) => {
        //   dli.value = dli.value.replace(
        //     '{proname}',
        //     state.relatedProInfo?.aio.name + ` (${commonJson.lifetime})`,
        //   )
        //   return dli
        // })
        recomItem.btnText = commonJson.upgrade_user
        recomItem.rightTopTag = state.dialogData.tag?.aioUpgradeOff

        // recomItem.price = ''
        // recomItem.oriPrice = ''
        // recomItem.featureClass = 'streamfab-upgrade'
        // extParams = {
        //   event_label: 'productpage_buy_now_bundle',
        //   event_category: 'productpage_buy_now_bundle',
        //   ext_params_str_param1: 'streamfab_productpage_popup',
        //   ext_params_str_param2: 'aio_up',
        //   ext_params_str_param3: 'non_all',
        // }
      }
      // 不是 mycombo
      if (![20051, 21051].includes(priceInfo.pid)) {
        if (priceInfo.user_tag_type && priceInfo.user_tag_type !== 'new') {
          extParams = {
            event_label: 'productpage_buy_now_bundle',
            event_category: 'productpage_buy_now_bundle',
            ...getUpgradeExtParams(priceInfo, _new_proInfo, 'streamfab', 'upgrade_license'),
          }
        } else {
          extParams = getAioExtParams(priceInfo.user_tag_type, proline)
        }
      }
    }
    extParams = {
      event_category: recomItem.elkParams.event_label,
      ...extParams,
    }
    _new_proInfo.payment_price = priceInfo.price?.payment_price
    recomItem.event = {
      exposure: getElkParams('show', _new_proInfo, { ...recomItem.elkParams, ...extParams }),
      click: getElkParams('click', _new_proInfo, { ...recomItem.elkParams, ...extParams }),
    }
    let extBuyParams: any = {}
    if (opt !== 'LFT') {
      extBuyParams = {
        ...extBuyParams,
        pay: state.payways.pay,
        currency: currency[0],
        lang: locale,
      }
    }
    const userType = userTypeMapKey[proline][priceInfo.user_tag_type]
    recomItem.checkoutUrl = getBuyUrl(
      _new_proInfo,
      { gTrackInfo: { ...recomItem.gTrackInfo } },
      priceInfo.price,
      { ...extBuyParams, et_pa: 1, ...extParams },
      opt,
      userType,
    )
    return recomItem
  }
  // stremfab 数据
  const setSteamfabData = (os: string, _proInfo: any) => {
    const firstOptValue = state.proInfo.pid === 62001 ? '1Y' : '1M'
    const optList = [firstOptValue, 'LFT', 'LFT', 'LFT']
    let recomTypeList = [firstOptValue, 'lifetime', 'mycombo', 'bottom']
    let isBestList = [false, true, false, false]
    let dlgInfoTypeList = ['normal', 'streamfab', 'streamfab', 'streamfab']
    let oprationKeyList = ['', 'lft', 'aio', 'bottom']
    let proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.mycombo, state.relatedProInfo?.aio]
    if (state.proInfo.pid === 822) {
      recomTypeList = [firstOptValue, 'lifetime', 'aio', 'bottom_youtube_pro']
      oprationKeyList = ['', 'lft', 'aio_822', 'bottom']
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio, state.relatedProInfo?.ultimate]
    }
    if ([950, 953].includes(state.proInfo.pid) && os === 'win') {
      recomTypeList = [firstOptValue, 'lifetime', 'other', 'bottom']
      oprationKeyList = ['', 'lft', 'other_' + state.proInfo.pid, 'bottom']
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.other, state.relatedProInfo?.aio]
    }

    if (state.proInfo.pid === 62001) {
      recomTypeList = ['1Y_youtube_pro', 'lifetime_youtube_pro', 'aio_youtube_pro', 'bottom_youtube_pro']
      isBestList = [false, true, false, true]
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio, state.relatedProInfo?.ultimate]
      dlgInfoTypeList = ['streamfab', 'streamfab', 'streamfab', 'streamfab']
    }

    for (let i = 0; i < 4; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      if (i < 3) {
        state.recomPlanItems[i] = getRecomItem(
          optVal,
          recomTypeVal,
          dlgInfoTypeVal,
          bestVal,
          proInfoVal,
          os,
          'streamfab',
          oprationKeyVal,
          i + 1,
        )
      } else {
        state.bottomRecomPlanItem = getRecomItem(
          optVal,
          recomTypeVal,
          dlgInfoTypeVal,
          bestVal,
          proInfoVal,
          os,
          'streamfab',
          oprationKeyVal,
          i + 1,
        )
      }
    }
  }
  // dvdfab 数据
  const setDvdfabData = (os: string, _proInfo: any) => {
    const firstOptValue = '1Y'
    // opt 参数的数据集
    const optList = [firstOptValue, 'LFT', 'LFT', 'LFT']
    // 推荐方案文案的类型
    let recomTypeList = [firstOptValue, 'LFT', 'aio', 'bottom']
    // 最佳方案
    const isBestList = [false, true, false, true]
    // 推荐方案使用的数据来源
    const dlgInfoTypeList = ['normal', 'normal', 'dvdfab', 'dvdfab']

    // 用于获取相应位置对应的差异化数据 key
    let oprationKeyList = ['', 'lft', 'aio', 'bottom']

    // 相应位置的产品信息
    let proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio, state.relatedProInfo?.aio]

    // 特殊情况
    const bundlePros = state.relatedProInfo?.bundle.products?.data
    const bundlePids = bundlePros.map((pro: any) => pro.attributes.pid)
    if (bundlePids.includes(state.proInfo.pid)) {
      oprationKeyList = ['', 'lft', 'bundle', 'bundle_bottom']
      recomTypeList = [firstOptValue, 'LFT', 'bundle', 'bottom']
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.bundle, state.relatedProInfo?.aio]
    }

    for (let i = 0; i < 4; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      if (i < 3) {
        state.recomPlanItems[i] = getRecomItem(
          optVal,
          recomTypeVal,
          dlgInfoTypeVal,
          bestVal,
          proInfoVal,
          os,
          'dvdfab',
          oprationKeyVal,
          i + 1,
        )
      } else {
        state.bottomRecomPlanItem = getRecomItem(
          optVal,
          recomTypeVal,
          dlgInfoTypeVal,
          bestVal,
          proInfoVal,
          os,
          'dvdfab',
          oprationKeyVal,
          i + 1,
        )
      }
    }
  }
  // playerfab 数据
  const setPlayerfabData = (os: string, _proInfo: any) => {
    // 用于获取相应位置对应的差异化数据 key
    const oprationKeyList = ['', 'lft', 'aio']
    const firstOptValue = '1Y'
    const optList = [firstOptValue, 'LFT', 'LFT']
    let recomTypeList = [firstOptValue, 'LFT', 'aio']
    const isBestList = [false, true, false]
    let dlgInfoTypeList = ['normal', 'normal', 'playerfab']
    let proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio]
    if ([830].includes(state.proInfo.pid)) {
      recomTypeList = [firstOptValue, 'lifetime_774', 'aio']
      dlgInfoTypeList = ['normal', 'playerfab', 'playerfab']
      proInfoList = [
        _proInfo,
        state.relatedProInfo?.lifetime_774 ? state.relatedProInfo?.lifetime_774 : _proInfo,
        state.relatedProInfo?.aio,
      ]
    }
    if ([1832].includes(state.proInfo.pid)) {
      recomTypeList = [firstOptValue, 'LFT', 'bundle']
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.bundle]
      dlgInfoTypeList = ['normal', 'normal', 'playerfab']
    }
    if ([1830].includes(state.proInfo.pid)) {
      recomTypeList = [firstOptValue, 'lifetime_1774', 'bundle']
      proInfoList = [
        _proInfo,
        state.relatedProInfo?.lifetime_1774 ? state.relatedProInfo?.lifetime_1774 : _proInfo,
        state.relatedProInfo?.bundle,
      ]
      dlgInfoTypeList = ['normal', 'playerfab', 'playerfab']
    }
    for (let i = 0; i < 3; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      state.recomPlanItems[i] = getRecomItem(
        optVal,
        recomTypeVal,
        dlgInfoTypeVal,
        bestVal,
        proInfoVal,
        os,
        'playerfab',
        oprationKeyVal,
        i + 1,
      )
    }
  }
  // Bookfab 数据
  const setBookfabData = (os: string, _proInfo: any) => {
    const oprationKeyList = ['', '', 'lft']
    const firstOptValue = '1M'
    const optList = [firstOptValue, '1Y', 'LFT']
    const recomTypeList = [firstOptValue, '1Y', 'lifetime']
    const isBestList = [false, false, true]
    const dlgInfoTypeList = ['bookfab', 'bookfab', 'bookfab']
    const proInfoList = [_proInfo, _proInfo, _proInfo]
    for (let i = 0; i < 3; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      state.recomPlanItems[i] = getRecomItem(
        optVal,
        recomTypeVal,
        dlgInfoTypeVal,
        bestVal,
        proInfoVal,
        os,
        'bookfab',
        oprationKeyVal,
        i + 1,
      )
    }
  }

  // MediaRecover 数据
  const setMediaRecoverData = (os: string, _proInfo: any) => {
    const oprationKeyList = ['', '', 'lft']
    const firstOptValue = +state.proInfo.pid === 749 ? '1Y' : '1M'
    let optList = [firstOptValue, '1Y', 'LFT']
    let recomTypeList = [firstOptValue, '1Y', 'lifetime']
    let isBestList = [false, false, true]
    const dlgInfoTypeList = ['mediarecover', 'mediarecover', 'mediarecover']
    let proInfoList = [_proInfo, _proInfo, _proInfo]
    if (+state.proInfo.pid === 749) {
      isBestList = [false, false, false]
      optList = ['1Y', 'LFT', 'LFT']
      recomTypeList = ['1Y_dvd_blu_ray', 'lifetime_dvd_blu_ray', 'aio_dvd_blu_ray']
      proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio]
    }
    for (let i = 0; i < 3; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      state.recomPlanItems[i] = getRecomItem(
        optVal,
        recomTypeVal,
        dlgInfoTypeVal,
        bestVal,
        proInfoVal,
        os,
        'media_recover',
        oprationKeyVal,
        i + 1,
      )
    }
  }
  // passkey 数据
  const setPasskeyData = (os: string, _proInfo: any) => {
    const firstOptValue = '1Y'
    const optList = [firstOptValue, 'LFT', 'LFT', 'LFT']
    const recomTypeList = [firstOptValue, 'LFT', 'aio']
    const isBestList = [false, true, false]
    const dlgInfoTypeList = ['normal', 'normal', 'passkey']
    // 用于获取相应位置对应的差异化数据 key
    const oprationKeyList = ['', 'lft', 'aio']
    const proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio]

    for (let i = 0; i < 4; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      if (i < 3) {
        state.recomPlanItems[i] = getRecomItem(
          optVal,
          recomTypeVal,
          dlgInfoTypeVal,
          bestVal,
          proInfoVal,
          os,
          'passkey',
          oprationKeyVal,
          i + 1,
        )
      }
    }
  }
  // musicfab 数据
  const setMusicfabData = (os: string, _proInfo: any) => {
    const firstOptValue = '1Y'
    const optList = [firstOptValue, 'LFT', 'LFT']
    const recomTypeList = [firstOptValue, 'LFT', 'aio']
    const isBestList = [false, true, false]
    const dlgInfoTypeList = ['normal', 'normal', 'musicfab']

    const proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio]

    for (let i = 0; i < 3; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      state.recomPlanItems[i] = getRecomItem(
        optVal,
        recomTypeVal,
        dlgInfoTypeVal,
        bestVal,
        proInfoVal,
        os,
        'musicfab',
        '',
        i + 1,
      )
    }
  }
  // recordfab 数据
  const setRecordfabData = (os: string, _proInfo: any) => {
    const firstOptValue = '1Y'
    const optList = [firstOptValue, 'LFT', 'LFT']
    const recomTypeList = [firstOptValue, 'LFT', 'aio']
    const isBestList = [false, true, false]
    const dlgInfoTypeList = ['recordfab', 'recordfab', 'recordfab']
    const proInfoList = [_proInfo, _proInfo, state.relatedProInfo?.aio]
    // 用于获取相应位置对应的差异化数据 key
    const oprationKeyList = ['', 'lft', 'aio']
    for (let i = 0; i < 3; i++) {
      const optVal = optList[i]
      const recomTypeVal = recomTypeList[i]
      const bestVal = isBestList[i]
      const dlgInfoTypeVal = dlgInfoTypeList[i]
      const proInfoVal = proInfoList[i]
      const oprationKeyVal = oprationKeyList[i]
      state.recomPlanItems[i] = getRecomItem(
        optVal,
        recomTypeVal,
        dlgInfoTypeVal,
        bestVal,
        proInfoVal,
        os,
        'recordfab',
        oprationKeyVal,
        i + 1,
      )
    }
  }
  // 初始化方案 list
  const initPlanList = (os: string) => {
    let _proInfo = os === 'win' ? state.proInfo : state.macProInfo
    if (!_proInfo) {
      _proInfo = state.proInfo
    }
    state.dlgTitle = _proInfo.name
    state.proLine = _proInfo.productLine === 'dvdfab12' ? 'dvdfab' : _proInfo.productLine
    switch (state.proLine) {
      case 'dvdfab':
        setDvdfabData(os, _proInfo)
        break
      case 'streamfab':
        setSteamfabData(os, _proInfo)
        break
      case 'musicfab':
        setMusicfabData(os, _proInfo)
        break
      case 'recordfab':
        setRecordfabData(os, _proInfo)
        break
      case 'playerfab':
        setPlayerfabData(os, _proInfo)
        break
      case 'passkey':
        setPasskeyData(os, _proInfo)
        break
      case 'bookfab':
        setBookfabData(os, _proInfo)
        break
      case 'media_recover':
        setMediaRecoverData(os, _proInfo)
        break
      default:
        setDvdfabData(os, _proInfo)
        break
    }
  }
  /** -------------- 方案渲染 end ---------- */
  // 是否展示系统切换按钮
  const showSwitchOs = () => {
    // const macProInfo = getStrapiData(proInfo.related_products?.data[0])
    return !!state.macProInfo
  }
  // 获取当前页面主推的的 pid
  const getCurrentDlgPid = (os: string) => {
    const routeQuery = useRoute().query
    if (routeQuery?.open && routeQuery?.open === 'true' && state.isFristLoad) {
      if (routeQuery.dlg_pid) {
        return routeQuery.dlg_pid
      }
    }
    const curProInfo = useProInfo().value
    const curMacProInfo = useMacProInfo().value
    const _curPro = os === 'win' ? curProInfo : curMacProInfo?.pid ? curMacProInfo : curProInfo
    if (_curPro.type === 'single' || _curPro.type === 'bundle') {
      return _curPro.pid
    }
    return ''
  }
  const showDlgElk = () => {
    const poupTrackData = trackDataKey[state.proLine] || {}
    $trace.traceCustomEvent({
      event: 'show',
      event_category: 'buy_dlg',
      ...poupTrackData,
    })
  }
  // 系统切换按钮
  const switchTabHandle = (newVal: string) => {
    state.osText = newVal
    initPlanList(newVal)
    if (!reloadBtnData.reloadOs[newVal]) {
      reloadBtnData.reloadOs[newVal] = true
      reloadBtnData.value = false
      nextTick(() => {
        reloadBtnData.value = true
      })
    }
  }

  const { execute } = useBatchFetch()
  const getCurPagePids = (isLoaded: boolean) => {
    const buyDomList = document.querySelectorAll('*[data-buy-dlg="show"]')
    const pids = Array.from(buyDomList).flatMap((item: any) => item?.dataset?.pid)
    const routes = useRoute()
    if (isLoaded) {
      if (routes.query.open && routes.query.open === 'true' && routes.query.dlg_pid) {
        pids.push(routes.query.dlg_pid)
      }
    }
    return Array.from(new Set(pids))
  }

  // 获取基础数据
  const getBaseDataList = (isLoaded: boolean) => {
    const dlgTypeArr = [
      'tag',
      'normal',
      'dvdfab',
      'streamfab',
      'musicfab',
      'playerfab',
      'passkey',
      'bookfab',
      'recordfab',
      'mediarecover',
    ]
    const descList: any = []
    dlgTypeArr.forEach((item) => {
      descList.push(`${item}.descList`)
      descList.push(`${item}.specialGift`)
    })
    const pids = getCurPagePids(isLoaded)
    const proParams: any = {}
    for (let i = 0; i < pids.length; i++) {
      proParams[`[filters][pid][$in][${i}]`] = pids[i]
    }
    return execute([
      apiWorker.getProducts({
        ...proParams,
      }),
      apiWorker.getBuyDlgInfo({
        populate: [...dlgTypeArr, ...descList].join(','),
      }),
    ])
  }

  // 获取关联产品信息
  const getRelatedProductList = (relatedPids: any) => {
    const defaultPayParams = {
      token: 'HtwM6QLZwmtA205V55lvU4HgFGFq8e',
      domain_root: 'dvdfab',
    }
    const defaultPayQuery = apiWorker.getDefaultPay(defaultPayParams)

    // 获取 Country code
    const countryCodeQuery = apiWorker.getCountryInfo({ ip })
    // 获取支付通道
    // 请求所有适用订阅通道
    const paywaysBody: any = {
      domain_root: 'dvdfab',
      order_type: 'subcribe',
      ip, // : '45.77.179.243', 美国ip
      language: locale,
      currency: currency[0],
      exchange: currency[0],
    }
    const paywaysQuery = apiWorker.getPayInfo(paywaysBody)

    const queryList: any = [defaultPayQuery, countryCodeQuery, paywaysQuery]

    const proParams: any = {}
    for (let i = 0; i < relatedPids.length; i++) {
      proParams[`[filters][pid][$in][${i}]`] = relatedPids[i]
    }
    queryList.push(
      apiWorker.getProducts({
        ...proParams,
      }),
    )
    return execute(queryList)
  }
  // 获取差异化价格接口
  const getProDiffPriceInfo = (os: string, diffPriceKeys: any, proLine: string) => {
    const email = getCurrentEmail() as string
    if (
      ['dvdfab', 'streamfab', 'passkey', 'playerfab', 'bookfab', 'recordfab', 'media_recover'].includes(
        proLine,
      )
    ) {
      const isMobile = useStore.common().mobile
      const params = {
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
          app_id: proLine,
          currency: currency[0],
          return_options: true,
        },
        debug_user_info: true,
        operation_keys: diffPriceKeys,
      }
      const diffQuery = apiWorker.getProDiffPrice(params)
      return execute([diffQuery])
    }
    return new Promise((resolve) => {
      resolve({})
    })
  }

  // 设置产品信息
  const setCurProductInfo = (products: any, _osText: string, pid?: number) => {
    const _pid = pid || getCurrentDlgPid(_osText)
    let _proInfo =
      products.length > 0 ? (_pid ? products.find((item: any) => +item.pid === +_pid) : products[0]) : {}
    let _relatedProInfo = _proInfo?.pid ? getStrapiData(_proInfo.related_products?.data[0]) : {}
    // 第一次不存在时 在关联数据中查找
    if (!_proInfo) {
      const relatedProducts = products.flatMap((item: any) =>
        item.related_products ? getStrapiData(item.related_products?.data[0]) : [],
      )
      _proInfo =
        relatedProducts.length > 0
          ? _pid
            ? relatedProducts.find((item: any) => +item.pid === +_pid)
            : relatedProducts[0]
          : {}
      const relatedPro = getStrapiData(_proInfo.related_products?.data[0])
      _relatedProInfo = products.find((item: any) => +item.pid === +relatedPro.pid)
    }
    // 仍然不存在时，取默认
    if (!_proInfo) {
      // eslint-disable-next-line no-console
      console.error('useProBuyDlg.setCurProductInfo: Not Match Product with ' + _pid)
      _proInfo = products.length > 0 ? products[0] : {}
      _relatedProInfo = getStrapiData(_proInfo.related_products?.data[0])
    }
    state.proInfo = _proInfo.system === 'win' ? _proInfo : _relatedProInfo
    state.macProInfo = _proInfo.system === 'win' ? _relatedProInfo : _proInfo
    const proLine = _proInfo.productLine === 'dvdfab12' ? 'dvdfab' : _proInfo.productLine
    state.proLine = proLine
    // win mac正常显示此mac弹窗
    if (routeName === 'mac_blu_ray_player') {
      state.proInfo = state.macProInfo = _proInfo
    }
    const hasMac = !!state.macProInfo
    _osText = hasMac ? _osText : 'win'
    state.osText = _osText
    reloadBtnData.reloadOs[_osText] = true
  }

  // 获取差异价格数据
  const loadDiffData = () => {
    const oprationKeys = getOprationKeys(state.osText, state.proLine)
    if (oprationKeys.length) {
      getProDiffPriceInfo(state.osText, oprationKeys, state.proLine)
        .then((resList3: any) => {
          loadingStatus.value = false
          if (resList3[0].data) {
            state.productDiffInfo = resList3[0].data?.details?.product
            state.userTagsRes = resList3[0].data?.details?.user_info?.tags
            initPlanList(state.osText)
          } else {
            initPlanList(state.osText)
          }
          useDlgData().value = state
        })
        .catch(() => {
          loadingStatus.value = false
          initPlanList(state.osText)
        })
    } else {
      loadingStatus.value = false
      useDlgData().value = state
      initPlanList(state.osText)
    }
  }

  // 请求数据
  const loadData = () => {
    loadingStatus.value = true
    const _osText = useOs().value as string
    getBaseDataList(true)
      .then((resList: any) => {
        if (resList[1].data) {
          state.dialogData = resList[1].data?.attributes || {}
          state.safeguardListData = []
          for (let i = 1; i <= 4; i++) {
            if (state.dialogData[`safeguardText${i}`]) {
              state.safeguardListData.push({
                icon: state.dialogData[`safeguardIcon${i}`],
                text: state.dialogData[`safeguardText${i}`],
              })
            }
          }
          useDlgData().value = state
        }
        if (resList[0].data) {
          state.products = resList[0].data.flatMap((product: any) => {
            return product.attributes || []
          })
          // 设置产品信息
          setCurProductInfo(state.products, _osText)
          state.isFristLoad = false
          if (props.modelValue) {
            showDlgElk()
          }
          // 获取关联产品信息
          const relatedMap = relatedProductMap[state.proLine]
          getRelatedProductList(Object.values(relatedMap))
            .then((resList2: any) => {
              if (resList2[0].data) {
                const defaultPay = resList2[0].data || {}
                state.defaultPay = { ...state.defaultPay, ...defaultPay }
                useStore.product().setDefaultPay(state.defaultPay)
              }
              if (resList2[1].data) {
                state.countryCode = resList2[1].data?.country_code || '-'
                if (resList2[2].data) {
                  const resList31Data = resList2[2].data
                  // 过滤所有符合条件的一抛订阅通道(国家)
                  const subPayList = getPayMethods({
                    orderType: 'subcribe',
                    list: (resList31Data as any) || [],
                    lang: locale,
                    country_code: state.countryCode,
                    first_pay: '',
                  })
                  const pay = getPayMethod({
                    randomNum: randomNum.value,
                    filterPayList: subPayList,
                    orderType: 'subcribe',
                    countryCode: state.countryCode,
                    card: '',
                    cy: currency[0],
                    // 订阅产品
                    productList: [state.proInfo],
                  })
                  state.payways = pay || {}
                }
              }
              if (resList2[3].data) {
                const resData2 = resList2[3].data
                for (const key in relatedMap) {
                  const relatedInfo = resData2.find((pro: any) => pro.attributes?.pid === relatedMap[key])
                  state.relatedProInfo[key] = relatedInfo?.attributes || {}
                }
                loadDiffData()
              }
            })
            .catch(() => {
              loadingStatus.value = false
              initPlanList(_osText)
            })
        }
        // console.log(resList, 'res')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    nextTick().then(() => {
      setTimeout(() => {
        loadData()
      }, 30)
    })
  })

  // 新版本
  watch(
    () => props.modelValue,
    (newVal) => {
      // 弹窗打开 & loadingStatus.value 为 false(表示请求已经加载完成)
      if (newVal && !loadingStatus.value) {
        let _osText = useOs().value as string
        const dlgData: any = useDlgData().value
        if (dlgData && Object.keys(dlgData).length) {
          const pids = [+dlgData.proInfo.pid]
          if (dlgData.macProInfo?.pid) {
            pids.push(dlgData.macProInfo.pid)
          }
          // 如果当前系统是 mac 且没有 mac 产品信息
          _osText = _osText === 'mac' && !dlgData.macProInfo ? 'win' : _osText
          for (const key in dlgData) {
            if (key in state) {
              state[key] = dlgData[key]
            }
          }
          if (pids.includes(+props.pid)) {
            setCurProductInfo(state.products, _osText, props.pid)
            showDlgElk()
            // 设置产品信息
            initPlanList(_osText)
            return
          }
          if (state.products.length) {
            // 设置产品信息
            setCurProductInfo(state.products, _osText, props.pid)
            loadingStatus.value = true
            loadDiffData()
          }
        }
      }
    },
  )
  return {
    ...toRefs(state),
    loadingStatus,
    trackDataKey,
    showSwitchOs,
    switchTabHandle,
    reloadBtnData,
  }
}
