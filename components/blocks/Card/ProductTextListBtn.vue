<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg',
      }
    },
  },
  items: {
    type: Array<any>,
    default: () => {},
  },
})
const { getPriceByOpt, getDefaultPriceInfo, getBuyUrl, getElkParams } = useProductDiffPrice()
const macData: any = useAttrs().macData || props
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const blockInfo = reactive({
  list: [] as any,
})

const renderInfoHandle = (osText: string) => {
  const propsInfo = osText === 'win' ? props : macData
  blockInfo.list = propsInfo.items.map((item: any) => {
    let product = getStrapiData(item.product)
    product =
      osText === 'win'
        ? product
        : product.related_products.data.length
        ? product.related_products.data[0].attributes
        : product
    const proImg = product.imgs.find((pr: any) => (pr.label = 'basic'))
    const opt = item.priceKey || (product.type === 'single' ? '1M' : 'LFT')
    let price = getPriceByOpt(product, opt)
    const oriPrice = price
    if (opt === 'LFT') {
      const defaultPriceInfo = getDefaultPriceInfo(product)
      price = defaultPriceInfo?.payment_price
    }
    let priceInfo = {
      couponCode: '',
      couponText: '',
      price: translatePrice(price, currency[1], locale) as string,
      oriPrice: '',
    }
    // 只有 LFT 一个价格时直接跳转到购买页面
    const goCheckUrl =
      product.price.length === 1 && product.price[0].key === 'LFT' && product.productLine === 'streamfab'
    if (product.coupon.length) {
      const coupon = product.coupon[0]
      priceInfo = {
        couponCode: coupon.key,
        couponText:
          !item?.priceKey || item?.priceKey === 'LFT'
            ? commomJson.coupon_num.replace('{num}', coupon.text)
            : '',
        price: translatePrice(price, currency[1], locale) as string,
        oriPrice: translatePrice(oriPrice, currency[1], locale) as string,
      }

      if (goCheckUrl) {
        priceInfo = { ...priceInfo, ...getDefaultPriceInfo(product, item?.priceKey || 'LFT') }
      }
    }
    const btn = {
      info: {
        href: goCheckUrl ? getBuyUrl(product, propsInfo, priceInfo as any, {}) : '',
        size: 'large',
        showIcon: true,
        label: commomJson.buy_now,
        theme: 'primary',
        slug: product.slug,
        tag: goCheckUrl ? 'a' : 'div',
        couponText: item.buttonTip,
      },
      pid: product.pid,
      pname: product.name,
      click: goCheckUrl
        ? getElkParams('buy_now', product, {})
        : {
            event: 'click',
            event_category: 'show_buy_window',
            pids: [product.pid],
          },
      component: 'MyButtonBuy',
    }

    return {
      ...product,
      title: product.shortName,
      desc: product.name,
      descList: item.items,
      priceInfo,
      imgData: {
        loading: '',
        src: proImg.url,
        alt: product.name,
        with: 255,
        height: 255,
      },
      btnList: [btn],
    }
  })
}
renderInfoHandle(useOs().value)

watch(
  () => useOs().value,
  (newVal) => {
    renderInfoHandle(newVal)
  },
)
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <div class="product-card-list gap40 flex flex-justify-center">
        <template v-for="(pro, idx) in blockInfo.list" :key="'pcard' + idx">
          <PagesProductCardImgTitleText class="pcl-item" v-bind="pro" />
        </template>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
:deep(.coupon-text) {
  max-width: 14.5rem;
}
:deep(.itt-card-box) {
  min-width: 532px;
  width: 100%;
}
@media (max-width: 1024px) {
  :deep(.itt-card-box) {
    min-width: auto;
  }
}
:deep(.pcl-item) {
  .iit-desc {
    text-align: left;
  }
  .iit-desc-list {
    text-align: left;
  }
}
@media (max-width: 768px) {
  .product-card-list {
    flex-direction: column;
    align-items: center;
    .pcl-item {
      max-width: 500px;
    }
  }
}
@media (max-width: 640px) {
  .product-card-list {
    gap: 30px;
  }
}
</style>
