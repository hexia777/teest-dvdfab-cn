<script lang="ts" setup>
import type { ArticleCategory, ArticleProductInfo, ArticleResource } from '~/apis/interface/article'

const props = defineProps({
  resource: {
    type: Object as PropType<ArticleResource>,
    default: () => {},
  },
  recommendProducts: {
    type: Object as PropType<any[]>,
    default: () => {},
  },
  recommendArticleList: {
    type: Object,
    default: () => {},
  },
  categoryArticle: {
    type: Object,
    default: () => {},
  },
  articleProduct: {
    type: Object,
    default: () => {},
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

const resourceInquiryStartTime = useCookie('resource_inquiry_starttime')
const inquiryModelShow = ref(false)
const locale = useStore.common().locale
const isMobile = useStore.common().mobile
const os = useOs().value
const $t = useI18n().value
const commomJson = useI18n().value.common

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
        tipText: commomJson.download_info,
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
  summary: props.resource.summary ? '<b>' + $t.article.summary + '</b> ' + props.resource.summary : '',
  time: props.resource.time,
  views: props.resource.views,
  subType: ['drmdownloader'].includes(props.type)
    ? props.productInfo[baseBannerPid.value]?.product_name_new
    : props.resource.category,
  subUrl:
    props.type === 'drmdownloader'
      ? props.productInfo[baseBannerPid.value]?.route_new
      : '/' + props.resource.product_url + '.htm',
  ...props.summaryDiffData,
}

interface IArticleLink {
  articlesType: string
  type: string
  url: string
  lang?: string
  pid?: string
}

const getArticleLink = (params: IArticleLink) => {
  const { articlesType, type, url, pid } = params
  if (type === 'special_topic') {
    return '/' + url + '.htm'
  } else if (type === 'topic') {
    return '/' + type + '/' + url + '.htm'
  }

  if (type.includes('downloader') || type.includes('youtube-to-mp3-converter')) {
    return '/' + articlesType + '/' + url + '.htm'
  }

  const articlesL = !['video-download'].includes(type.replace('_', '-'))
  return (articlesL ? '/resource/' : '/') + type.replace(/_/g, '-') + '/' + url + (pid ? '.htm' : '')
}

const recommendArticleItems = computed(() => {
  const arr = [] as any
  props.recommendArticleList.forEach((item: any, index: number) => {
    const obj = { ...item }
    if (item) {
      obj.link = getArticleLink({
        articlesType: item.url_type,
        type: item.type || item.url_type || item.from_type || item.product_url,
        url: item.url,
        pid: props.resource.product,
      })
      // obj.link = '/' + item.url_type + '/' + item.type + '/' + item.url
      obj.img = item.cover_img
        ? item.cover_img
        : useAppConfig().cdn_domain + '/images/resource/article_icon_' + (index + 1) + '.jpg'
    }
    arr.push(obj)
  })
  return arr
})
const recommendArticleData = {
  title: $t.article.related_articles,
  recommendArticleList: recommendArticleItems.value,
}

// summary banner
const summaryBannerPid = getOsField('product_summary_banner')
const pro = props.productInfo[summaryBannerPid]

const summaryBannerInfo = computed(() => {
  return {
    content: getOsField('summary_banner_content'),
    title: getOsField('summary_banner_title'),
    type: props.type,
    summaryPid: summaryBannerPid,
    elkCategory: pro?.route,
    btnList: [
      {
        info: {
          href: pro?.down_url_new,
          showIcon: true,
          icon: 'icon-download font-size-20 font-normal',
          label: commomJson.free_download,
          theme: 'primary',
          os,
          size: 'medium',
          slug: '',
          'data-warden-ck-parm': base64Encode({
            event_value: props.type,
            event_label: 'summary',
            pids: [summaryBannerPid],
          }),
        },
        show: true, // download_url
        component: 'MyButtonDownload',
        tipText: commomJson.download_info,
        tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
      },
      {
        info: {
          href: pro?.route,
          size: 'medium',
          showIcon: true,
          label: commomJson.learn_more,
          theme: 'orange',
          slug: '',
        },
        click: {
          event: 'click',
          event_label: 'summary',
          event_value: props.type,
          event_category: 'learn-more',
        },
        component: 'MyButton',
        tipText: commomJson.buy_info,
        tipIconClass: 'iconfont-sg icon-backend14 font-size-24 pr8 sixth-color',
        show: true, // download_url
      },
    ],
  }
})

// 底部分类banner
const bottomBannerPid = getOsField('product_category_banner')

const showBottomBanner = computed(() => {
  return (
    !['en', 'ja'].includes(locale) &&
    !['youtube_mp3', '8k_media'].includes(props.resource.type) &&
    bottomBannerPid &&
    props?.productInfo[bottomBannerPid]
  )
})

const bottomBannerInfo = computed(() => {
  const pro = props?.productInfo[bottomBannerPid]
  const drmdownloaderBottomBannerLearnMoreBtn = {
    info: {
      href: pro?.route,
      size: 'medium',
      showIcon: false,
      label: useI18n().value.common.learn_more,
      theme: 'primary',
      slug: '',
    },
    click: {
      event: 'click',
      event_label: 'category-banner',
      event_value: props.type,
      event_category: 'learn-more',
    },
    component: 'MyButtonBuy',
    tipText: commomJson.buy_info,
    tipIconClass: 'iconfont-sg icon-backend14 font-size-24 pr8 sixth-color',
    show: true, // download_url
  }
  const btnList: any = [
    {
      info: {
        href: pro?.down_url_new,
        showIcon: true,
        icon: 'icon-download',
        label: commomJson.free_download,
        theme: 'primary',
        os,
        size: 'medium',
        slug: '',
        'data-warden-ck-parm': base64Encode({
          event_value: props.type,
          event_label: 'category-banner',
          pids: [bottomBannerPid],
        }),
      },
      show: true, // download_url
      component: 'MyButtonDownload',
      tipText: commomJson.download_info,
      tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
    },
  ]
  if (props.type === 'drmdownloader') {
    btnList.push(drmdownloaderBottomBannerLearnMoreBtn)
  } else {
    btnList.push({
      info: {
        href: getCheckoutUrl(bottomBannerPid, 'LFT'),
        size: 'medium',
        showIcon: true,
        label: commomJson.buy_now,
        theme: 'orange',
        slug: '',
      },
      click: {
        event: 'buy_now',
        event_value: props.type,
        event_label: 'category-banner',
        pids: [bottomBannerPid],
      },
      component: 'MyButtonBuy',
      tipText: commomJson.buy_info,
      tipIconClass: 'iconfont-sg icon-backend14 font-size-24 pr8 sixth-color',
      show: true, //
    })
  }

  return {
    content:
      getOsField('category_banner_title') +
      '<br>' +
      `<span class="span-desc">${getOsField('category_banner_content')}</span>`,
    title: pro?.product_name,
    type: props.type,
    summaryPid: bottomBannerPid,
    elkCategory: pro?.route,
    btnList,
  }
})

// 推荐产品 props.productInfo
const recommendProList = computed(() => {
  const arr = [] as any
  props.recommendProducts.forEach((item: any) => {
    const obj = { ...item }
    if (item) {
      const pro = props?.productInfo[item.pid] || {}
      obj.name = pro.product_name
      obj.desc = item.txt
      obj.media = {
        loading: '',
        img: 'https://assets.dvdfab.cn/dvdfab/box/' + pro.product_box,
        url: pro.route,
        alt: pro.product_name,
        with: 150,
        height: 150,
      }
      obj.btnList = [
        {
          info: {
            href: pro.down_url_new,
            size: 'normal',
            showIcon: false,
            label: commomJson.try_it_free,
            theme: 'border',
            tag: 'a',
            'data-warden-ck-parm': base64Encode({
              event_value: props.type,
              event_label: 'recommend-pro',
              pids: [item.pid],
            }),
          },
          component: 'MyButtonDownload',
        },
        {
          info: {
            href: getCheckoutUrl(obj.pid, 'LFT'),
            size: 'normal',
            showIcon: false,
            label: commomJson.buy_now,
            theme: 'border-orange',
            tag: 'a',
            click: {
              event: 'buy_now',
              event_value: props.type,
              event_label: 'recommend-pro',
              pids: [obj.pid],
            },
          },
          component: 'MyButtonBuy',
        },
      ]
    }
    arr.push(obj)
  })
  return arr
})
const recommendProInfo = {
  title: $t.resource.resource_1,
  items: recommendProList.value,
}

// 文章侧边栏数据
const hotArticles = {
  title: $t.article.latest_articles,
  items: props?.categoryArticle,
  more: $t.common.learn_more + '>',
  moreUrl: '/' + props.resource.product_url,
}
const latestArticles = {
  title: $t.article.latest_articles,
  items: props?.categoryArticle,
  more: $t.common.learn_more,
  moreUrl: '/downloader-topics.htm',
}
const popularTags = {
  title: $t.article.popular_tags,
  items: props.resource?.popular_tags,
  isFixed: true,
}
const promotionData = {
  img: 'https://c.dvdfab.cn/images/streamfab/promotion/sf_autumn_sale_24/article/en.jpg?t=240603',
  url: 'https://dvdfab.cn/promotion.htm?t=240603',
  name: 'YouTube Downloader Pro',
  pid: 62001,
}

const catalogData = {
  title: $t.article.catalog,
  items: props.resource?.catalog,
}
const SliderBarData = {
  hotArticles,
  catalogData,
  popularTags,
  promotionData,
  latestArticles,
  type: props.type,
}
if (props.type === 'drmdownloader') {
  SliderBarData.hotArticles = [] as any
} else {
  SliderBarData.latestArticles = [] as any
}

const is_block = () => {
  // 获取cookies
  const currentCookie = resourceInquiryStartTime.value
  let openFlag = true
  if (currentCookie) {
    const currentTime = new Date().valueOf()
    openFlag = (currentTime - Number(currentCookie)) / 5 > 86400000
  }
  if (!openFlag) {
    return false
  }
  const { $trace } = useNuxtApp() as any
  $trace.traceCustomEvent({
    event: 'show',
    xargs_event_category: 'popup',
  })
  inquiryModelShow.value = true
}

const closeInquiryDialog = () => {
  inquiryModelShow.value = false
  const { $trace } = useNuxtApp() as any
  $trace.traceCustomEvent({
    event: 'close',
    xargs_event_category: 'popup',
  })
  document.querySelector('.is-block')?.setAttribute('data-close', 'true')
  // 设置cookies，五天内不再弹窗
  resourceInquiryStartTime.value = String(new Date().valueOf())
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
    <PagesArticleBanner v-bind="bannerData" />
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
            <PagesArticleSummary v-bind="summaryBannerInfo" />
            <!-- 内容区 -->
            <div class="post-content" v-html="resource.content"></div>
            <!-- 作者信息 -->
            <PagesArticleAuthorIntro
              class="post-author"
              :author="resource?.author"
              :author-desc="authorInfo.desc || ''"
              :author-avatar="authorInfo.headIcon"
            />
          </div>
          <!-- 评论 -->
          <PagesArticleComment />
          <!-- 相关文章 -->
          <template v-if="recommendArticleList?.length">
            <PagesArticleRelatedList class="mt20 article-related-wrap" v-bind="{ ...recommendArticleData }" />
          </template>

          <!-- todo相关文章底部banner downloader没有 -->
          <template v-if="showBottomBanner">
            <PagesArticleSummary v-bind="bottomBannerInfo" />
          </template>

          <!-- 相关产品 -->
          <template v-if="!['en', 'ja'].includes(locale) && recommendProducts?.length">
            <template v-if="recommendProducts?.length === 3">
              <BlocksCardHArticleProList class="mt20 article-pro-list" v-bind="{ ...recommendProInfo }" />
            </template>
            <template v-else>
              <BlocksCardHArticleProList class="mt20 article-pro-list" v-bind="{ ...recommendProInfo }" />
            </template>
          </template>
        </div>
        <!-- 侧边栏 -->
        <PagesProductResourceArticleSlidebar v-bind="{ ...SliderBarData }" />
      </BaseContainer>
    </section>
    <!-- 弹窗 -->
    <div v-if="!isMobile" class="is-block" data-close="false" @mouseover.self="is_block">
      <PagesProductResourceTopicInquiry
        v-show="inquiryModelShow"
        :pro-name="getOsField('popup_banner_title')"
        :pro-desc="getOsField('popup_banner_content')"
        :download-win-url="productInfo[resource.product_popup_banner]?.down_url_new"
        :download-mac-url="productInfo[resource.mac_product_popup_banner]?.down_url_new"
        :win-pid="resource.product_popup_banner"
        :mac-pid="resource.mac_product_popup_banner"
        :type="type"
        :product-line="productInfo[popupBannerPid]?.product_line"
        @close-dialog="closeInquiryDialog"
      />
    </div>
    <PagesArticleFooterDownloadModel
      :download-url="productInfo[baseBannerPid]?.down_url_new"
      :base-banner-content="getOsField('base_banner_content')"
      :type="type"
      :pid="baseBannerPid"
    />
    <PagesArticleSubscribeNewsModel v-if="type === 'resource' && isMobile" :article-id="resource.id" />
  </div>
</template>
<style lang="less" src="@/assets/style/article_content.less"></style>
<style lang="less" src="@/assets/style/article_base.less"></style>
<style lang="less" src="@/assets/style/article_detail.less" scoped></style>
<style lang="less" src="@/assets/style/article_common.less"></style>
<!-- copy的原来主站的雪碧图 用户渲染文章图标 -->
<style lang="less" src="@/assets/style/sprite/copy_common_1x.less"></style>
<!-- 
<style lang="less" src="@/assets/less/downloader_article.less"></style>
<style lang="less" src="@/assets/less/resource_icon.less"></style> -->
<style lang="less" scoped>
.is-block {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  width: 90%;
  height: 10px;
}
:deep(.icon-download.font-size-20) {
  font-size: 20px !important;
}
</style>
