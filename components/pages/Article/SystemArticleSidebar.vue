<script setup lang="ts">
import { getCheckoutUrl } from '~/utils/product'
const os = useOs().value

const props = defineProps({
  sideProductCardProduct: {
    type: Object,
    default: () => {},
  },
  sideProductCardImgInfo: {
    type: Object,
    default: () => {},
  },
  sideProduct: {
    type: Object,
    default: () => {},
  },
  sideTags: {
    type: Object as any,
    default: () => {},
  },
})
const locale = useStore.common().locale
const locales = useI18n().value
const route: any = useRoute()
// sideProduct
const coupon = props.sideProduct?.coupon?.[0]?.text || ''
const boxImgInfo = props.sideProduct?.imgs?.[0] || {}
const gifts = props.sideProduct?.product_attrs?.data?.[0]?.attributes?.tags || []
const bundlePriceObj = props.sideProduct.price?.find((item: any) => item.key === 'LFT') || {}

// side_product_card
const cardProduct = props.sideProductCardProduct

// tags
const popularTags = {
  title: props.sideTags?.title,
  items: (props.sideTags?.items || []).map((item: any) => ({ title: item.label, href: item.url })),
  isFixed: false,
}
</script>

<template>
  <div class="sidebar">
    <!-- 组件1 -->
    <PagesProductResourceBaseRecommendedAioPro
      v-if="sideProduct"
      :img-info="boxImgInfo"
      :product="sideProduct"
      :gifts="gifts"
      :coupon="coupon"
      :bundle-price="bundlePriceObj.value"
      :route-name="route.name"
    />
    <!-- 组件1 -->

    <!-- 组件2 -->
    <PagesProductResourceRecommendProDownload
      v-if="cardProduct"
      class="mt20"
      :bg-img="sideProductCardImgInfo.url"
      :title="cardProduct.name"
      :desc="cardProduct.desc"
      :btn-text="locales.common.free_download"
      :download-url="cardProduct.downloadUrl?.[0]?.url"
      :pid="cardProduct.pid"
      :route-name="route.name"
    />
    <!-- 组件2 -->

    <!-- 组件3 -->
    <div v-if="props.sideTags?.items?.length" class="mt20 tags">
      <PagesProductResourceArticlePopularTags v-bind="{ ...popularTags }" />
    </div>
    <!-- 组件3 -->
  </div>
</template>

<style scoped lang="less">
.sidebar {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  width: 100%;
  .tags {
    width: 100%;
  }
}
</style>
