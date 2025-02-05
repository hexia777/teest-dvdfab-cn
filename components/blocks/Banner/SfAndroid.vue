<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'module', // module: 模块, banner: banner组件
  },
  // banner 标题
  title: {
    type: String,
    default: 'StreamFab for Android',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: ``,
  },
  media: {
    type: Object,
    default: () => {},
  },
  bottomTitle: {
    type: String,
    default: '',
  },
  timeLimited: {
    type: String,
    default: '',
  },
  upgradeTipDesc: {
    type: String,
    default: '',
  },
  qrCodeDesc: {
    type: String,
    default: '',
  },
  androidVersion: {
    type: String,
    default: '',
  },
  googlePayMedia: {
    type: String,
    default: '',
  },
  googleStoreLink: {
    type: String,
    default: '',
  },
  googleTips: {
    type: String,
    default: '',
  },
})
const {
  getCurrentEmail,
  getDefaultPriceInfo,
  loadDiffPrice,
  getPriceByOpt,
  getElkParams,
  getBuyUrl,
  getUpgradePriceInfo,
} = useProductDiffPrice()
const proInfo = useProInfo().value || {}
// const osText = 'android'
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]

const leftImgInfo = proInfo.imgs.find((img: any) => img.label === 'basic')

const bannerData = reactive({
  title: props.title,
  desc: props.desc,
  bottomTitle: props.bottomTitle,
  diffPrices: {} as any,
  skeletonLoading: true,
  priceBoxInfo: {} as any,
  buyUrl: '',
  elkData: {} as any,
  isUpgrade: false,
  bottomInfo: {} as any,
})

const renderInfoHandle = (diffPrices: any) => {
  // 获取价格信息
  const priceInfo = getUpgradePriceInfo(proInfo, diffPrices) || {
    pid: proInfo.pid,
    options: {
      has_lft_options_num: 0,
      has_nlt_options_num: 0,
      has_online_lft_options_num: 0,
      has_online_nlt_options_num: 0, // 拥有非 lft 产品
      has_online_options_num: 0,
      has_options_num: 0,
      total_options_num: proInfo.products.data.length,
    },
    user_tag_type: 'new',
    price: getDefaultPriceInfo(proInfo),
  }
  const _price = getPriceByOpt(proInfo)
  bannerData.isUpgrade = +priceInfo.price.payment_price !== +_price
  const paymentPrice = translatePrice(
    priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
    currency[1],
    locale,
  )
  const priceBoxInfo = {
    standardLabel: commomJson.standard_price,
    standardPrice: translatePrice(
      priceInfo?.price?.origin_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    finalLabel: commomJson.final_price,
    finalPrice: paymentPrice,
    tips: props.timeLimited,
    upgradeTips: props.upgradeTipDesc,
  }
  bannerData.priceBoxInfo = priceBoxInfo
  bannerData.buyUrl = getBuyUrl(proInfo, props, priceInfo?.price, {}, 'LFT', priceInfo.user_tag_type)
  bannerData.elkData = {
    pids: [priceInfo?.pid || 0],
    products: {
      list: [{ pid: priceInfo?.pid || 0, price: priceInfo?.price?.payment_price || '' }],
      list_count: 1,
      type: 'buy_now',
    },
  }
  // 底部按钮组
  const bottomInfo = {
    qrCode: {
      img: getStrapiData(props.media),
      desc: props.qrCodeDesc,
    },
    googlePay: {
      img: props.googlePayMedia,
      desc: props.googleTips,
      link: props.googleStoreLink,
      elkParams: {
        event: 'download',
        event_label: 'downloadpage',
        install_download_url: props.googleStoreLink,
      },
    },
    download: {
      label: commomJson.free_download,
      osVersion: props.androidVersion,
      safeText: commomJson.download_info,
      link: proInfo.downloadUrl[0].url,
      pid: proInfo.pid,
      elkParams: {},
    },
  }
  bannerData.bottomInfo = bottomInfo
}

renderInfoHandle({})

onMounted(() => {
  const currentEmail = getCurrentEmail() as string
  nextTick(() => {
    const pids = [proInfo.pid]
    loadDiffPrice('win', pids, currentEmail, 'dvdfab')
      .then((res) => {
        if (res.data.value?.cscode === 200 && res.data.value.data?.details) {
          useProDiffPrice().value = res.data.value.data?.details?.product
          bannerData.diffPrices = useProDiffPrice().value
          renderInfoHandle(useProDiffPrice().value)
          bannerData.skeletonLoading = false
        } else {
          bannerData.skeletonLoading = false
        }
      })
      .catch((err) => {
        console.error(err)
        bannerData.skeletonLoading = false
      })
  })
})
</script>
<template>
  <div class="pro-top-banner pt80">
    <BaseContainer>
      <div class="ptb-top flex flex-items-center">
        <div v-if="leftImgInfo.url" class="ptb-left">
          <MyImg
            class="my-img"
            :class="leftImgInfo.class"
            :src="leftImgInfo.url"
            :loading="''"
            :width="340"
            :height="340"
            :alt="proInfo.name"
          />
        </div>
        <div class="ptb-right">
          <h1 class="ptb-title mb20" v-html="props.title"></h1>
          <p class="ptb-desc mb40 font-s-20" v-html="props.desc"></p>
          <div class="btn-group flex flex-wrap">
            <div class="btn-group-left">
              <el-skeleton :loading="bannerData.skeletonLoading" animated class="dark">
                <template #template>
                  <el-skeleton-item variant="h3" class="w100%! max-w-503 h94!" />
                </template>
                <template #default>
                  <div class="flex items-center mb12">
                    <span class="price-label font-s-18">{{
                      bannerData.priceBoxInfo?.standardLabel + ': '
                    }}</span>
                    <span :class="!bannerData.isUpgrade ? 'price font-bold' : 'ml12'">{{
                      bannerData.priceBoxInfo?.standardPrice
                    }}</span>
                  </div>
                  <div v-if="bannerData.isUpgrade">
                    <div class="flex items-center mb12">
                      <span class="price-label font-s-18">{{
                        bannerData.priceBoxInfo?.finalLabel + ': '
                      }}</span>
                      <span class="price font-bold">{{ bannerData.priceBoxInfo?.finalPrice }}</span>
                    </div>
                    <div
                      class="font-s-14 color-price2 mb12"
                      v-html="bannerData.priceBoxInfo?.upgradeTips"
                    ></div>
                  </div>
                </template>
              </el-skeleton>
              <div class="price-tips" v-html="bannerData.priceBoxInfo?.tips"></div>
            </div>
            <span class="line"></span>
            <div class="btn-group-right flex-self-center">
              <MyButtonBuy
                :data-warden-ck-parm="base64Encode(bannerData.elkData)"
                class="buy-btn icon_cursorv"
                size="large"
                :href="bannerData.buyUrl"
                :label="commomJson.buy_now"
                :theme="props.type === 'module' ? 'border' : 'white'"
              />
              <div class="font-s-14 tip-text mt6 text-center" v-html="commomJson.buy_info"></div>
            </div>
          </div>
        </div>
      </div>
      <span class="bottom-title block mb20 font-bold font-s-18" v-html="bottomTitle"></span>
    </BaseContainer>
    <div v-if="bottomTitle" class="ptb-bottom">
      <div class="btn-list">
        <PagesProductDownload :info="bannerData.bottomInfo" type="banner" />
      </div>
    </div>
  </div>
</template>
<!-- 弹窗 -->
<style lang="less" scoped>
.pro-top-banner {
  color: #fff;
  position: relative;
  z-index: 2;
  background: img_url('/product/1x_m/en/streamfab_for_android/banner_1.jpg') no-repeat top;
  background-color: #5abb6f;
  background-size: cover;
  .ptb-top {
    gap: @gap-lg;
    min-height: 420px;
    align-items: flex-start;
    .btn-group {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      padding: 24px;
      gap: 32px;
      width: fit-content;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      .btn-group-left {
        width: 284px;
      }
      .price {
        padding-left: 12px;
        font-size: @font-size-lg;
        color: #ff9000;
        line-height: 40px;
      }
      .price-tips {
        font-size: @font-size-xs;
        line-height: 20px;
      }
      .tip-text {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .ptb-bottom {
  }
}
.line {
  width: 1px;
  height: auto;
  margin: 14px 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1px;
}
@media (max-width: 1200px) {
  .pro-top-banner .ptb-top {
    padding-bottom: 12px;
    .btn-group {
      flex-direction: column;
      gap: @gap-24;
      .line {
        width: 100%;
        height: 1px;
      }
    }
  }
}
@media (max-width: 900px) {
  .ptb-left {
    img {
      width: 285px;
      height: 285px;
    }
  }
}
@media (max-width: 768px) {
  .pro-top-banner .ptb-top {
    padding-bottom: 40px;
    gap: 40px;
    flex-direction: column;
    align-items: center;
  }
  .ptb-right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
@media (max-width: 640px) {
  .ptb-left {
    img {
      width: 245px;
      height: 245px;
    }
  }
}
</style>
