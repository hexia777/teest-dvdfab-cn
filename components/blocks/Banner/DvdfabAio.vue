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
        url: 'https://assets.dvdfab.cn/dvdfab/box/62037_no_amazon.png',
      }
    },
  },
  // box 图片
  diffMedia: {
    type: Object,
    default: () => {
      return {
        url: 'https://assets-test.dvdfab.cn/dvdfab/box/707.png',
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
      theme: 'white',
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

// 倒计时相关
// timeEndShow: this.$t('common_basic.dvdfab_aio_times_show'),
const timeUnits = {
  hours: commomJson.count_down_hour,
  mins: commomJson.count_down_min,
  secs: commomJson.count_down_sec,
  ms: commomJson.count_down_ms,
}

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
  freeProduct: {} as any,
  bannerTips: '',
  couponText: '',
  type: '', // new upgrade
  isCompleteAio: false, // 是否补全
  timeEndShow: true,
  timeEnd: 0,
})

// 获取倒计时信息
const getCountDownInfo = () => {
  const params = {
    loop: 1,
    time_date: JSON.stringify([
      {
        time_end: '2024-04-29 12:00:00',
        loop_seconds: '259200',
      },
    ]),
  }
  useApi()
    .apiCommon.countDownNews(params)
    .then((res: any) => {
      if (res.data.value?.cscode === 0) {
        const resData = res.data.value?.data
        bannerInfo.timeEnd = resData.time_end || 0
      }
      // const timestamp = new Date().getTime()
      // // 时间截至之后不显示倒计时
      // if (Date.parse(resData.time_end) > timestamp) {
      //   this.timesBoxShow = true
      // }
    })
}

const getAmazonCouponValue = (_proInfo: any) => {
  let amazonCp = _proInfo.amazon.find((item: any) => item.key === currency[0])
  amazonCp = amazonCp || _proInfo.amazon.find((item: any) => item.key === 'USD')
  const text = translatePrice(amazonCp.value, currency[1], locale) as string
  return text.replace(/(\.00)|(,00)/g, '')
}

const renderInfoHandle = (os: string, isClient = true) => {
  let propsInfo: any = os === 'win' ? props : macData
  if (!propsInfo) {
    propsInfo = props
  }
  let _curProInfo = os === 'win' ? proInfo : relatedProducts
  const clientInfo = getStrapiData(_curProInfo.client_info)
  if (!_curProInfo) {
    _curProInfo = proInfo
  }
  // 获取价格信息
  const priceInfo = getUpgradePriceInfo(_curProInfo, diffPrices, 'is_new_user')
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
      : 'is_new_user'
    const giftMediaSlug = os === 'win' ? 'all-in-one-gift-common' : 'all-in-one-mac-gift-common'
    const giftMediaTags = productAttrs.find(
      (giftItem: any) =>
        giftItem.attributes.slug === giftMediaSlug && giftItem.attributes.name === giftNameType,
    )
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
    const giftSlug = os === 'win' ? 'all-in-one-gift-product' : 'all-in-one-mac-gift-product'
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
  bannerInfo.title = _curProInfo.name + ` (${commomJson.lifetime})`
  bannerInfo.desc = propsInfo.desc?.replace('{num}', _curProInfo.products?.data.length)
  const upgradeDesc = propsInfo.upgradeDesc || props.upgradeDesc
  const paymentPrice = translatePrice(
    priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
    currency[1],
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
      ? propsInfo.diffMedia.data
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
  const extParams = getUpgradeExtParams(priceInfo, _curProInfo, 'dvdfab', 'aio_banner')
  bannerInfo.priceGiftInfo = {
    standardLabel: commomJson.standard_price,
    standardPrice: translatePrice(
      priceInfo?.price?.origin_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    finalLabel: commomJson.final_price,
    finalPrice: paymentPrice,
    avgPriceText: avgText,
    ...priceGiftConfig,
    giftList: giftText,
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
    ? commomJson.coupon_num.replace('{num}', priceInfo.price?.off_num)
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
    getCountDownInfo()
    loadDiffPrice(osText.value, pids, currentEmail, 'dvdfab')
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
    <BaseContainer class="aio-banner-content">
      <div class="container-content">
        <div class="left">
          <h1 v-if="commomStore.mobile" class="title text-center c-white mb40" v-html="bannerInfo.title"></h1>
          <!-- 盒子图 -->
          <div class="img-box" :class="{ 'opacity-full': skeletonLoading }">
            <img
              width="510"
              height="510"
              layout="responsive"
              style="max-width: 510px"
              :src="bannerInfo.boxImg?.url"
              :alt="bannerInfo.boxImg?.alternativeText || bannerInfo.title"
            />
            <!-- 折扣 -->
            <div class="off_1">
              <i class="iconfont-mul icon-m-off-tag"> </i>
              <span
                v-if="bannerInfo.type != 'upgrade'"
                class="off-value z-2"
                v-html="bannerInfo.couponText"
              ></span>
              <span v-else class="upgrade-off" v-html="commomJson.upgrade_off"></span>
            </div>
          </div>
          <div
            v-if="giftShow && bannerInfo.giftImgs?.length"
            class="gift-box"
            :class="{ 'opacity-full': skeletonLoading }"
          >
            <div class="icon_gift_1 git-tip-icon">
              <i class="iconfont-sg icon-gift"> </i>
            </div>
            <template v-for="(gItem, idx) in bannerInfo.giftImgs" :key="'gift-img-' + idx">
              <template v-if="idx == 2">
                <div
                  v-if="bannerInfo.type !== 'upgrade'"
                  :class="[`icon_gift_${idx + 2}`]"
                  class="gift-icon"
                  :style="`background-image: url('${gItem}')`"
                ></div>
              </template>
              <div
                v-else
                :class="[`icon_gift_${idx + 2}`]"
                class="gift-icon"
                :style="`background-image: url('${gItem}')`"
              ></div>
            </template>
          </div>
        </div>
        <div class="right col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <h1 v-if="!commomStore.mobile" class="title" v-html="bannerInfo.title"></h1>
          <p class="font-size-16 mt10" v-html="bannerInfo.desc"></p>
          <div class="right-bottom-box" :class="{ 'opacity-full': skeletonLoading }">
            <p v-if="bannerInfo.type == 'upgrade'" class="upgrade-desc" v-html="bannerInfo.upgradeDesc"></p>
            <div v-if="bannerInfo.timeEndShow" class="playerfab-times">
              <div class="times-show-box">
                <div v-if="!commomStore.mobile || bannerTips" class="times-lf">
                  <BaseTimeEnd
                    v-if="!commomStore.mobile"
                    :mode="2"
                    :display-day="false"
                    :display-m-s="true"
                    :page-key="'all_in_one'"
                    :time-end="bannerInfo.timeEnd"
                    :hour-unit="timeUnits.hours"
                    :min-unit="timeUnits.mins"
                    :sec-unit="timeUnits.secs"
                    :m-sec-unit="timeUnits.ms"
                  />
                  <p v-if="bannerTips" class="times_text" v-html="bannerTips"></p>
                </div>
                <div v-if="bannerInfo.freeProduct.name" class="times-rt">
                  <div class="player-title" v-html="bannerInfo.freeProduct.name"></div>
                  <div>
                    <span class="free-text" v-html="bannerInfo.freeProduct.tag"></span>
                    <span class="player-price" v-html="bannerInfo.freeProduct.price"></span>
                  </div>
                </div>
              </div>
              <div
                v-if="bannerInfo.newProductDesc"
                class="product-desc mt-12"
                v-html="bannerInfo.newProductDesc"
              ></div>
            </div>
            <div class="price-gift-box">
              <PagesProductGiftBox
                class="min-w-80%"
                v-bind="{
                  ...bannerInfo.priceGiftInfo,
                  splitLine: { show: true, color: 'transparent' },
                }"
              />
            </div>

            <div class="right-center">
              <div v-if="reloadBtnData.value" class="btn-group">
                <div
                  v-for="(btn, idx) in bannerInfo.btnList"
                  :key="'btn-item' + idx"
                  class="btn-item"
                  :class="{ 'first-btn': idx === 0 }"
                >
                  <component
                    :is="btn.component"
                    v-if="btn.component === 'MyButtonBuy' && reloadBtnData.reloadOs[osText]"
                    v-track:click="btn.click"
                    v-track:exposure="btn.exposure"
                    v-bind="{ ...btn.info }"
                  />
                  <component :is="btn.component" v-else v-bind="{ ...btn.info }" />
                  <div v-if="btn.tipText" class="flex flex-items-center mt16">
                    <i :class="btn.tipIconClass" class="c-white"></i>
                    <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="version-box mt50">
              <BaseSwitchOs class="mb18" @tab-click="switchClick" />
            </div>
          </div>
        </div>
      </div>
      <el-skeleton :loading="skeletonLoading" animated>
        <template #template>
          <div class="flex gap80 skeleton-content">
            <div class="skeleton-imgbox">
              <el-skeleton-item variant="image" class="w340! h340!" />
            </div>
            <div class="w100% flex flex-col">
              <div
                v-if="!commomStore.mobile"
                class="title title1 opacity-full"
                v-html="bannerInfo.title"
              ></div>
              <div class="font-size-16 mt10 opacity-full" v-html="bannerInfo.desc"></div>
              <!-- <el-skeleton-item variant="h3" class="w100%! max-w-480 h32! mb24" /> -->
              <el-skeleton-item variant="text" class="w100%! h32! mb24 mt24" />
              <el-skeleton-item variant="text" class="w100%! h32! mb24" />
              <el-skeleton-item variant="text" class="w100%! h32! mb74" />
              <div class="flex gap20 sc-mobile">
                <el-skeleton-item variant="button" class="w100%! max-w-240 h66! b-rd-66!" />
                <el-skeleton-item variant="button" class="w100%! max-w-240 h66! b-rd-66!" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
@media (max-width: 640px) {
  .mobile-show {
    display: block;
  }
  .mobile-hide {
    display: none;
  }
}
@media only screen and (min-width: 641px) {
  .mobile-show {
    display: none;
  }
  .mobile-hide {
    display: block;
  }
}
.aio-banner-content {
  position: relative;
  .el-skeleton {
    padding-top: 35px;
    position: absolute;
    width: calc(100% - 80px);
    top: 0;
    :deep(.el-skeleton__image) {
      svg {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    .skeleton-content {
      width: 100%;
      .opacity-full {
        opacity: 0;
      }
      .skeleton-imgbox {
        width: 45% !important;
        max-width: 340px !important;
      }
    }
    .el-skeleton__image {
      width: 100% !important;
    }
  }
}
.container-content {
  display: flex;
  .opacity-full {
    opacity: 0;
  }
}
.banner-box {
  padding: 30px 0 60px;
  .off_1 {
    position: absolute;
    top: -1%;
    left: 6%;
    line-height: 1;
    text-align: center;
    font-size: @font-size-md;
    font-weight: 700;
    z-index: 2;
    transform: rotate(-28deg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .off-value {
      position: absolute;
      color: #fff;
    }
    .upgrade-off {
      color: #fff;
      position: absolute;
      font-size: @base-font-size;
      // line-height: @base-line-height;
    }
    .icon-m-off-tag {
      font-size: 90px;
    }
  }
  .left {
    width: 32.17%;
    max-width: 510px;
    flex-shrink: 0;
    .img-box {
      padding: 0 30px;
      position: relative;
      img {
        /* max-width: 100%; */
        width: 100%;
        height: auto;
      }
    }
    .gift-box {
      margin: 0 auto;
      max-width: 332px;
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 232, 42, 0.15);
      border-radius: 10px;
      position: relative;
      .gift-icon {
        vertical-align: middle;
        text-align: center;
        position: relative;
        padding: 0 5px;
        border-right: 1px solid rgba(255, 232, 42, 0.15);
        background-size: 80%;
        &:last-child {
          border: 0;
          background-size: 50%;
        }
        img {
          max-width: 100%;
        }
      }
      .icon_gift_1 {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgb(235, 235, 37);
        text-align: center;
        line-height: 26px;
        color: #f8aa02;
        position: absolute;
        right: -14px;
        top: -10px;
        border: 0;
        .icon-gift {
          font-size: 20px;
        }
      }
    }
  }
  .right {
    overflow: hidden;
    padding-left: 3.5%;
    padding-top: 2.5%;
    color: #fff;
    h1,
    h2 {
      text-align: left;
      font-weight: bold;
    }
    .blob {
      font-size: 22px;
    }
    .title-sub {
      font-size: 20px;
      padding: 25px 0 5px;
      font-weight: bold;
    }
    .price-box {
      display: inline-block;
      .price {
        font-size: 32px;
        color: #ffe82a;
        b {
          font-size: 18px;
        }
      }
      .original-price {
        font-size: 18px;
        color: #fff;
        text-decoration: line-through;
      }
      .hasVat {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        text-align: right;
      }
    }
    .buy-btn i {
      margin-right: 10px;
      vertical-align: middle;
    }
    .right-center {
      display: flex;
      .btn-group {
        display: flex;
        gap: 50px;
        // .first-btn {
        //   margin-right: 50px;
        // }
      }
    }

    .playerfab-times {
      width: 666px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 2px 5px 9px 0px rgba(0, 0, 0, 0.31);
      border-radius: 4px;
      padding: 12px 18px;
      margin-top: 21px;
      .count-down-box span {
        width: 31px;
      }
      .count-down-box {
        .time-box {
          width: 275px;
          background: img_url('/product/1x_m/en/all_in_one/count_down_bg.png') no-repeat center;
          span {
            width: 31px;
            font-size: 27px;
            color: #ffe82a;
          }
        }
        .info-box {
          width: 275px;
          color: #fff;
        }
      }
      .times_text {
        margin-top: 21px;
      }
      .times-show-box {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .times-rt {
        .player-title {
          font-size: 18px;
        }
        .free-text {
          color: #ffe82a;
          font-size: 28px;
          text-transform: uppercase;
        }
        .player-price {
          text-decoration: line-through;
        }
      }
    }
    .price-gift-box {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-bottom: 34px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      :deep(.product-info) {
        .product-info-right {
          gap: 15px;
        }
      }
    }
  }
  .upgrade-desc {
    margin-top: 20px;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;
    :deep(span) {
      color: #ffe82a;
    }
  }
  .product-desc {
    font-size: 14px;
    color: #ffffff;
    :deep(span) {
      color: #ffe82a;
    }
  }
}
:deep(.product-info) {
  .pro-per-price {
    color: #ffe82a;
  }
}
.aio-banner {
  background: #0d94f2 url('https://c.dvdfab.cn/images/product/1x_m/en/all_in_one/icon/banner.jpg') no-repeat
    50%;
  background-size: cover;
  position: relative;
  z-index: 2;
}
.aio-mac-banner {
  background: #fe6a36 url('https://c.dvdfab.cn/images/product/1x_m/en/all_in_one/icon/banner_mac.jpg')
    no-repeat 50%;
  background-size: cover;
  position: relative;
  z-index: 2;
}
.product-bgm {
  background: linear-gradient(180deg, #065f96, #038bd2);
}
.btn-bottom-icons {
  color: #fff;
  padding-top: 18px;
  i {
    margin-right: 10px;
    vertical-align: middle;
  }
  span:first-child {
    margin-right: 115px;
  }
}
.icon_gift_2,
.icon_gift_3,
.icon_gift_4 {
  width: 100%;
  background-size: contain !important;
  background-repeat: no-repeat;
  background-position: center;
}
.icon_gift_2 {
  height: 59px;
}
.icon_gift_3 {
  height: 52px;
}
.icon_gift_4 {
  height: 67px;
}

@media (max-width: 1024px) {
  .banner-box {
    .right {
      .playerfab-times {
        width: 100%;
        .times-show-box {
          align-items: flex-start;
          flex-direction: column;
          justify-content: flex-start;
        }
      }
      .right-center .btn-group {
        flex-wrap: wrap;
        gap: 20px;
      }
    }
  }
  .skeleton-content {
    gap: 50px;
  }
  :deep(.skeleton-content) {
    .el-skeleton__image {
      width: 240px !important;
      height: 240px !important;
    }
  }
}

@media (max-width: 768px) {
  .version-box {
    display: flex;
    justify-content: center;
  }
  .aio-banner-content {
    .el-skeleton {
      padding-top: 85px;
      .skeleton-content {
        .skeleton-imgbox {
          width: 100% !important;
          max-width: 240px !important;
        }
      }
    }
  }
  .skeleton-content {
    flex-direction: column;
    align-items: center;
    .sc-mobile {
      flex-direction: column;
      align-items: center;
    }
  }
  .banner-box {
    .container-content {
      display: block;
      .fl,
      .col-xs-12 {
        float: none;
      }
      .left {
        width: 100%;
        max-width: 26.875rem;
        margin: 0 auto;
        .img-box {
          padding: 0 4.875rem;
          position: relative;
        }
      }
      .right {
        padding: 0;
        .title {
          font-size: 1.25rem;
          text-align: center;
          margin-top: 1rem;
        }
        .right-center {
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }

  .imgs-box {
    display: block;
    padding: 0 20px;
    overflow-x: scroll;
  }

  .content {
    width: 95%;
  }

  .list-box,
  .tc,
  .clearfix {
    display: flex;
    flex-direction: column;
  }

  .banner-box .left .img-box .off_1 {
    top: -10%;
    left: 22%;
  }
  .desc span {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .aio-banner-content {
    .el-skeleton {
      width: 90%;
    }
  }
  .banner-box {
    .left {
      .img-box {
        img {
          width: 180px;
        }
        .off_1 {
          .icon-m-off-tag {
            font-size: 70px;
          }
          .upgrade-off {
            font-size: 12px;
          }
          .off-value {
            font-size: 18px;
          }
        }
      }
      .gift-box .gift-icon {
        height: 2.6875rem;
      }
    }
  }

  .banner-box {
    .right {
      .right-center {
        .btn-group {
          display: flex;
          flex-direction: column;
          .first-btn {
            margin-right: 0;
            // margin-bottom: 16px;
          }
        }
      }
    }
  }
  .list-img-box {
    transform: scale(0.7);
  }
}
</style>

<style lang="less">
.playerfab-times {
  .times-lf {
    width: 50%;
    margin-right: 15px;
  }
  .time-end-box.mode-2 .t-txt {
    padding: 4px;
  }
  .time-end-box.mode-2 .t-txt .t-in {
    background-color: #2a2620;
  }
}
</style>
