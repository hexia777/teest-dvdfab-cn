<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  title: {
    type: String,
    default: '',
  },
  products: {
    type: Object,
    default: () => ({
      data: [],
    }),
  },
})
const { getPriceByOpt } = useProductDiffPrice()
const macData: any = useAttrs().macData || props
const commomJson = useI18n().value.common
const blockInfo = reactive({
  title: '',
  list: [] as any,
})
const renderInfoHandle = (osText: string) => {
  const propsInfo = osText === 'win' ? props : macData
  blockInfo.title = propsInfo.title
  blockInfo.list = propsInfo.products.data.map((item: any) => {
    const product = getStrapiData(item)
    const proImg = product.imgs.find((pr: any) => (pr.label = 'basic'))
    const proUrl = product.slug ? '/' + product.slug + '.htm?open=true' : ''
    const buyUrl = getCheckoutUrl(product?.pid, 'LFT', '&open=true')
    const downloadUrl = product?.downloadUrl[0]?.url
    const price = getPriceByOpt(product)
    const btnList = [
      {
        info: {
          href: downloadUrl,
          size: 'normal',
          showIcon: false,
          label: commomJson.try_it_free,
          theme: 'border',
          slug: product.slug,
          tag: 'a',
          'data-vars-bpid': product.pid,
          'data-warden-ck-parm': base64Encode({
            event_value: product.slug,
            event_label: 'productpage',
            pids: [product.pid],
          }),
        },
        component: 'MyButtonDownload',
      },
      {
        info: {
          href: proUrl || buyUrl,
          size: 'normal',
          showIcon: false,
          label: commomJson.buy_now,
          theme: 'border-orange',
          slug: product.slug,
          tag: 'a',
        },
        click: {
          event: 'buy_now',
          pids: [product?.pid || 0],
          products: {
            list: [{ pid: product?.pid || 0, price: price || '' }],
            list_count: 1,
            type: 'buy_now',
          },
        },
        component: 'MyButtonBuy',
      },
    ]
    return {
      ...product,
      name: product.shortName,
      desc: product.desc,
      media: {
        loading: '',
        img: proImg.url,
        url: product.slug ? '/' + product.slug : '',
        alt: product.name,
        with: 150,
        height: 150,
      },
      btnList,
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
    <!-- 主标题 -->
    <BaseContainer>
      <h2 v-if="title" class="font-s-40 mb-40 text-center title" v-html="title"></h2>
      <!-- pro列表 -->
      <section v-if="blockInfo?.list && blockInfo?.list?.length" class="pro-box flex flex-wrap">
        <div v-for="(item, index) in blockInfo?.list" :key="index" class="pro-li">
          <base-pro-item v-bind="item" />
        </div>
      </section>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.pro-box {
  gap: @gap-md;

  .pro-li {
    @apply flex flex-1;
    width: calc((100% - 2 * @gap-md) / 3);
  }
}
// 移动端兼容
@media screen and (max-width: @screen-xxl) {
  .pro-box {
    .pro-li {
      width: 100%;
      flex: 1;
    }
  }
  :deep(.pro-btn-group) {
    flex-wrap: wrap;
  }

  .pro-box .pro-li {
    width: 100%;
    flex-shrink: 0;
  }
}
@media screen and (max-width: @screen-md) {
  .pro-box {
    flex-direction: column;
    .pro-li {
      justify-content: center;
    }
    :deep(.pro-btn-group > .btn-item) {
      &:first-child {
        display: none;
      }
    }
  }
}
</style>
