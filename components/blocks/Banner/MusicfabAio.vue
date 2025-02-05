<script setup lang="ts">
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: '',
  },
  textTheme: {
    type: String,
    default: '',
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})

const { getDefaultPriceInfo, getPriceByOpt, getBuyUrl, getElkParams } = useProductDiffPrice()
const macData: any = useAttrs().macData || props
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const proInfo = useProInfo().value || {}
const relatedProducts = useMacProInfo().value
const osText = ref('win')
osText.value = useStore.common().client
const reloadBtnData = reactive({
  reloadOs: {
    win: true,
    mac: true,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
})
const defaultBtnList = [
  {
    info: {
      href: '/',
      showIcon: true,
      label: commomJson.try_for_free,
      theme: 'primary',
      os: osText,
      size: 'large',
      slug: proInfo.slug,
    },
    component: 'MyButtonDownload',
    tipText: commomJson.download_info,
    tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
  },
  {
    info: {
      href: '/',
      size: 'large',
      showIcon: true,
      label: commomJson.buy_now,
      theme: 'primary',
      slug: proInfo.slug,
      tag: 'div',
      click: () => {
        // if (window?.dlgShow) {
        // window?.dlgShow()
        // }
      },
    },
    component: 'MyButtonBuy',
    tipText: '',
    tipIconClass: '',
  },
]

const typeMapKey: any = {
  is_new_user: 'new',
  upgrade_user: 'upgrade',
  complete_user: 'complement',
}

const bannerInfo = reactive({
  userType: '',
  title: '',
  desc: '',
  priceGiftInfo: {},
  btnList: [] as Array<any>,
})

const getAmazonCouponValue = (_proInfo: any) => {
  let amazonCp = _proInfo.amazon?.find((item: any) => item.key === currency[0])
  amazonCp = amazonCp || _proInfo.amazon?.find((item: any) => item.key === 'USD')
  if (amazonCp) {
    const text = translatePrice(amazonCp?.value, currency[1], locale) as string
    return text.replace(/(\.00)|(,00)/g, '')
  }
  return ''
}

const renderInfoHandle = (os: string, isClient = true) => {
  let propsInfo: any = os === 'win' ? props : macData
  if (!propsInfo) {
    propsInfo = props
  }
  let _curProInfo = os === proInfo.system ? proInfo : relatedProducts
  const clientInfo = getStrapiData(_curProInfo.client_info)
  if (!_curProInfo) {
    _curProInfo = proInfo
  }

  // 获取价格信息
  const priceInfo = {
    options: {
      has_lft_options_num: 0,
      has_nlt_options_num: 0,
      has_online_lft_options_num: 0,
      has_online_nlt_options_num: 0,
      has_online_options_num: 0,
      has_options_num: 0,
      total_options_num: _curProInfo.products.data.length,
    },
    user_tag_type: 'is_new_user',
    price: getDefaultPriceInfo(proInfo),
  }
  const type = typeMapKey[priceInfo.user_tag_type]
  bannerInfo.userType = type
  // 总数
  const totalProNum = priceInfo.options?.total_options_num
  // 拥有在线 LFT
  const hasLftOnline = priceInfo.options?.has_online_lft_options_num
  const noLftOnline = totalProNum - hasLftOnline
  _curProInfo.amazon = _curProInfo.amazon ? _curProInfo.amazon : proInfo.amazon
  const amazonPriceText = getAmazonCouponValue(_curProInfo)
  // 礼物部分
  let giftText = []
  let standardLabel = ''
  const productAttrs = proInfo.product_attrs?.data || []
  if (productAttrs && productAttrs.length) {
    const giftMediaTags = productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
    if (giftMediaTags) {
      standardLabel = giftMediaTags.attributes.desc
      giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
        if (bannerInfo.userType === 'complement') {
          return []
        }
        return {
          value: gText.value.replace('{num}', amazonPriceText),
        }
      })
    }
  }

  bannerInfo.title = _curProInfo.name
  bannerInfo.desc = props.desc?.replace('{num}', _curProInfo.products?.data.length)

  const avgPrice = priceInfo?.price?.payment_price / noLftOnline
  const _standardLabel =
    standardLabel ||
    (bannerInfo.userType === 'is_new_user'
      ? commomJson.standard_price
      : commomJson?.per_pro.replace('{num}', translatePrice(avgPrice, currency[1], locale) as string) +
        ' X ' +
        noLftOnline)
  const finalLabel = commomJson.final_price
  bannerInfo.priceGiftInfo = {
    standardLabel: _standardLabel,
    standardPrice: '',
    finalLabel,
    finalPrice: translatePrice(
      priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    giftList: priceInfo.user_tag_type !== 'complete_user' ? giftText : [],
  }
  bannerInfo.btnList = defaultBtnList.map((btn: any) => {
    if (btn.component === 'MyButtonDownload') {
      btn.info.os = os
      btn.info.href = _curProInfo.downloadUrl[0].url
      btn.info['data-warden-ck-parm'] = base64Encode({
        event_label: 'productpage_summary',
        pids: [_curProInfo.pid],
      })
    } else if (btn.component === 'MyButtonBuy') {
      btn.info['data-vars-bpid'] = _curProInfo.pid
      btn.info.href = getBuyUrl(_curProInfo, propsInfo, priceInfo.price as any, {}, 'LFT')
      // btn.exposure = getElkParams('show', _curProInfo, {})
      btn.click = getElkParams('buy_now', _curProInfo, {})
      btn.info.price = priceInfo?.price?.payment_price || getPriceByOpt(_curProInfo)
      if (bannerInfo.userType !== 'new') {
        btn.info.showIcon = true
        btn.info.label = commomJson.upgrade_now
      } else {
        btn.info.label = commomJson.buy_now
      }
      btn.info.tag = 'a'
    }
    return btn
  })
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
renderInfoHandle(osText.value)

watch(
  () => useOs().value,
  (newVal) => {
    renderInfoHandle(newVal)
  },
)
</script>
<template>
  <BlocksBannerHTextBtnsImg v-bind="{ ...props, ...$attrs, ...bannerInfo, reloadBtnData }" class="music-aio">
    <template #middle>
      <div class="flex mb40">
        <PagesProductGiftBox v-bind="bannerInfo.priceGiftInfo" />
      </div>
    </template>
  </BlocksBannerHTextBtnsImg>
</template>
<style lang="less" scoped>
.gift-info {
  border: 1px solid @border-gray1;
  border-radius: @b-radius-sm;
  padding: 10px 20px 10px 24px;
  position: relative;
}
.gift-icon {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: @b-radius-lg;
  background-color: @secondary-color;
  left: -13px;
}

:deep(.music-aio) {
  .ptb-desc {
    font-weight: bold;
    span {
      display: inline-block;
    }
    p {
      position: relative;
      padding-left: 20px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @base-text-color;
        position: absolute;
        left: 0;
        top: 12px;
      }
    }
  }
}
</style>
