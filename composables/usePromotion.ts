import type {
  PromotionAttrModel,
  HeadBannerAttrs,
  FloatBannerAttrs,
  ResourceBannerAttrs,
} from '~/apis/interface/promotion'
import {
  hideBannerRoute,
  noHheaderPages,
  nonShowFloatBannerPages,
  twoScreentwoShowFloatBannerPages,
} from '~/config/promotion/layoutRoute'

import pageType from '~/config/promotion/page_type.json'
import basic_info from '~/config/promotion/basic_info.json'
// import productStreamfabJson from '~/config/route/productRoutes/streamfabProductRoutes.json'
// import productMusicfabJson from '~/config/route/productRoutes/musicfabProductRoutes.json'
// import productDvdfabJson from '~/config/route/productRoutes/dvdfabProductRoutes.json'

// const getAllValues = (data: any) => {
//   let values: any = []
//   for (const key in data) {
//     values = [...values, ...data[key]]
//   }
//   return values
// }

// const proLineMapList = [
//   {
//     key: 'dvdfab',
//     values: getAllValues(productDvdfabJson),
//   },
//   {
//     key: 'streamfab',
//     values: getAllValues(productStreamfabJson),
//   },
//   {
//     key: 'musicfab',
//     values: getAllValues(productMusicfabJson),
//   },
// ]

// const promotionDataByProLine: any = promotionDataByProLine

export const usePromotionRequest = async () => {
  usePromotionSetProductLine()
  const { apiPromotion } = useApi()
  // apiPromotion.promotion(
  //   {
  //     locale: useStore.common().locale,
  //     // 'filters[$or][0][proLine][$eq]': useStore.promotion().productLine,
  //     // 'filters[$or][1][relatedRoute][value][$eq]': routeName || '',
  //   },
  //   { key: 'promotion' },
  // )
  await apiPromotion.promotion(
    {
      locale: useStore.common().locale,
      // 'filters[$or][0][proLine][$eq]': useStore.promotion().productLine,
      // 'filters[$or][1][relatedRoute][value][$eq]': routeName || '',
    },
    { key: 'promotion' },
  )
}
// 应该展示什么样的活动
const usePromotionSetProductLine = () => {
  if (['/convert-success.htm', '/thankyou.htm'].includes(useRoute().path)) {
    // 客户端特定路由加载活动配置
    if (useRoute().query.c_app) {
      const promotion_basic_info = basic_info as { [key: string]: any }
      for (const key in promotion_basic_info) {
        if (
          promotion_basic_info[key].client_apps &&
          promotion_basic_info[key].client_apps.includes(useRoute().query.c_app)
        ) {
          useStore.promotion().setProductLine(key)
          break
        }
      }
    }
  } else {
    const pageTypes = pageType as { [key: string]: string[] }
    for (const key in pageTypes) {
      if (pageTypes[key].includes(useRoute().path)) {
        useStore.promotion().setProductLine(key)
      }
    }
  }
}

// 是否需要加载活动信息
export const usePromotionData = () => {
  return { need: !hideBannerRoute.includes(useRoute().name as string) }
}

export const usePromotion = () => {
  const locale = useStore.common().locale
  // const routeName = useRoute().name
  // const proLineMap = proLineMapList.find((proLineObj) => proLineObj.values.includes(routeName))
  const state = reactive<{
    blockData: any[]
    pageData: PromotionAttrModel
    headData: HeadBannerAttrs
    floatData: FloatBannerAttrs
    resouceData: ResourceBannerAttrs
    // visibleBanner: boolean
    proLine: string
    pageBaseInfo: any
  }>({
    blockData: [],
    pageData: {} as PromotionAttrModel,
    headData: {} as HeadBannerAttrs,
    floatData: {} as FloatBannerAttrs,
    resouceData: {} as ResourceBannerAttrs,
    // visibleBanner: true,
    proLine: '',
    pageBaseInfo: {} as any,
  })
  const cacheProLineData = () => {
    const { data: res } = useNuxtData('page-data')
    state.pageBaseInfo = res.value
    state.proLine = res.value?.product_line
    useStore.promotion().setProductLine(res.value?.product_line)
  }
  cacheProLineData()
  state.proLine = useStore.promotion().productLine
  const formatPromotionData = (res: any, _proLine: string) => {
    if (res.length) {
      const resData = res[0].attributes
      // state.visibleBanner = true
      state.blockData = resData.blocks
      state.headData = {
        ...resData?.headBanner,
        img: getStrapiData(resData.headBanner?.media),
        titleStyle: getStyleData(resData.headBanner?.titleStyle),
        closeIconStyle: getStyleData(resData.headBanner?.closeIconStyle),
        btnStyle: getStyleData(resData.headBanner?.btnStyle),
      }
      state.floatData = {
        ...resData?.floatBanner,
        img: getStrapiData(resData.floatBanner?.media),
        titleStyle: getStyleData(resData.floatBanner?.titleStyle),
        closeIconStyle: getStyleData(resData.floatBanner?.closeIconStyle),
        btnStyle: getStyleData(resData.floatBanner?.btnStyle),
      }
      state.resouceData = {
        ...resData?.articleBanner,
        img: getStrapiData(resData.articleBanner?.media),
      }
      state.pageData = { ...resData, promotionPid: resData.promotionPid + '' }
      // if (
      //   useCookie(`close_coupon_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}}`)
      //     .value
      // ) {
      //   state.visibleBanner = false
      // }
      // } else {
      //   state.visibleBanner = false
    }
  }
  // const baseConfigData = computed(() => {
  //   const _config = promotionDataByProLine[state.proLine] || promotionDataByProLine.dvdfab
  //   return _config[locale] || _config.en
  // })
  // 获取数据
  const getPromotionDataCache = () => {
    formatPromotionData(getPromotionInfo(), state.proLine)
  }

  const getPromotionInfo = () => {
    const { data: res } = useNuxtData('promotion')
    let newData = []
    if (res.value && res.value.data) {
      newData = res.value.data.filter((item: any) => item.attributes.proLine === 'common')
      for (const item of res.value.data) {
        const data = getStrapiData(item)
        // 属于产品线或者关联路由,并且不在禁用路由中
        if (
          (data.proLine === state.proLine ||
            data.relatedRoute.filter((item: any) => item.value === useRoute().name).length) &&
          !data.disabledRoute.filter((item: any) => item.value === useRoute().name).length
        ) {
          newData = [item]
          break
        }
      }
    }
    return newData
  }

  const setCookieSuffix = () => {
    const res = getPromotionInfo()
    if (res.length) {
      const resData = res[0].attributes
      if (resData.cookieSuffix) {
        useStore.promotion().setCookieSuffix(resData.cookieSuffix)
      }
    }
  }

  // unifab 文章不显示活动入口
  const isUnifabArticle =
    useStore.promotion().productLine === 'unifab' && state.pageBaseInfo?.promotion_url_type === 'article'

  const isHeaderBannerShow = computed(() => {
    return (
      !useCookie(`close_coupon_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`)
        .value && !noHheaderPages.includes(useRoute().name as string)
    )
  })

  const isFloatBannerShow = computed(() => {
    return (
      !useStore.common().mobile &&
      !useCookie(`close_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`).value &&
      !useCookie(`pop_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`).value &&
      !useCookie(`close_float_banner_session`).value &&
      !nonShowFloatBannerPages.includes(useRoute().name as string)
    )
  })

  // 是否第二屏展示
  const twoScreentwoShowFloatBanner = ref(true) // 所有页面首屏都不加载活动floatbanner
  // const twoScreentwoShowFloatBanner = computed(() => {
  //   const routeName = useRoute().name as string
  //   return twoScreentwoShowFloatBannerPages.includes(routeName) || useStore.common().pageType === 'product'
  // })

  const getBannerEventData = (event: string, eventLabel: string, eventValue: string = '') => {
    const data: { [key: string]: any } = {}
    if (eventValue) {
      data.event_value = eventValue
    }
    const promotionIds =
      state.pageData.promotionPid && state.pageData.promotionPid !== 'null'
        ? state.pageData.promotionPid.split(',')
        : []
    if (promotionIds.length) {
      data.promotion_id = promotionIds
    }
    return {
      event,
      event_label: eventLabel,
      ext_params_str_param5: state.pageData.tag,
      ext_params_str_param1: 'promotion_' + state.proLine,
      event_category: 'campaign',
      ...data,
    }
  }

  const handleCloseHeaderBanner = () => {
    const cookieName = `close_coupon_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`
    clientSetCookie(cookieName, 'close', 7)
    // useCookie(, {
    //   maxAge: 60 * 60 * 24 * 7,
    // }).value = 'close'
    const ele = document.getElementById('promotion-header-banner')
    if (ele) {
      ele.style.display = 'none'
    }
    const ele2 = document.querySelector('[data-has-headbanner]')
    if (ele) {
      ele2?.setAttribute('data-has-headbanner', '')
    }
  }

  const getStyleData = (style: any) => {
    if (!style) {
      return {}
    }
    const styleData: { [key: string]: string } = {}
    style.forEach((item: any) => {
      styleData[item.key] = item.value
    })
    return styleData
  }

  return {
    ...toRefs(state),
    locale,
    isHeaderBannerShow,
    isFloatBannerShow,
    twoScreentwoShowFloatBanner,
    setCookieSuffix,
    cacheProLineData,
    getPromotionDataCache,
    getBannerEventData,
    handleCloseHeaderBanner,
  }
}
