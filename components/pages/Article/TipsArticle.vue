<script lang="ts" setup>
import type { ArticleResource, ArticleProductInfo, ArticleCategory } from '~/apis/interface/article'
const props = defineProps({
  resource: {
    type: Object as PropType<ArticleResource>,
    default: () => {},
  },
  relatedTips: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  relatedResource: {
    type: Array as PropType<any[]>,
    default: () => [],
  },

  productInfo: {
    type: Object as PropType<ArticleProductInfo>,
    default: () => {},
  },
  type: {
    type: String as PropType<ArticleCategory>,
    default: '',
  },
  breadcrumbData: {
    type: Object,
    default: () => {},
  },
  summaryDiffData: {
    type: Object,
    default: () => {},
  },
})

const locale = useStore.common().locale
const os = useOs().value
const $t = useI18n().value
const commonJson = useI18n().value.common
// const freeTrial = useI18n().value.article.free_trial

useHandleArticleExpand()

const getOsField = (field: string) => {
  return (props.resource as any)[`${os === 'mac' ? 'mac_' : ''}${field}`] || (props.resource as any)[field]
}

const popupBannerPid = computed(() => {
  return (
    props.resource[`${os === 'mac' ? 'mac_' : ''}product_popup_banner`] || props.resource.product_popup_banner
  )
})

const baseBannerPid = computed(() => {
  return (
    props.resource[`${os === 'mac' ? 'mac_' : ''}product_base_banner`] || props.resource.product_base_banner
  )
})

const topBannerPid = computed(() => {
  return (
    props.resource[`${os === 'mac' ? 'mac_' : ''}product_top_banner`] || props.resource.product_base_banner
  )
})

const pid = computed(() => {
  return props.resource.product
})
const bannerData = computed(() => {
  const title = getOsField('product_top_banner_title')
  const desc = getOsField('product_top_banner_content')
  const boxImg = `https://assets.dvdfab.cn/dvdfab/box/${props.productInfo[topBannerPid.value]?.product_box}`
  return {
    title,
    desc,
    // 产品信息
    proInfo: {
      name: props.productInfo[topBannerPid.value]?.product_name,
      url: props.productInfo[topBannerPid.value]?.route_new,
    },
    imgInfo: {
      url: boxImg,
      width: '255',
      height: '255',
      alt: props.productInfo[topBannerPid.value]?.product_name ?? '',
    },
    bgImg: 'https://c1.dvdfab.cn/images/article/1x_m/banner_new.jpg',
    titleLink: props.productInfo[topBannerPid.value]?.route_new,
    boxImgElkParams: {
      event_label: 'banner',
      event_value: props.type,
      event_category: 'productbox',
    },
    titleElkParams: {
      event_label: 'banner',
      event_value: props.type,
      event_category: 'productname',
    },
    btnList: [
      {
        info: {
          href: props.productInfo[topBannerPid.value]?.down_url_new,
          showIcon: true,
          label: useI18n().value.common.free_download,
          theme: 'primary',
          icon: 'icon-download font-size-20 font-normal',
          os: 'win',
          size: 'medium',
          slug: '',
          'data-warden-ck-parm': base64Encode({
            event_value: props.type,
            event_label: 'banner',
            pids: [topBannerPid.value],
          }),
        },
        component: 'MyButtonDownload',
        tipText: commonJson.download_info,
        tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
      },
      {
        info: {
          href: props.productInfo[topBannerPid.value]?.route_new,
          size: 'medium',
          showIcon: false,
          label: useI18n().value.common.learn_more,
          theme: 'primary',
          slug: '',
        },
        click: {
          event: 'click',
          event_label: 'banner',
          event_value: props.type,
          event_category: 'learn-more',
        },
        component: 'MyButtonBuy',
        tipText: '',
        tipIconClass: '',
      },
    ],
  }
})
// background-image:url(https://c.dvdfab.cn/images/article/author/en/diana.png?t=202102021620);
const authorInfo = {
  headIcon: props.resource?.author_info?.author_img,
  name: props.resource?.author || props.resource?.author_info?.author_name,
  date: props.resource?.time,
  views: props.resource?.views || 0,
  desc: props.resource?.author_info?.description,
}

// 文章头部卡片
const summaryData = {
  title: props.resource.title,
  summary: props.resource.summary ? $t.article.summary + props.resource.summary : '',
  time: props.resource.time,
  views: props.resource.views,
  subType: props.productInfo[baseBannerPid.value]?.product_name_new,
  subUrl: props.productInfo[baseBannerPid.value]?.route_new,
  ...props.summaryDiffData,
}

// 底部分类banner
const bottomBannerPid = getOsField('product_category_banner')

const showBottomBanner = computed(() => bottomBannerPid && props?.productInfo[bottomBannerPid])

const bottomBannerInfo = computed(() => {
  const categoryProduct = props?.productInfo[bottomBannerPid]
  const winCategoryProduct = props?.productInfo[props.resource?.product_category_banner]
  const macCategoryProduct = props?.productInfo[props.resource?.mac_product_category_banner]
  const btnList = []
  if (winCategoryProduct) {
    btnList.push({
      info: {
        href: winCategoryProduct?.down_url_new,
        showIcon: true,
        icon: 'icon-win',
        label: commonJson.free_download,
        theme: 'primary',
        os: 'win',
        size: 'medium',
        slug: '',
        'data-warden-ck-parm': base64Encode({
          event_value: props.type,
          event_label: 'category-banner',
          pids: [bottomBannerPid],
        }),
      },
      show: true,
      component: 'MyButtonDownload',
      tipText: '',
      tipIconClass: '',
    })
  }
  if (macCategoryProduct) {
    btnList.push({
      info: {
        href: macCategoryProduct?.down_url_new,
        showIcon: true,
        icon: 'icon-mac',
        label: commonJson.free_download,
        theme: 'orange',
        os: 'mac',
        size: 'medium',
        slug: '',
        'data-warden-ck-parm': base64Encode({
          event_value: props.type,
          event_label: 'category-banner',
          pids: [bottomBannerPid],
        }),
      },
      show: true,
      component: 'MyButtonDownload',
      tipText: '',
      tipIconClass: '',
    })
  }

  return {
    content: getOsField('category_banner_content'),
    // title: pro?.product_name,
    title: getOsField('category_banner_title'),
    type: props.type,
    summaryPid: bottomBannerPid,
    elkCategory: categoryProduct?.route,
    btnList,
  }
})
const catalogData = {
  title: $t.article.catalog,
  items: props.resource?.catalog,
}

const relatedTipsData = {
  title: $t.article.related_tips,
  tips: props.relatedTips,
}

const relatedResourceData = {
  title: $t.article.related_articles,
  items: props.relatedResource,
}

const popularTags = {
  title: $t.article.popular_tags,
  items: props.resource?.popular_tags,
  // isFixed: true,
}
</script>

<template>
  <div
    :data-vars-rpid="resource.product"
    :data-warden-g-parm="
      base64Encode({
        article_info: {
          level: resource.traffic_type,
        },
        related_product: resource.product,
      })
    "
    class="resource-wrap"
  >
    <PagesArticleBanner v-bind="bannerData">
      <!-- <template #middle>
        <div class="free-trial">
          {{ freeTrial }}
        </div>
      </template> -->
    </PagesArticleBanner>
    <section class="article-content pt20 pb80">
      <BaseContainer class="article-container">
        <div class="article-left">
          <div class="article-left-top">
            <!-- todo downloader下的文章有点不一致 （subType 待传） -->
            <PagesArticleHArticleHeadCard
              :title="summaryData.title"
              :summary="summaryData.summary"
              :sub-type="summaryData.subType"
              :sub-url="summaryData.subUrl"
              :breadcrumb-data="breadcrumbData"
              :author-info="authorInfo"
              :type="type"
            />
            <!-- 内容区 -->
            <div class="post-content" v-html="resource.content"></div>
          </div>

          <template v-if="showBottomBanner">
            <PagesArticleSummary v-bind="bottomBannerInfo" />
          </template>
        </div>
        <!-- 侧边栏 -->
        <PagesArticleTipsSlideBar
          :related-resource-data="relatedResourceData"
          :catalog-data="catalogData"
          :related-tips-data="relatedTipsData"
          :popular-tags="popularTags"
        />
      </BaseContainer>
    </section>
  </div>
</template>
<style lang="less" src="@/assets/style/article_content.less"></style>
<style lang="less" src="@/assets/style/article_base.less"></style>
<style lang="less" src="@/assets/style/article_detail.less" scoped></style>
<style lang="less" src="@/assets/style/article_common.less"></style>
<!-- copy的原来主站的雪碧图 用户渲染文章图标 -->
<style lang="less" src="@/assets/style/sprite/copy_common_1x.less"></style>

<style lang="less" scoped>
:deep(.summary_content p::before) {
  content: none !important;
}
:deep(.icon-download.font-size-20) {
  font-size: 20px !important;
}
</style>
