<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    default: () => ({}),
  },
})

const commomJson = useI18n().value.common
const osText = useOs().value

const products = (props.blockData?.products?.data || []).map((item: any) => {
  if (osText === 'win') {
    return {
      ...(item.attributes || {}),
    }
  }
  return {
    ...(item.attributes?.related_products?.data?.[0]?.attributes || {}),
  }
})

const carsInfo = products.map((product: any) => {
  const proImg = product.imgs?.find((pr: any) => pr.label === 'basic')
  const oldPrice = product.price?.find((pr: any) => pr.key === 'LFT')
  let params = ''
  const coupon = product.coupon?.[0]
  let price = 0
  if (coupon?.key) {
    params += '&coupon=' + coupon.value
    price = parseFloat((oldPrice?.value * coupon?.value).toFixed(2))
  }
  const checkoutUrl = getCheckoutUrl(product.pid, oldPrice?.key, params)
  params = checkoutUrl?.split('?')?.[1] || ''
  const proUrl =
    product.slug && !product.slug.includes('javascript:;') ? `/${product.slug}.htm` : 'javascript:;'
  return {
    proImg: proImg?.url,
    alt: product.name,
    name: product.name,
    desc: product.desc,
    price,
    proUrl,
    with: 220,
    height: 220,
    oldPrice: oldPrice?.value,
    coupon: coupon?.text,
    btnText: commomJson.buy_now,
    btnUrl: checkoutUrl,
    proInfo: {
      pid: product.pid,
      pname: product.name,
    },
  }
})
</script>

<template>
  <div>
    <section v-if="carsInfo?.length" class="pro-box flex flex-wrap">
      <div v-for="(item, index) in carsInfo" :key="index" class="pro-li">
        <BaseProPriceItem v-bind="item" />
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.pro-box {
  gap: @gap-30;
  .pro-li {
    background-color: #fff;
    @apply flex p30 pl20 pr20;
    // width: calc((100% - 2 * @gap-30) / 2);
    width: calc((100% - @gap-30) / 2);
    border-radius: 12px;
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
    }
    :deep(img) {
      width: 220px;
      height: 220px;
    }
    :deep(a) {
      &:hover {
        text-decoration: none;
      }
    }
  }
}

// 移动端兼容
@media screen and (max-width: @screen-xl) {
  .pro-box {
    .pro-li {
      width: 100%;
    }
    flex-direction: column;
  }
}
</style>
