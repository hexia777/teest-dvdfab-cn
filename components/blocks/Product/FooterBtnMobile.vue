<script setup lang="ts">
const props = defineProps({
  showPrice: {
    type: Boolean,
    default: true,
  },
  priceKey: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'dlg',
  },
  vat: {
    type: String,
    default: '',
  },
})
// 公共数据
const { getLowestPrice, getDefaultPriceInfo } = useProductDiffPrice()
const isMobile = useStore.common().mobile
const locales = useI18n().value
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]

// 处理跳转链接
const handLftUrl = (pid: number, opt: string, params = {}) => {
  if (isEmpty(pid)) {
    return ''
  }
  /**
   * coudisc: 同时使用 coupon 和 discount (默认有 coupon 时不使用 discount)
   * extParams: elk 上报参数, 需自行拼接 & 符号
   * type: getCheckoutUrl() 参数, 转换升级 pid
   * */
  const { coupon, discount, extParams, coudisc, type } = (params as any) || {}

  // recom 配置 coupon
  const _coupon = `${coupon ? `&coupon=${coupon}` : ''}` || ''

  // recom 配置 discount
  const _discount = `${discount ? `&discount=${discount}` : ''}` || ''
  // 最终使用的优惠券
  const _coudisc = coudisc ? _coupon + _discount : _coupon || _discount || ''

  // 差异化 elk 扩展参数，需自行拼接 & 符号
  const extParamsStr = extParams || ''

  // LFT 链接
  const url = getCheckoutUrl(pid, opt, '', { type }) + _coudisc + extParamsStr

  return url || ''
}
/**
 * 获取最低价
 *** 动态逻辑:
 * strapi 返回 opt 则显示 strapi 指定期限价格
 *** 默认逻辑:
 * streamfab 订阅 1M, 最低价: min(LFT 折扣价 | 1M)
 * 其他产品线 订阅 1Y, 最低价: min(LFT 折扣价 | 1Y)
 * */
const getLowestPriceInfo = (_proInfo: any, opt?: string) => {
  // strapi 指定期限价格
  if (opt) {
    const priceInfoItem = getDefaultPriceInfo(_proInfo?.price, opt)
    const price = translatePrice(priceInfoItem.payment_price, currency[1], locale)
    return { value: price, key: opt }
  }

  return getLowestPrice(_proInfo, { getOpt: true })
}

const blockData = reactive({
  proInfo: {} as any,
  link: '',
  resultPriceObj: {} as any,
})

const renderData = (os: string) => {
  const proInfo =
    os === 'win'
      ? useProInfo().value
      : useMacProInfo().value?.pid
      ? useMacProInfo().value
      : useProInfo().value
  // 赋值产品信息
  blockData.proInfo = proInfo
  // 最终价格
  blockData.resultPriceObj = getLowestPriceInfo(proInfo, props.priceKey) || {}
  const couponInfo = proInfo?.coupon || []
  // 跳转链接
  blockData.link = handLftUrl(proInfo.pid, blockData.resultPriceObj?.key, {
    coupon: couponInfo[0]?.code,
  })
}
renderData(useOs().value)
watch(
  () => useOs().value,
  (val: string) => {
    renderData(val)
  },
)
</script>

<template>
  <div v-if="isMobile" class="footer-btn-mobile">
    <!-- 价格 -->
    <div v-if="showPrice" class="price-box">
      <span
        v-if="blockData.resultPriceObj?.value"
        class="price"
        v-html="blockData.resultPriceObj?.value"
      ></span>
      <span v-if="props.vat" v-html="`&nbsp;(${props.vat})`"></span>
    </div>

    <!-- 购买按钮 -->
    <!-- 链接购买 -->
    <a
      v-if="props.type === 'checkout'"
      :href="props.type"
      class="buy-btn-box"
      :style="{ width: !showPrice ? '100%' : '' }"
    >
      <span v-html="locales.common.buy_now"></span>
    </a>
    <!-- 打开弹窗 -->
    <div v-else class="buy-btn-box" :style="{ width: !showPrice ? '100%' : '' }">
      <MyButtonBuy
        v-bind="{
          label: locales.common.buy_now,
          href: props.type,
          theme: 'primary',
          size: 'medium',
          showIcon: false,
        }"
        :href="props.type === 'checkout' ? blockData.link : 'javascript:;'"
        :tag="props.type === 'checkout' ? 'a' : 'div'"
        data-buy-dlg="show"
        :data-pid="blockData.proInfo.pid"
        :data-pname="blockData.proInfo.name"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer-btn-mobile {
  @apply fixed bottom-0 left-0 w-full bg-white text-center z-96 flex items-center;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.2);
}

.price-box,
.buy-btn-box {
  @apply min-h-48 flex items-center justify-center font-size-20 c-#3b5159;
}

.price-box {
  @apply w60\% px-10;

  .price {
    color: @btn-secondary-color;
  }
}

.buy-btn-box {
  @apply w40\% font-bold;
  background-color: @btn-secondary-color;

  :deep(.btn) {
    @apply min-w-100\% border-rd-0 px-10;
  }
}
</style>
