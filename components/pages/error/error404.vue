<script setup lang="ts">
const client = useStore.common().client
// 定义响应式数据
const tIndex = ref(client)

// 方法
const tabClick = (index: 'win' | 'mac') => {
  tIndex.value = index
}
// 获取 locale
const locale = useStore.common().locale
const errorImgUrl = useImgPath().value + '/404/404_' + locale + '.png'

// 设置头部信息
useHead({
  link: [
    {
      rel: 'preload',
      href: errorImgUrl,
      as: 'image',
    },
  ],
})

const { apiProducts } = useApi()
const prosData = reactive({
  title: '',
  win: [],
  mac: [],
})
const commomJson = useI18n().value.common
const formateProductList = (data: any, urlList: any) => {
  const list =
    data?.products?.data?.map((item: any, idx: number) => {
      const { attributes } = item
      const proImg = attributes.imgs?.find((pr: any) => pr.label === 'basic')
      const oldPrice = attributes.price?.find((pr: any) => pr.key === 'LFT')
      let params = ''
      const coupon = attributes.coupon?.[0]
      let price = 0
      if (coupon?.key) {
        params += '&coupon=' + coupon.key
        price = parseFloat((oldPrice?.value * coupon?.value).toFixed(2))
      }
      const checkoutUrl = getCheckoutUrl(attributes.pid, oldPrice?.key, params)
      const proUrl = !attributes.slug.includes('javascript:;') ? `/${attributes.slug}.htm` : 'javascript:;'
      const newItem = {
        proUrl,
        proImg: proImg?.url,
        name: attributes.name,
        alt: attributes.name,
        desc: attributes.desc,
        price,
        oldPrice: oldPrice?.value,
        coupon: coupon?.text || '',
        btnText: commomJson.buy_now,
        btnUrl: checkoutUrl,
        proInfo: {
          pid: attributes.pid,
        },
      }
      return newItem
    }) || []
  return list
}

const renderInfoData = (productData: any) => {
  const title = productData?.title
  prosData.title = title
  let win = productData?.win
  let mac = productData?.mac
  win = formateProductList(win, productData?.winItems)
  mac = formateProductList(mac, productData?.macItems)
  prosData.win = win
  prosData.mac = mac
}

const apiData: any = ref(null)

const getProductList = async () => {
  let { data } = await apiProducts.getPageErrorProductList({ locale })
  data = toRaw(data)
  apiData.value = getStrapiData(data.value)
}

await getProductList()

renderInfoData(apiData.value)
</script>

<template>
  <div class="error-404-wrap">
    <div class="block-box no-bg">
      <BaseContainer>
        <div class="img404">
          <my-img width="1508" height="583" layout="responsive" :src="errorImgUrl" alt="" />
        </div>
      </BaseContainer>
    </div>
    <div class="block-box no-bg">
      <template v-if="prosData?.win?.length || prosData?.mac?.length">
        <BaseContainer>
          <h1 class="title1" v-html="prosData?.title"></h1>
        </BaseContainer>
        <BaseContainer class="flex-center">
          <BaseSwitchOs class="mb40 bestselling" :theme="'blue'" @tab-click="tabClick" />
        </BaseContainer>
        <BlocksCardProductPriceBtnGrid
          v-show="tIndex === 'win'"
          class="pro-list"
          :items="prosData?.['win']"
        />
        <BlocksCardProductPriceBtnGrid
          v-show="tIndex === 'mac'"
          class="pro-list"
          :items="prosData?.['mac']"
        />
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.error-404-wrap {
  background: @bg-gray;
  a[href='javascript:;'] {
    cursor: text;
  }
  h1 {
    padding-bottom: 20px;
    font-size: @font-size-md;
  }

  :deep(.img404) img {
    max-width: 100%;
    height: auto;
    margin: 0px auto;
  }

  a {
    color: @primary-color;
  }
  :deep(.pro-list) {
    padding-top: 0;
    .pro-li {
      border-radius: 12px;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
      }
    }
  }
}
</style>
