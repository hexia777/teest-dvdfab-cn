<script setup lang="ts">
const lang = useStore.common().locale
const route = useRoute()
const commonJson = useI18n().value.common
const routeName = (route.name as any) || ''
const os = useOs().value

const pageRes = await useCommonPageData({
  'populate[seo][populate]': '*',
  'populate[blocks][populate]': `media,bundle,bundle.price,items,
    products.price,products,products.imgs,product.coupon,products.related_products,
    products.related_products.price, products.related_products.imgs, products.related_products.coupon,`,
  '[filters][slug][$eq]': routeName.replace(/_/g, '-'),
  'populate[locales]': '*',
  locale: lang,
  'populate[banner_product][populate]': `media,downloadUrl,imgs,price,client_info,related_products,
  related_products.downloadUrl,related_products.amazon,related_products.media,related_products.imgs,
  related_products.price,related_products.coupon,related_products.client_info`,
  'populate[side_product][populate]': `imgs,coupon,price,product_attrs,product_attrs.tags,related_products,
  related_products.imgs,related_products.coupon,related_products.price,
  related_products.product_attrs,related_products.product_attrs.tags,related_products`,
  'populate[side_product_card][populate]': `items,product,media,product.downloadUrl,
  product.related_products.downloadUrl`,
  'populate[side_tag][populate]': 'items',
})

usePageSeo({ title: pageRes.title, ...(pageRes.seo || {}) })

//  TODO
// useStore.common().setPageType('product_article')

let hasSidebar = false
let bannerProduct = pageRes.banner_product?.data ? getStrapiData(pageRes.banner_product) : null
if (os === 'mac') {
  bannerProduct = pageRes.banner_product?.data?.attributes?.related_products?.data?.[0]?.attributes || null
}
let bannerData: any
if (bannerProduct) {
  const boxImg = bannerProduct.imgs?.[0] || {}
  bannerData = {
    title: bannerProduct.name,
    desc: bannerProduct.desc,
    // 产品信息
    proInfo: {
      name: bannerProduct.name,
      url: bannerProduct.slug + `.htm`,
    },
    imgInfo: {
      url: boxImg.url,
      width: '255',
      height: '255',
      alt: boxImg.label,
    },
    bgImg: 'https://c1.dvdfab.cn/images/article/1x_m/banner_new.jpg',
    titleLink: bannerProduct.slug + `.htm`,
    boxImgElkParams: {
      event_label: 'banner',
      event_value: routeName,
      event_category: 'productbox',
    },
    titleElkParams: {
      event_label: 'banner',
      event_value: routeName,
      event_category: 'productname',
    },
    btnList: [
      {
        info: {
          href: bannerProduct.downloadUrl?.[0].url,
          showIcon: true,
          label: useI18n().value.common.free_download,
          theme: 'primary',
          icon: 'icon-download font-size-20 font-normal',
          os: 'win',
          size: 'medium',
          slug: '',
          'data-warden-ck-parm': base64Encode({
            event_value: routeName,
            event_label: 'banner',
            pids: [bannerProduct.pid],
          }),
        },
        component: 'MyButtonDownload',
        tipText: commonJson.download_info,
        tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
      },
      {
        info: {
          href: bannerProduct.slug + `.htm`,
          size: 'medium',
          showIcon: false,
          label: useI18n().value.common.learn_more,
          theme: 'primary',
          slug: '',
        },
        click: {
          event: 'click',
          event_label: 'banner',
          event_value: routeName,
          event_category: 'learn-more',
        },
        component: 'MyButtonBuy',
        tipText: '',
        tipIconClass: '',
      },
    ],
  }
}

const sideProduct =
  os === 'mac'
    ? pageRes.side_product?.data?.attributes?.related_products?.data?.[0]?.attributes
    : pageRes.side_product?.data?.attributes

const sideProductCardProduct =
  os === 'mac'
    ? pageRes.side_product_card?.data?.attributes?.product?.data?.attributes?.related_products?.data?.[0]
        ?.attributes
    : pageRes.side_product_card?.data?.attributes?.product?.data?.attributes

const sideProductCardImgInfo = pageRes.side_product_card?.data?.attributes?.media?.data?.attributes || {}
const sideTags = pageRes.side_tag?.data?.attributes

if (sideProductCardProduct || sideProduct || sideTags) {
  hasSidebar = true
}
const articleContent = replaceImgWithTag(pageRes.content, 'img')
// 加载页面的动态样式
if (pageRes.stylesContent) {
  useHead({
    style: [
      {
        children: pageRes.stylesContent,
        id: 'dynamic-style',
        type: 'text/css',
      },
    ],
  })
}
</script>

<template>
  <div class="system-article">
    <PagesArticleBanner v-if="bannerProduct" v-bind="bannerData" />
    <BaseContainer>
      <div class="content pt20 pb80">
        <div v-if="articleContent" class="content-left p20 mr20">
          <!-- <div v-html="pageRes.content"></div> -->
          <PagesArticleRendHtmlContent
            :slug="pageRes.slug"
            :content="articleContent"
            :blocks="pageRes.blocks"
          />
          <!-- <BlocksCardProductPriceBtnGrid
            v-show="tIndex === 'win'"
            class="pro-list"
            :items="prosData?.['win']"
          /> -->

          <!-- <BaseProPriceItem v-bind="item" /> -->
        </div>
        <div v-if="hasSidebar" class="content-right">
          <div class="content-right-inner">
            <PagesArticleSystemArticleSidebar
              :side-product-card-product="sideProductCardProduct"
              :side-product-card-img-info="sideProductCardImgInfo"
              :side-product="sideProduct"
              :side-tags="sideTags"
            />
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.system-article {
  background: #f7f7f7;
}

.content {
  display: flex;
}
.content-left {
  background-color: #fff;
  flex: 1;
}
.content-right {
  // background-color: #fff;
  // max-width: 340px;
  // min-width: 340px;
  width: 340px;
  flex-shrink: 0;
}

@media (max-width: @screen-xl) {
  .content {
    flex-direction: column;
  }
  .content-left {
    margin-right: 0;
    max-width: 100%;
    margin-bottom: 20px;
  }
  // .content-right {
  //   width: 100%;
  // }
}

@media (max-width: @screen-sm) {
  .content-right {
    width: 100%;
  }
}
</style>
