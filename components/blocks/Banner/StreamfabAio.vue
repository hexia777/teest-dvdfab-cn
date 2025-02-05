<script setup lang="ts">
import type { ProductDiffPriceModal } from '~/apis/interface/products'
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'streamfab',
  },
  textTheme: {
    type: String,
    default: 'dark',
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
  // banner 按钮组信息
  btnList: {
    type: Array,
    default: () => [],
  },
  // 可播放视频的链接
  videoSrc: {
    type: String,
    default: '',
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
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

const macData: any = useAttrs().macData || props
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const proInfo = useProInfo().value || {}
const relatedProducts = useMacProInfo().value
let diffPrices = reactive(useProDiffPrice().value)
const osText = ref('win')
osText.value = useStore.common().client

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
      tag: 'a',
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

const reloadBtnData = reactive({
  reloadOs: {
    win: false,
    mac: false,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
})

const loading = ref(false)

const bannerInfo = reactive({
  userType: '',
  title: '',
  desc: '',
  priceGiftInfo: {},
  btnList: [] as Array<any>,
})

const showVideo = ref<boolean>(false)

const typeMapKey: any = {
  new: 'new',
  aio_all: 'new',
  sub: 'new',
  single_upgrade: 'upgrade',
  mycombo_upgrade: 'upgrade',
  aio_upgrade: 'complement',
}

const playVideo = () => {
  showVideo.value = true
}
const closeMask = () => {
  showVideo.value = false
}

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
  if (!_curProInfo) {
    _curProInfo = proInfo
  }
  // 获取价格信息
  const priceInfo = getUpgradePriceInfo(_curProInfo, diffPrices, 'new')
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
  const productAttrs = proInfo.product_attrs?.data || []
  if (productAttrs && productAttrs.length) {
    const giftMediaTags = productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
    if (giftMediaTags) {
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
  const standardLabel =
    bannerInfo.userType === 'new'
      ? commomJson.standard_price
      : commomJson?.per_pro.replace('{num}', translatePrice(avgPrice, currency[1], locale) as string) +
        ' X ' +
        noLftOnline
  const finalLabel = bannerInfo.userType === 'new' ? commomJson.final_price : commomJson.upgrade_price
  bannerInfo.priceGiftInfo = {
    standardLabel,
    standardPrice: translatePrice(
      priceInfo?.price?.origin_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    finalLabel,
    finalPrice: translatePrice(
      priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    giftList: bannerInfo.userType !== 'complement' ? giftText : [],
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
      const extParams = getUpgradeExtParams(priceInfo, _curProInfo, 'streamfab', 'upgrade_license')
      btn.info.href = getBuyUrl(
        _curProInfo,
        propsInfo,
        priceInfo.price,
        extParams,
        'LFT',
        bannerInfo.userType,
      )
      btn.exposure = getElkParams('show', _curProInfo, extParams)
      btn.click = getElkParams('buy_now', _curProInfo, extParams)

      if (type === 'new') {
        btn.info.label = commomJson.buy_now
        btn.info.showIcon = true
      } else {
        btn.info.label = commomJson.upgrade_now
        btn.info.showIcon = true
      }
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
renderInfoHandle(osText.value, false)
loading.value = true

watch(
  () => useOs().value,
  (newVal) => {
    renderInfoHandle(newVal)
  },
)

onMounted(() => {
  const currentEmail = getCurrentEmail() as string
  setTimeout(() => {
    const pids = [proInfo.pid]
    if (relatedProducts) {
      pids.push(relatedProducts.pid)
    }
    loadDiffPrice(osText.value, pids, currentEmail, 'streamfab').then((res) => {
      loading.value = false
      if (res.data.value?.cscode === 200 && res.data.value.data?.details) {
        useProDiffPrice().value = res.data.value.data?.details?.product
        diffPrices = useProDiffPrice().value
        renderInfoHandle(osText.value)
      }
    })
  }, 200)
})
</script>
<template>
  <BlocksBannerHTextBtnsImg
    v-bind="{ ...props, ...$attrs, ...bannerInfo, imgClass: 'float-up-down', reloadBtnData }"
  >
    <template #middle>
      <div class="flex mb40">
        <el-skeleton :loading="loading" animated class="dark">
          <template #template>
            <el-skeleton-item variant="h3" class="w100%! max-w-503 h128!" />
          </template>
          <template #default>
            <PagesProductGiftBox v-bind="bannerInfo.priceGiftInfo" />
          </template>
        </el-skeleton>
      </div>
    </template>
    <template #img-extra>
      <div v-if="videoSrc" class="video-box flex-center b-rd-100%" @click="playVideo">
        <i class="iconfont-sg icon-circle-play font-size-48"></i>
      </div>
      <div v-if="showVideo" class="mask_video" @click="closeMask">
        <div class="mask_video_ai tc">
          <div style="padding-top: 64.28%">
            <iframe
              v-if="videoSrc"
              :src="videoSrc"
              width="1000"
              height="700"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
              class="iframe_mask"
              title="vimeo"
              :lazy="false"
            ></iframe>
          </div>
        </div>
      </div>
    </template>
  </BlocksBannerHTextBtnsImg>
</template>
<!-- 弹窗 -->
<style lang="less" scoped>
.video-box {
  width: 94px;
  height: 94px;
  color: @primary-color;
  border: 8px solid @bg-sf-color;
  background-color: #b9e4fc;
  cursor: pointer;
  transition: background-color 0.1s;
  position: absolute;
  right: 0;
  &:hover {
    background-color: #92d6fa;
  }
}
.mask_video {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 111;
  left: 0;
  top: 0;
  .mask_video_ai {
    width: 98%;
    max-width: 700px;
    position: absolute;
    top: 36%;
    left: 44%;
    transform: translateX(-50%) translateY(-50%);
  }
  iframe {
    width: 900px;
    height: 700px;
  }
}
</style>
