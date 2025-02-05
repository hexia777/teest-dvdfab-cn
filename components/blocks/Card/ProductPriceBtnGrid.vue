<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  items: {
    type: Array,
    default: () => [],
  },
  products: {
    type: Object,
    default: () => ({
      data: [],
    }),
  },
  title: {
    type: String,
    default: '',
  },
})

const proList = computed(() => {
  const commomJson = useI18n().value.common
  const osText = useOs().value

  const list = JSON.parse(JSON.stringify(props.items)) || []
  const products = props.products?.data || []
  if (!list?.length && products?.length) {
    products.forEach((item: any) => {
      const { attributes } = item
      const relatedPro = attributes.related_products?.data?.[0]?.attributes || {}
      const _curProInfo = osText === 'win' ? attributes : relatedPro
      const proImg = _curProInfo.imgs?.find((pr: any) => pr.label === 'basic')
      const oldPrice = _curProInfo.price?.find((pr: any) => pr.key === 'LFT')
      let params = ''
      const coupon = _curProInfo.coupon?.[0]
      let price = 0
      if (coupon?.key) {
        params += '&coupon=' + coupon.value
        price = parseFloat((oldPrice?.value * coupon?.value).toFixed(2))
      }
      const checkoutUrl = getCheckoutUrl(_curProInfo.pid, oldPrice?.key, params)
      params = checkoutUrl?.split('?')?.[1] || ''
      const proUrl =
        _curProInfo.slug && !_curProInfo.slug.includes('javascript:;')
          ? `/${_curProInfo.slug}.htm`
          : 'javascript:;'

      const newItem = {
        proImg: proImg?.url,
        alt: _curProInfo.name,
        name: _curProInfo.name,
        desc: _curProInfo.desc,
        price,
        proUrl,
        oldPrice: oldPrice?.value,
        coupon: coupon?.text,
        btnText: commomJson.buy_now,
        btnUrl: checkoutUrl,
        proInfo: {
          pid: _curProInfo.pid,
          pname: _curProInfo.name,
        },
      }
      list.push(newItem)
    })
  }
  return list
})
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <!-- 主标题 -->
    <BaseContainer>
      <h2 v-if="title" class="text-center mb40" v-html="title"></h2>
      <!-- pro列表 -->
      <section v-if="proList?.length" class="pro-box flex flex-wrap">
        <div v-for="(item, index) in proList" :key="index" class="pro-li">
          <BaseProPriceItem v-bind="item" />
        </div>
      </section>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.pro-box {
  gap: @gap-30;
  .pro-li {
    background-color: #fff;
    @apply flex p30 pl20 pr20;
    width: calc((100% - 2 * @gap-30) / 3);
    border-radius: 12px;
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
    }
  }
}
@media screen and (max-width: @screen-xxl) {
  .pro-box {
    .pro-li {
      width: calc((100% - 2 * @gap-30) / 2);
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
