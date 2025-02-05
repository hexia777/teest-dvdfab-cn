<script setup lang="ts">
definePageMeta({
  middleware: 'get-faq-detail',
})
const route = useRoute()
const apiFaq = useApi().apiFaq
const lang = useStore.common().locale

const url = route.params?.url as string
const id = route.params?.id as string

const currentPage = ref(1)
const pageSize = 10

// 类型页面且带了分页参数
if (id && url && url.substring(0, 4) === 'page') {
  const match = url.match(/\d+/)
  if (match) {
    currentPage.value = Number(match[0])
  }
  currentPage.value = Number(url.substring(4, url.length)) // 获取当前页码
  if (isNaN(currentPage.value)) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
}

const { data: faqTypes } = await apiFaq.getFaqTypes({
  lang,
  route_name: 'type',
})
let hasTargetType = false
if (faqTypes.value?.cscode === 0) {
  hasTargetType = !!faqTypes.value?.data?.find((item: any) => item.route_name === id)
}

const getTypePageData = () => {
  return Promise.all([
    apiFaq.getFaqCategory({
      lang,
      route_name: id,
      len: pageSize,
      page: currentPage,
      paging: 1, // 是否分页
    }), // 问题列表
    apiFaq.getFaqCategory({
      lang,
      route_name: 'search', // index 分类
      len: 10,
    }),
    getPageData(),
  ])
}

const getDetailPageData = () => {
  return Promise.all([
    apiFaq.getFaqRelate({
      lang,
      route_name: id,
      len: 5,
    }), // 关联问题列表
    apiFaq.getFaqCategory({
      lang,
      route_name: 'search', // index 分类
      len: 10,
    }),
    getPageData(),
  ])
}

const getPageData = () => {
  return useCommonPageData({
    'populate[seo][populate]': '*',
    '[filters][slug][$eq]': 'faq-type',
    'populate[locales]': '*',
    'populate[blocks][populate]': 'media',
    locale: lang,
  })
}

// const isTypePage = ref(hasTargetType)
const faqs = ref<any>([])
const faqTotal = ref<number>(0)
const faqCategory = ref<any>([])
const faqDetail = ref<any>()
const pageRes = shallowRef<any>({})
let categoryName = id
if (hasTargetType) {
  const [{ data: faqRes }, { data: faqCategoryRes }, pageResData] = await getTypePageData()
  if (
    faqRes.value?.cscode !== 0 ||
    faqCategoryRes.value?.cscode !== 0 ||
    !faqRes.value?.data ||
    !faqCategoryRes.value?.data
  ) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }

  faqs.value = faqRes.value?.data?.list || []
  faqTotal.value = faqRes.value?.data?.total || []
  categoryName = faqRes.value?.data?.category_name || ''

  faqCategory.value = faqCategoryRes.value?.data?.list || []

  pageRes.value = pageResData
} else {
  const [{ data: faqRelateRes }, { data: faqCategoryRes }, pageResData] = await getDetailPageData()
  const { data: faqDetailRes } = useNuxtData('page-data')
  // console.log('===========detail', faqDetailRes.value)

  if (
    faqDetailRes.value?.cscode !== 0 ||
    faqRelateRes.value?.cscode !== 0 ||
    !faqDetailRes.value?.data ||
    !faqRelateRes.value?.data
  ) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  faqDetail.value = faqDetailRes.value?.data || {}

  faqs.value = faqRelateRes.value?.data || []

  if (faqCategoryRes.value?.cscode === 0) {
    faqCategory.value = faqCategoryRes.value?.data?.list || []
  }
  pageRes.value = pageResData
}

const locales = convertStrapiLocalesToObject(pageRes.value.locales)

const handleMetaDesc = (content: string) => {
  if (!content) {
    return ''
  }
  let firstSentence = content
  if (content.includes('.')) {
    firstSentence = content.split('.')[0]
  } else if (content.includes('。')) {
    firstSentence = content.split('。')[0]
  }
  firstSentence = firstSentence.replace(/<\/?[^>]+(>|$)/g, '')

  if (firstSentence.length > 160) {
    return firstSentence.slice(0, 157) + '...'
  }

  return firstSentence
}

const faqsTitle = hasTargetType ? locales.faq_title : locales.faq_title_2
const pageTitle = hasTargetType
  ? `${pageRes.value.title}${categoryName}`
  : `${pageRes.value.title}${faqDetail.value.title}`

// console.log('================', pageTitle, categoryName)
const pageMetaDescription = hasTargetType
  ? pageRes.value.seo?.metaDescription + categoryName
  : handleMetaDesc(faqDetail.value.content)

usePageSeo({ title: pageTitle, ...(pageRes.value.seo || {}), metaDescription: pageMetaDescription })

// console.log('===========detailfaqRelate.value', faqRelate.value)

const search_empty = locales.search_empty
// Banner
const breadcrumbData = {
  hasBg: false,
  list: [
    {
      label: useI18n().value.article.home,
      link: '/',
      active: true,
    },
    {
      label: locales.banner_title,
      link: '/faq.htm',
      // active: true,
    },
    {
      label: hasTargetType ? categoryName : faqDetail.value.title,
      // active: true,
    },
  ],
}

const bannerData = {
  title: locales.banner_title,
  searchTips: locales.search_tips,
  cardData: {
    hideWord: false,
    defaultVal: '',
    prop: 'keyword',
  },
  keywordTitle: locales.search_word_tips,
}

const changePage = async (page: number) => {
  const { data: faqRes } = await apiFaq.getFaqCategory({
    lang,
    route_name: id,
    len: pageSize,
    page,
    paging: 1, // 是否分页
  })
  currentPage.value = page
  if (faqRes.value?.cscode === 0) {
    faqs.value = faqRes.value?.data?.list || []
    faqTotal.value = faqRes.value?.data?.total || []
  }
}

const handSearchData = (obj: any = {}, type: any) => {
  if (type !== 'init') {
    if (hasTargetType) {
      window.location.href = `/faq/search-result.htm?words=${obj.keyword || ''}&type=${id}`
      return
    }
    window.location.href = `/faq/search-result.htm?words=${obj.keyword || ''}`
  }
}
</script>

<template>
  <div>
    <PagesFaqSearchBanner
      v-bind="bannerData"
      :breadcrumb-data="breadcrumbData"
      :keyword-data="faqCategory"
      class="mb80"
      @hand-search-data="handSearchData"
    />
    <BaseContainer v-if="!hasTargetType">
      <div class="mb80">
        <a :id="id" class="anchor"></a>
        <div>
          <div v-if="faqDetail.content && faqDetail.title">
            <div class="title mb40" v-html="faqDetail.title"></div>
            <div class="answer" v-html="faqDetail.content"></div>
          </div>

          <div v-else class="empty">
            <my-img
              src="https://c6.dvdfab.cn/images/faq/empty.png"
              width="260"
              height="140"
              alt="faq-empty"
            />
            <p class="empty-text mt15" v-html="search_empty"></p>
          </div>
        </div>
      </div>
    </BaseContainer>
    <!-- <PagesFaqSearchList :items="faqTypes" /> -->
    <div class="pb80">
      <PagesFaqPopularQuestions
        v-if="faqs?.length"
        :start-num="pageSize * (currentPage - 1)"
        :faqs="faqs"
        :title="faqsTitle"
      />
      <div v-if="faqTotal > pageSize" class="mt40">
        <BasePagination
          type="route"
          :current-page-prop="currentPage"
          :total="faqTotal"
          :page-url="`/faq/${id}`"
          suffix=""
          :page-size="pageSize"
          @change-page="changePage"
        />
      </div>
    </div>
    <!-- <PagesContact :contact="contact" :block-class="blockClass" /> -->
    <div v-if="pageRes.blocks && pageRes.blocks.length">
      <template v-for="item in pageRes.blocks" :key="item.id">
        <component
          :is="dynamicComponent(item.component_dir, item.component_file_name)"
          v-bind="{
            ...removeBlocksDataNullKey(item),
          }"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.contact-page-faq {
  background: #f4fcff;
}

.anchor {
  position: absolute;
  top: -100px;
}

.title {
  padding: 20px 32px;
  background: #f4f4f4;
  font-size: 24px;
  font-weight: 700;
  border-radius: 10px;
}
.answer {
  margin: 0 32px;
  :deep(p) {
    font-size: 18px;
    line-height: 28px;
  }
  :deep(div) {
    font-size: 18px;
    line-height: 28px;
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
:deep(.contact-out) {
  background-color: #f1fafd !important;
}
</style>
