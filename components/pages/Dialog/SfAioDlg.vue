<script setup lang="ts">
const { $trace } = useNuxtApp() as any
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  // 优惠信息
  offersInfo: {
    type: Object,
    default: () => ({
      coupon: '',
      couponOff: '',
      tagOff: '',
      discount: '',
    }),
  },
  textInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  proInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emits = defineEmits(['update:modelValue'])

const closeDialog = () => {
  $trace.traceCustomEvent({
    event: 'click',
    event_category: 'streamfabAioDlgClose',
  })
  emits('update:modelValue', false)
}
const { getDefaultPriceInfo, getAmazonCouponValue, getPriceByOpt, getElkParams, getBuyUrl } =
  useProductDiffPrice()

// const osText = useOs().value

const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commonJson = useI18n().value.common

const priceInfo = getDefaultPriceInfo(props.proInfo)

// 礼物部分
let giftText = []
const productAttrs = props.proInfo.product_attrs?.data || []
if (productAttrs && productAttrs.length) {
  const amazonPriceText = getAmazonCouponValue(props.proInfo)
  const giftMediaTags = productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
  if (giftMediaTags) {
    giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
      return {
        value: gText.value.replace('{num}', amazonPriceText),
      }
    })
  }
}
const configData = {
  notice: props.textInfo.notice,
  proImg: props.proInfo?.imgs.find((img: any) => img.label === 'basic'),
  descList: [
    props.textInfo.includedText.replace(
      '{num}',
      '<b class="color-price">' + props.proInfo.products.data.length + '</b>',
    ),
  ],
  giftList: giftText,
  priceInfo: {
    standardLabel: commonJson.standard_price,
    standardPrice: translatePrice(priceInfo.origin_price, currency[1], locale),
    finalLabel: commonJson.final_price,
    finalPrice: translatePrice(priceInfo.payment_price, `<span>${currency[1]}</span>`, locale),
  },
  title: props.proInfo.name,
  couponText: priceInfo.off_num ? commonJson.coupon_num.replace('{num}', priceInfo.off_num + '') : '',
}

// 获取价格
const getStreamAioPrice = () => {
  let streamfabDiscount = 1
  const winCoupon = props.offersInfo.coupon
  if (winCoupon && winCoupon !== 'false') {
    streamfabDiscount = props.offersInfo.couponOff
  }
  const ratePrice = getPriceByOpt(props.proInfo?.price, 'LFT') * streamfabDiscount

  configData.priceInfo.finalPrice = translatePrice(ratePrice, `<span>${currency[1]}</span>`, locale) as string
  configData.couponText = commonJson.coupon_num.replace('{num}', props.offersInfo.tagOff + '')
}

if (props.offersInfo.coupon) {
  getStreamAioPrice()
}

const getCheckOutUrl = computed(() => {
  const params: any = {}
  if (props.offersInfo && Object.keys(props.offersInfo).length) {
    const offKey = ['coupon', 'discount']
    offKey.forEach((key) => {
      if (props.offersInfo[key]) {
        params[key] = props.offersInfo[key]
      }
    })
  }
  // const urlSufix = urlParamsToString(params)
  return getBuyUrl(props.proInfo, props, priceInfo, params, 'LFT', 'new')
})
</script>

<template>
  <transition name="dialog-fade">
    <div v-if="modelValue" class="vd-overlay flex-center">
      <div class="vd-overlay-dialog">
        <div class="close-icon w14 h14 flex-center" @click="closeDialog">
          <i class="iconfont-sg icon-close-line font-size-36"></i>
        </div>
        <div class="dialog-content">
          <div class="notice-text mb30" v-html="textInfo.recomAioText"></div>
          <div class="content-info flex gap30">
            <div class="img-box">
              <span class="iconfont-mul off_1 icon-m-off-tag">
                <span v-html="configData.couponText"></span>
              </span>
              <my-img :src="configData.proImg.url" style="max-width: 240px" width="240" height="240" alt="" />
            </div>
            <div class="aio-content flex flex-col">
              <div class="title4 mb30">{{ configData.title + ` (${commonJson.lifetime})` }}</div>
              <div class="desc-group">
                <ul class="desc-list mb10">
                  <li v-for="(desc, idx) in configData.descList" :key="'dlg-desc' + idx" v-html="desc"></li>
                </ul>
                <div class="title6 pl20">{{ commonJson.gift }}</div>
                <ul class="desc-list">
                  <li
                    v-for="(gift, idx) in configData.giftList"
                    :key="'dlg-gift' + idx"
                    v-html="gift.value"
                  ></li>
                </ul>
              </div>
              <div class="price-info mt20 max-w-250">
                <div class="flex flex-justify-between mb10">
                  <span>{{ configData.priceInfo.standardLabel }}</span>
                  <span>{{ configData.priceInfo.standardPrice }}</span>
                </div>
                <div class="flex flex-items-center flex-justify-between font-bold">
                  <span>{{ configData.priceInfo.finalLabel }}</span>
                  <span
                    class="cur-price font-size-36 color-price"
                    v-html="configData.priceInfo.finalPrice"
                  ></span>
                </div>
              </div>
              <div class="flex mt20">
                <MyButtonBuy
                  v-track:click="
                    getElkParams(
                      'buy_now',
                      { ...proInfo, payment_price: priceInfo.payment_price },
                      { ...props.gTrackInfo },
                    )
                  "
                  :show-icon="false"
                  :href="getCheckOutUrl"
                  :label="textInfo.checkBtnText"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.vd-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.vd-overlay-dialog {
  background: #f4f4f4;
  border-radius: 12px 12px 0px 0px;
  width: 90%;
  max-width: 800px;
  padding: 40px;
  border-radius: @b-radius-sm;
  position: relative;
}
.close-icon {
  position: absolute;
  right: 16px;
  top: 16px;
  color: #9da9ae;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    color: @primary-color;
  }
}
.img-box {
  position: relative;
}
.off_1 {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f33837;
  font-size: 100px;
  position: absolute;
  top: 0;
  transform: rotate(-28deg) scale(0.8);
  max-height: 90px;
  span {
    color: @text-white-color;
    position: absolute;
    font-size: 20px;
    line-height: 1.2;
    font-weight: bold;
    text-align: center;
  }
}
.aio-content {
  ul {
    padding-left: 20px;
  }
}
.desc-list {
  li {
    list-style-type: disc;
  }
}
:deep(.cur-price) {
  span {
    font-size: 24px;
  }
}

@media (max-width: 640px) {
  .content-info {
    flex-direction: column;
    align-items: center;
  }
  .img-box {
    img {
      width: 205px;
      height: 205px;
    }
  }
  .aio-content {
    align-items: center;
    .title4 {
      text-align: center;
    }
    .price-info {
      width: 100%;
    }
  }
}
@media (max-width: 414px) {
  .vd-overlay-dialog {
    padding: 40px 20px;
  }
  .img-box {
    img {
      width: 185px;
      height: 185px;
    }
  }
}

@media (max-height: 768px) {
  .vd-overlay-dialog {
    max-height: 90vh;
    overflow: auto;
  }
}
</style>
