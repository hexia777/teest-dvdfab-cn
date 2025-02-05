<script setup lang="ts">
const props = defineProps({
  os: { type: String, default: 'win' },
  title: { type: String, default: '' },
  desc: {
    type: String,
    default: '',
  },
  upgradeDesc: {
    type: String,
    default: '',
  },
  newProductDesc: {
    type: String,
    default: '',
  },
  bgImg: {
    type: Object,
    default: () => {
      return {
        win: '',
        mac: '',
      }
    },
  },
  // box 图片
  media: {
    type: Object,
    default: () => {
      return {
        url: 'https://assets.dvdfab.cn/passkey/box/742_834.png',
      }
    },
  },
  // box 图片
  diffMedia: {
    type: Object,
    default: () => {
      return {
        url: 'https://assets-test.dvdfab.cn/passkey/box/742.png',
      }
    },
  },
  // 是否展示 gift
  giftShow: {
    type: Boolean,
    default: true,
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  // banner 按钮组信息
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  bannerTips: {
    type: String,
    default: '',
  },
  productsPrice: {
    type: Array<any>,
    default: () => [],
  },
})

const {
  getCurrentEmail,
  getDefaultPriceInfo,
  loadDiffPrice,
  getPriceByOpt,
  getUpgradeExtParams,
  getElkParams,
  getBuyUrl,
  getUpgradePriceInfo,
} = useProductDiffPrice()
const priceGiftConfig = {
  theme: 'clear',
  giftIcon: 'icon-gift2 color-price2 font-size-22',
  finalPriceStyle: { color: '#ffe82a' },
}
const macData: any = useAttrs().macData || props
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commomStore = useStore.common()
const proInfo = useProInfo().value || {}
const macProInfo = useMacProInfo().value || {}
const hasMac = Object.keys(proInfo).length > 0 && Object.keys(macProInfo).length > 0

const relatedProducts = useMacProInfo().value
let diffPrices = reactive(useProDiffPrice().value)
const osText = ref('win')
osText.value = useStore.common().client

const skeletonLoading = ref(false)

const defaultBtnList = [
  {
    info: {
      href: '/',
      size: 'large',
      showIcon: true,
      label: commomJson.buy_now,
      theme: 'orange',
      slug: proInfo.slug,
    },
    component: 'MyButtonBuy',
    tipText: '',
    tipIconClass: '',
  },
  {
    info: {
      href: '/',
      showIcon: true,
      label: commomJson.free_download,
      theme: 'white',
      osVersion: commomJson[osText + '_version'],
      os: osText,
      size: 'large',
      slug: proInfo.slug,
    },
    component: 'MyButtonDownload',
    tipText: commomJson.download_info,
    tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
  },
]

const reloadBtnData = reactive({
  reloadOs: {
    win: false,
    mac: false,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
})

const bannerInfo = reactive({
  title: '',
  desc: '',
  bgImg: {} as any,
  upgradeDesc: '',
  newProductDesc: '',
  boxImg: {} as any,
  giftShow: true,
  giftImgs: [] as any,
  priceGiftInfo: {},
  btnList: [] as Array<any>,
  childPros: [] as Array<any>,
  freeProduct: {} as any,
  bannerTips: '',
  couponText: '',
  type: '', // new upgrade
  isCompleteAio: false, // 是否补全
  timeEndShow: false,
  timeEnd: 0,
})

const getAmazonCouponValue = (_proInfo: any) => {
  let amazonCp = _proInfo.amazon.find((item: any) => item.key === currency[0])
  amazonCp = amazonCp || _proInfo.amazon.find((item: any) => item.key === 'USD')
  const text = translatePrice(amazonCp.value, currency[1], locale) as string
  return text.replace(/(\.00)|(,00)/g, '')
}

const renderInfoHandle = (os: string, isClient = true) => {
  let propsInfo: any = os === 'win' ? props : macData
  if (!propsInfo) {
    // todo
    propsInfo = props
  }
  let _curProInfo = os === 'win' ? proInfo : proInfo
  if (!_curProInfo) {
    _curProInfo = proInfo
  }
  const clientInfo = getStrapiData(_curProInfo.client_info)

  // 获取价格信息
  // todo 解开此注释正常显示升级价格
  // const priceInfo = getUpgradePriceInfo(_curProInfo, diffPrices) || {
  const priceInfo = {
    pid: _curProInfo.pid,
    options: {
      has_lft_options_num: 0,
      has_nlt_options_num: 0,
      has_online_lft_options_num: 0,
      has_online_nlt_options_num: 0, // 拥有非 lft 产品
      has_online_options_num: 0,
      has_options_num: 0,
      total_options_num: _curProInfo.products?.data.length,
    },
    user_tag_type: 'is_new_user',
    price: getDefaultPriceInfo(proInfo),
  }

  const type = ['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type) ? 'upgrade' : 'new'
  bannerInfo.type = type
  bannerInfo.timeEndShow = type !== 'upgrade'
  _curProInfo.amazon = _curProInfo.amazon ? _curProInfo.amazon : proInfo.amazon
  const amazonPriceText = getAmazonCouponValue(_curProInfo)
  // 礼物部分
  let giftText = []
  let giftImgs = []
  let freeProduct = {}
  const productAttrs = _curProInfo.product_attrs?.data || []
  if (productAttrs && productAttrs.length && priceInfo.user_tag_type !== 'complete_user') {
    bannerInfo.giftShow = true
    const giftNameType = ['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)
      ? priceInfo.user_tag_type
      : 'products'
    const giftMediaSlug = os === 'win' ? 'passkey-gift-product' : 'passkey-gift-product'
    const giftMediaTags = productAttrs.find((giftItem: any) => {
      return giftItem.attributes.slug === giftMediaSlug && giftItem.attributes.name === giftNameType
    })
    const giftProducts = productAttrs.filter(
      (giftItem: any) =>
        giftItem.attributes.type === 'gift-product' && giftItem.attributes.name === giftNameType,
    )
    if (giftMediaTags) {
      const mediaData = giftMediaTags.attributes?.media?.data || []
      giftImgs = mediaData?.map((gImg: any) => {
        return gImg.attributes.url
      })
      giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
        return { value: gText.value.replace('{num}', amazonPriceText) }
      })
    }
    const giftSlug = os === 'win' ? 'passkey-gift-product' : 'passkey-gift-product'
    const giftProduct = giftProducts.find(
      (giftPro: any) => giftPro.attributes.slug === giftSlug && giftPro.attributes.name === giftNameType,
    )
    if (giftProduct) {
      const tags = giftProduct.attributes.tags
      freeProduct =
        tags && tags.length
          ? {
              name: tags[0].value,
              price: tags[2].value,
              tag: tags[1].value,
            }
          : {}
    }
  } else {
    bannerInfo.giftShow = false
  }
  // 子产品 优惠价格和免费产品
  bannerInfo.childPros = []
  props.productsPrice.forEach((proPrice: any) => {
    let obj = {}
    _curProInfo?.products?.data?.forEach((pro: any) => {
      const item = getStrapiData(pro)
      if (+item?.pid === +proPrice?.key) {
        const priceKey = item?.price?.find((itm: { key: any }) => itm.key === 'LFT')
        obj = {
          pid: item.pid,
          key: item.productLine,
          name: item.name,
          url: '/' + item.slug + '.htm',
          price: priceKey?.value,
          oldPrice: '',
          hot: item?.product_attrs?.data[0]?.attributes?.slug === 'hot',
        }
      }
    })
    bannerInfo.childPros.push(obj)
  })

  bannerInfo.title = _curProInfo.name + ` (${commomJson.lifetime})`
  bannerInfo.desc = propsInfo.desc?.replace('{num}', _curProInfo.products?.data.length)
  const upgradeDesc = propsInfo.upgradeDesc || props.upgradeDesc
  const paymentPrice = translatePrice(
    priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
    `<span class='currency'>${currency[1]}</span>`,
    locale,
  )
  bannerInfo.upgradeDesc = upgradeDesc
    .replace('{pro_name}', _curProInfo.name)
    .replace('{price}', paymentPrice)
  bannerInfo.newProductDesc = os === 'win' ? propsInfo.newProductDesc || props.newProductDesc : ''
  bannerInfo.bgImg = {
    win: '',
    mac: '',
  }
  const boxImg =
    bannerInfo.type !== 'new'
      ? propsInfo.diffMedia?.data
        ? getStrapiData(propsInfo.diffMedia)
        : getStrapiData(propsInfo.media)
      : getStrapiData(propsInfo.media)
  const imgSuffix = getProImg(priceInfo.pid + '_aio', locale)
  if (imgSuffix) {
    const _boxImg = proInfo.imgs.find((img: any) => img.label === 'basic')
    const urls = _boxImg.url.split('/box/')
    boxImg.url = urls[0] + '/box/' + imgSuffix
  }
  // 获取盒子图
  bannerInfo.boxImg = boxImg

  bannerInfo.giftImgs = giftImgs
  // 获取拥有产品数量信息
  const noLftNum = priceInfo.options?.total_options_num - priceInfo.options?.has_online_lft_options_num
  const avgPrice = priceInfo.options?.has_online_lft_options_num
    ? (priceInfo?.price?.payment_price / noLftNum).toFixed(2)
    : ''
  let avgText = ''
  if (type !== 'new') {
    avgText = commomJson?.per_pro.replace('{num}', translatePrice(avgPrice, currency[1], locale) as string)
    avgText = avgText + ' X ' + noLftNum
  }
  _curProInfo.pid = priceInfo.pid
  const extParams = getUpgradeExtParams(priceInfo, _curProInfo, 'passkey', 'aio_banner')
  bannerInfo.priceGiftInfo = {
    standardLabel: commomJson.standard_price + ':',
    standardPrice: translatePrice(
      priceInfo?.price?.origin_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    finalLabel: commomJson.final_price + ':',
    finalPrice: paymentPrice,
    avgPriceText: avgText,
    ...priceGiftConfig,
  }
  bannerInfo.freeProduct = freeProduct
  bannerInfo.bannerTips = propsInfo.bannerTips
  bannerInfo.btnList = defaultBtnList.map((btn: any) => {
    if (btn.component === 'MyButtonDownload') {
      btn.info.os = os
      btn.info.osVersion = clientInfo.systemVersion || ''
      btn.info.href = _curProInfo.downloadUrl[0].url
      btn.info['data-warden-ck-parm'] = base64Encode({
        event_label: 'productpage_summary',
        pids: [_curProInfo.pid],
      })
    } else if (btn.component === 'MyButtonBuy') {
      btn.info.href = getBuyUrl(
        _curProInfo,
        propsInfo,
        priceInfo?.price,
        extParams,
        'LFT',
        priceInfo.user_tag_type,
      )
      btn.exposure = getElkParams('show', _curProInfo, extParams)
      btn.click = getElkParams('buy_now', _curProInfo, extParams)
      if (type !== 'new') {
        btn.info.label = commomJson.upgrade_now
        btn.info.showIcon = true
      } else {
        btn.info.label = commomJson.buy_now
        btn.info.showIcon = true
      }
    }
    return btn
  })

  bannerInfo.couponText = priceInfo.price?.off_num
    ? commomJson.coupon_num_2.replace('{num}', priceInfo.price?.off_num)
    : ''

  bannerInfo.isCompleteAio = priceInfo.user_tag_type === 'complete_user'

  // 矫正购买按钮 show 上报
  if (isClient && !reloadBtnData.reloadOs[os]) {
    reloadBtnData.reloadOs[os] = true
    reloadBtnData.value = false
    nextTick(() => {
      reloadBtnData.value = true
    })
  }
  useReloadBtnData().value = reloadBtnData
}

const switchClick = (systemOs: string) => {
  osText.value = systemOs
  renderInfoHandle(systemOs)
}
renderInfoHandle(osText.value, false)
// if (getCurrentEmail()) {
//   skeletonLoading.value = true
// }
skeletonLoading.value = true
watch(
  () => useOs().value,
  (newVal) => {
    if (import.meta.browser) {
      renderInfoHandle(newVal)
    }
  },
)
onMounted(() => {
  const currentEmail = getCurrentEmail() as string
  nextTick(() => {
    const pids = [proInfo.pid]
    if (relatedProducts) {
      pids.push(relatedProducts.pid)
    }
    loadDiffPrice(osText.value, pids, currentEmail, 'playerfab')
      .then((res) => {
        if (res.data.value?.cscode === 200 && res.data.value.data?.details) {
          useProDiffPrice().value = res.data.value.data?.details?.product
          diffPrices = useProDiffPrice().value
          renderInfoHandle(osText.value)
          skeletonLoading.value = false
        } else {
          skeletonLoading.value = false
        }
      })
      .catch((err) => {
        console.error(err)
        skeletonLoading.value = false
      })
  })
})
</script>
<template>
  <div
    class="block-box has-bg banner-box"
    :class="[
      commomStore.mobile ? 'product-bgm' : '',
      !commomStore.mobile ? (osText == 'win' ? 'aio-banner' : 'aio-mac-banner') : '',
    ]"
  >
    <BaseContainer class="aio-banner-content-wrap">
      <PagesProductAioBannerPasskeyPlayerfab
        :banner-info="bannerInfo"
        :skeleton-loading="skeletonLoading"
        :reload-btn-data="reloadBtnData"
        :has-mac="hasMac"
        :os-text="osText"
        :gift-show="giftShow"
      />
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.aio-off-icon {
  width: fit-content;
  border-radius: 45px 60px 60px 0;
  color: #ffeb00;
  padding: 4px 12px 5px 9px;
  font-size: 1.25rem;
  display: inline-block;
  background: linear-gradient(270deg, #f71637, #ff4250);
}
.aio-banner {
  // background: #0d94f2 url('https://c6.dvdfab.cn/images/product/1x_m/en/passkey/banner_bg.png') no-repeat 50%;
  background: url('https://c6.dvdfab.cn/images/product/1x_m/en/passkey/banner_bg.png') no-repeat 50%;
  background-size: cover;
  position: relative;
  z-index: 2;
}
.aio-mac-banner {
  // background: #fe6a36 url('https://c6.dvdfab.cn/images/product/1x_m/en/passkey/banner_bg.png') no-repeat 50%;
  background: url('https://c6.dvdfab.cn/images/product/1x_m/en/passkey/banner_bg.png') no-repeat 50%;
  background-size: cover;
  position: relative;
  z-index: 2;
}

.product-bgm {
  background: linear-gradient(180deg, #20247b, #6a12a6);
}
</style>
