<script setup lang="ts">
import type { Article } from '~/apis/interface/article'
const os = useOs().value
const commonJson = useI18n().value.common
interface RouteParams {
  type: string
}
interface Route {
  params: RouteParams
  name: string
}
const route = useRoute<Route>()
// console.log('route: ', route)
let { type: routeType } = route.params as { type: string; name: string }

// let { type: routeType } = route.params as { type: string; name: string }

if (route.name === 'recorder') {
  routeType = 'recorder'
}
const specialCategoryUrlMap = {
  downloader: '/downloader-topics.htm',
  topic: '/topic.htm',
  topics: '/topic.htm',
  recorder: '/recorder.htm',
}

const locale = useStore.common().locale

const { data } = await useApi().apiArticle.getArticleCategory(
  {
    lang: locale,
    os,
  },
  {
    immediate: true,
  },
)
const categories = reactive([])
const {
  resource_type: resourceTypes,
  resource_sub_type: resourceSubType,
  recommend_products: recommendProducts,
} = data?.value?.data

if (resourceTypes) {
  // 正确的类型定义
  interface SubCategory {
    name: string
    url: string
  }
  Object.keys(resourceTypes).forEach((key: string) => {
    const item = resourceTypes[key]?.name
    const routeName = `/${routePath}/${key.toLowerCase().replace(/_/g, '-')}`
    const category = {
      name: item,
      url: specialCategoryUrlMap[key] || routeName,
      subcategories: <SubCategory>[],
    }
    const subcategory = resourceSubType?.[key]
    if (subcategory) {
      Object.keys(subcategory).forEach((subKey) => {
        const subItem = subcategory[subKey]?.name
        category.subcategories.push({
          name: subItem,
          url: `/${routePath}/${subKey}`,
        })
      })
    }
    categories.push(category)
  })
} else {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const firstCateSpecialRoute = {
  'downloader-topics': 'downloader',
  downloader: 'downloader',
  topic: 'topic',
  topics: 'topic',
  recorder: 'recorder',
}

const category = ref('')
const subcategory = ref('')

interface Resource {
  [key: string]: any
}
// 有子分类是{}, 没有子分类是[]
const resourceData: Resource = ref({})
const pageLen = ref(6)
const isSubCateStyle = ref(false)
const paginationData = reactive({
  type: 'event',
  pageSize: pageLen.value,
  total: 0,
})

const routePath = 'resource'

const maxPageNum = 10
const subCateTitleMap = ref({})
const subCateLinkMap = ref({})
const getResourceDataByType = async () => {
  if (resourceTypes[routeType.replace(/-/g, '_')]) {
    category.value = routeType.replace(/-/g, '_')
    if (!resourceSubType[category.value]) {
      isSubCateStyle.value = true
      pageLen.value = 12
      paginationData.pageSize = 12
    }
  } else {
    Object.keys(resourceSubType).forEach((key) => {
      Object.keys(resourceSubType[key]).forEach((subKey) => {
        if (subKey.toLowerCase() === routeType.toLowerCase()) {
          category.value = key
          subcategory.value = subKey
          isSubCateStyle.value = true
          pageLen.value = 12
          paginationData.pageSize = 12
        }
      })
    })
  }
  if (subcategory.value) {
    const { data: subResourceRes } = await useApi().apiArticle.getResourceSubCateData(
      {
        lang: locale,
        type: category.value,
        sub_type: subcategory.value,
        len: pageLen.value * maxPageNum,
        // start: (page - 1) * pageLen.value,
        start: 0,
      },
      {
        immediate: true,
      },
    )
    const { total, list } = subResourceRes.value?.data || {}
    if (!list?.length) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    paginationData.total = total > maxPageNum * pageLen.value ? maxPageNum * pageLen.value : total || 0
    resourceData.value = list || []
    const firstCatePrefix = firstCateSpecialRoute[category.value] || routePath
    resourceData.value.forEach((art: Article) => {
      art.link = `/${firstCatePrefix}/${category.value.replace(/_/g, '-')}/${art.url}${
        firstCatePrefix !== routePath ? '.htm' : ''
      }`
      art.authorLink = `/author/${art.author.toLowerCase()}.htm`
      art.img = art.cover_img || art.cover_image || ''
    })
  } else {
    if (!category.value) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    const { data: resourceRes } = await useApi().apiArticle.getResourceCateData(
      {
        lang: locale,
        type: category.value,
        len: pageLen.value,
        // len: !isSubCateStyle.value ? 6 : pageLen.value * maxPageNum,
      },
      {
        immediate: true,
      },
    )
    const { list: listMap, route_info: routeInfo, copywriting_info: titleInfo } = resourceRes.value?.data
    resourceData.value = listMap
    subCateTitleMap.value = titleInfo
    subCateLinkMap.value = routeInfo
    if (!resourceData.value || !Object.keys(resourceData.value)?.length) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    const routePrefix = `${routePath}/${category.value.toLowerCase().replace(/_/g, '-').replace(/\s/g, '-')}`
    if (resourceData.value[category.value]) {
      resourceData.value = resourceData.value[category.value]
      resourceData.value.forEach((art: Article) => {
        if (route.name === 'recorder') {
          art.link = `/recorder/${art.url}`
        } else {
          art.link = `/${routePrefix}/${art.url}`
        }

        art.authorLink = `/author/${art.author.toLowerCase()}.htm`
        art.img = art.cover_img || art.cover_image || ''
      })
    } else {
      if (category.value === 'image') {
        const newList = []
        Object.keys(resourceData.value).forEach((key: string) => {
          const item: Article[] = resourceData.value[key]
          item.forEach((art: Article) => {
            art.link = `/${routePrefix}/${art.url}`
            art.authorLink = `/author/${art.author?.toLowerCase()}.htm`
            art.img = art.cover_img || art.cover_image || ''
          })
          newList.push(...item)
        })
        resourceData.value = newList
        paginationData.total = resourceData.value.length
        isSubCateStyle.value = true
        pageLen.value = 12
        paginationData.pageSize = pageLen.value
      } else {
        Object.keys(resourceData.value).forEach((key: string) => {
          const item: Article[] = resourceData.value[key]
          item.forEach((art: Article) => {
            art.link = `/${routePrefix}/${art.url}`
            art.authorLink = `/author/${art.author.toLowerCase()}.htm`
            art.img = art.cover_img || art.cover_image || ''
          })
        })
      }
    }
  }
}

const titleAndDesc = reactive({
  title: '',
  desc: '',
})
// 获取文章列表
  if (!routeType) {
  let resourceRes = {}
  if (route.name === 'topic') {
    category.value = 'topics'
    const res = await useApi().apiArticle.getTopicData({
      lang: locale,
    })
    resourceRes = res.data
    resourceData.value = resourceRes?.value?.data
    if (!resourceData.value?.length) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    resourceData.value?.forEach((art: Article) => {
      art.link = `/${route.name}/${art.url}.htm`
      art.authorLink = `/author/${art.author.toLowerCase()}.htm`
      art.img = art.cover_img || art.cover_image || ''
    }) || []
    paginationData.total = resourceData.value.length
    isSubCateStyle.value = true
    pageLen.value = 12
    paginationData.pageSize = pageLen.value
  } else if (route.name === 'downloader-topics') {
    category.value = 'downloader-topics'
    const res = await useApi().apiArticle.getDownloadData({
      lang: locale,
    })
    resourceRes = res.data
    resourceData.value = resourceRes.value?.data
    if (!resourceData.value?.length) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    resourceData.value?.forEach((art: Article) => {
      art.link = `/${firstCateSpecialRoute[route.name]}/${art.url}.htm`
      art.authorLink = `/author/${art.author.toLowerCase()}.htm`
      art.img = art.cover_img || art.cover_image || ''
    }) || []
    paginationData.total = resourceData.value.length
    isSubCateStyle.value = true
    pageLen.value = 12
    paginationData.pageSize = pageLen.value
  } else {
    const res = await useApi().apiArticle.getResourceData(
      {
        lang: locale,
      },
      {
        immediate: true,
      },
    )
    resourceRes = res.data
    const { resource, route_info: routeInfo, copywriting_info: titleInfo } = resourceRes?.value?.data || {}
    resourceData.value = resource || []
    subCateTitleMap.value = titleInfo
    subCateLinkMap.value = routeInfo
    if (!resourceData.value) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    titleAndDesc.title = titleInfo[routePath]?.name || ''
    titleAndDesc.desc = titleInfo[routePath]?.desc || ''
    Object.keys(resourceData.value).forEach((key: string) => {
      const item: Article[] = resourceData.value[key]
      const routePrefix = firstCateSpecialRoute[key]
        ? `${firstCateSpecialRoute[key]}`
        : `${routePath}/${key.replace(/_/g, '-')}`
      item.forEach((art: Article) => {
        art.link = `/${routePrefix}/${art.url}${!routePrefix.includes(routePath) ? '.htm' : ''}`
        art.authorLink = `/author/${art.author.toLowerCase()}.htm`
        art.img = art.cover_img || art.cover_image || ''
      })
    })
  }
} else {
  await getResourceDataByType()
}
const topBannerData =
  recommendProducts[firstCateSpecialRoute[category.value]] ||
  recommendProducts[routeType] ||
  recommendProducts[routeType?.replace(/-/g, '_').toLowerCase()] ||
  recommendProducts[routePath]
let trackLabel = `${firstCateSpecialRoute[category.value] || routePath}${
  routeType ? '_' + routeType.replace(/-/g, '_') : ''
}`
if (routeType === (firstCateSpecialRoute[category.value] || routePath)) {
  trackLabel = routeType
}
const bannerData = computed(() => {
  const title = topBannerData?.top_title
  const desc = topBannerData?.top_content
  const boxImg = `https://assets.dvdfab.cn/dvdfab/box/${topBannerData?.product_box}`
  return {
    title,
    desc,
    // 产品信息
    proInfo: {
      name: topBannerData?.product_name,
      url: topBannerData?.route_new,
    },
    imgInfo: {
      url: boxImg,
      width: '255',
      height: '255',
      alt: topBannerData?.product_name ?? '',
    },
    bgImg: 'https://c1.dvdfab.cn/images/article/1x_m/banner_new.jpg',
    titleLink: topBannerData?.route_new,
    boxImgElkParams: {
      xargs_event_category: `${trackLabel}_guide_buy`,
      event_label: `${trackLabel}_banner_productbox`,
    },
    titleElkParams: {
      xargs_event_category: `${trackLabel}_guide_buy`,
      event_label: `${trackLabel}_banner_productname`,
    },
    btnList: [
      {
        info: {
          href: topBannerData?.down_url_new,
          showIcon: true,
          label: useI18n().value.common.free_download,
          theme: 'primary',
          icon: 'icon-download font-size-20 font-normal',
          size: 'medium',
          slug: '',
          'data-warden-ck-parm': base64Encode({
            event_value: trackLabel,
            event_label: 'banner',
            pids: [recommendProducts.pid],
          }),
        },
        component: 'MyButtonDownload',
        tipText: commonJson.download_info,
        tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
      },
      {
        info: {
          href: topBannerData?.route_new,
          size: 'medium',
          showIcon: false,
          label: useI18n().value.common.learn_more,
          theme: 'primary',
          slug: '',
        },
        click: {
          event: 'click',
          event_label: 'banner',
          event_value: trackLabel,
          event_category: 'learn_more',
        },
        component: 'MyButtonBuy',
        tipText: '',
        tipIconClass: '',
      },
    ],
  }
})

const breadcrumbData = [
  {
    label: useI18n().value.article.home,
    link: '/',
  },
]
let commonPageType: string = routeType ? `resource-${routeType}` : 'resource'
if (route.name === 'resource-type' || route.name === 'resource') {
  const cateRoute = {
    label: useI18n().value.common.resources,
  }
  if (route.name === 'resource-type') cateRoute.link = '/resource'
  breadcrumbData.push(cateRoute)
  if (category.value) {
    breadcrumbData.push({
      label: resourceTypes[category.value]?.name,
      link: subcategory.value
        ? categories.find(
            (cate) => cate.name.toLowerCase() === resourceTypes[category.value]?.name?.toLowerCase(),
          )?.url
        : '',
    })
    if (subcategory.value) {
      breadcrumbData.push({ label: resourceSubType[category.value][subcategory.value].name })
    }
  }
} else {
  breadcrumbData.push({
    label: resourceTypes[firstCateSpecialRoute[route.name]]?.name || resourceTypes.topics?.name,
  })
  commonPageType = route.name
}

const apiCommon = useApi().apiCommon
const { data: resourceRes, error } = await apiCommon.getCommonPageData({
  'populate[seo][populate]': '*',
  '[filters][slug][$eq]': commonPageType,
  locale: useStore.common().locale,
})
if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Server Error' })
}
if (resourceRes.value && resourceRes.value.data) {
  const data = getStrapiData(resourceRes.value.data?.[0] || {})
  usePageSeo({ title: data?.title, ...(data?.seo || {}) })
}
const currentPage = ref(1)

const changePage = async (page: number) => {
  currentPage.value = page
}

const moreText = useI18n().value.common.more

const headerData = computed(() => {
  const specialRouteName =
    route.name === 'topic' ? 'topics' : route.name === 'downloader-topics' ? 'downloader' : category.value
  return {
    title:
      titleAndDesc.title ||
      resourceSubType[specialRouteName]?.[routeType]?.name ||
      resourceTypes[specialRouteName]?.name,
    desc:
      titleAndDesc.desc ||
      resourceSubType[specialRouteName]?.[routeType]?.desc ||
      resourceTypes[specialRouteName]?.desc,
  }
})

const getMoreBtnUrl = (key: string) => {
  const url =
    subCateLinkMap.value[key] ||
    specialCategoryUrlMap[key] ||
    categories.find((cate) => cate.name === resourceTypes[key]?.name)?.url ||
    categories
      .find((cate) => cate.name === resourceTypes[category.value]?.name)
      ?.subcategories.find((subcate) => subcate.name === key)?.url
  return url
}
</script>

<template>
  <div class="resource-page pb20">
    <PagesArticleBanner v-bind="bannerData" />
    <PagesArticleCategoryNav :categories="categories" />
    <BaseContainer>
      <BaseBreadcrumb class="article-breadcrumb" :list="breadcrumbData" />
      <h1 class="title mt20 text-center" v-html="headerData.title"></h1>
      <div class="desc mt20 mb40 text-center" v-html="headerData.desc"></div>
      <template v-if="!isSubCateStyle">
        <template v-for="(value, key) in resourceData" :key="key">
          <template v-if="value.length">
            <div class="header flex justify-between mb30">
              <h2 class="title3 list-title pb10">
                {{ subCateTitleMap[key]?.name || subCateTitleMap[key] }}
              </h2>
              <a :href="getMoreBtnUrl(key)" class="more-btn">{{ moreText + ' >' }}</a>
            </div>
            <div class="content flex flex-wrap gap30 mb60">
              <template v-for="(item, index) in value" :key="index">
                <BlocksArticlesCard
                  :hasAuthorLink="true"
                  v-if="item.title"
                  class="art-card"
                  :article="item"
                />
              </template>
            </div>
          </template>
        </template>
      </template>
      <template v-else>
        <div class="content" :class="paginationData.total > paginationData.pageSize ? 'mb40' : 'mb60'">
          <template v-for="index in Math.ceil(resourceData.length / pageLen)" :key="index">
            <ul class="flex flex-wrap gap30" v-show="index === currentPage">
              <template v-for="idx in pageLen" :key="`${index}_${idx}`">
                <BlocksArticlesCard
                  :hasAuthorLink="true"
                  v-if="resourceData?.[(index - 1) * pageLen + idx - 1]?.title"
                  class="art-card"
                  :article="resourceData[(index - 1) * pageLen + idx - 1]"
                />
              </template>
            </ul>
          </template>
        </div>
        <BasePagination
          v-if="paginationData.total > paginationData.pageSize"
          class="article-pagination mb60"
          @changePage="changePage"
          v-bind="paginationData"
        />
      </template>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.resource-page {
  background: #f7f7f7;
  overflow: hidden;

  .article-breadcrumb {
    padding: 20px 0;
  }

  .header {
    border-bottom: 1px solid #e6e6e6;
    .list-title {
      border-bottom: 4px solid @primary-color;
    }
    .more-btn {
      height: fit-content;
      cursor: pointer;
      color: @btn-primary-color;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .content {
    width: 100%;
  }
  .art-card {
    width: calc((100% - 30px * 2) / 3);
    flex-shrink: 0;
  }
}
@media (max-width: 1024px) {
  .resource-page {
    .art-card {
      width: calc((100% - 30px) / 2);
    }
  }
}
@media (max-width: 640px) {
  .resource-page {
    .art-card {
      width: 100%;
    }
  }
}
</style>
