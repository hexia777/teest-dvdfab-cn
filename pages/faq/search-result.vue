<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const apiFaq = useApi().apiFaq
const lang = useStore.common().locale

const currentPage = ref(1)
const searchWords = ref(route.query.words as string)
const type = route.query.type || ''
const faqs = ref<any>([])
const faqTotal = ref<number>(0)
const faqCategory = ref<any>([])
const pageRes = shallowRef({} as any)

const searchFaq = async (keyword: string, page: number) => {
  currentPage.value = page
  const { data: faqRes } = await apiFaq.searchFaq({
    keyword,
    lang,
    len: 5,
    page,
    type,
  })
  // console.log('faqResfaqRes==============', faqRes)
  if (faqRes.value?.cscode === 0) {
    faqs.value = faqRes.value?.data?.list || []
    faqTotal.value = faqRes.value?.data?.total || 0
  }
}

const fetchFaqPageData = async (keyword: string, page: number) => {
  currentPage.value = page
  const faqRes: any = await $fetch(useRuntimeConfig().public.API_PHP + '/faq/search', {
    method: 'POST',
    body: {
      keyword,
      lang,
      len: 5,
      page,
      type,
    },
  })
  if (faqRes?.cscode === 0) {
    faqs.value = faqRes?.data?.list || []
    faqTotal.value = faqRes?.data?.total || 0
  }
}

const getFaqCategory = async () => {
  const { data: faqCategoryRes } = await apiFaq.getFaqCategory({
    lang,
    route_name: 'search', // index 分类
    len: 10,
  })
  // console.log('faqCategoryResfaqCategoryRes==============', faqCategoryRes)
  if (faqCategoryRes.value?.cscode === 0) {
    faqCategory.value = faqCategoryRes.value?.data.list || []
  }
}

const getPageData = async () => {
  const res = await useCommonPageData({
    'populate[seo][populate]': '*',
    '[filters][slug][$eq]': 'faq-search-result',
    'populate[locales]': '*',
    locale: lang,
    'populate[blocks][populate]': 'media',
  })
  pageRes.value = res
  // console.log('pageRespageRes==============', pageRes.value)
}

if (searchWords) {
  await Promise.all([searchFaq(searchWords.value, 1), getFaqCategory(), getPageData()])
} else {
  await Promise.all([getFaqCategory(), getPageData()])
}

const locales = convertStrapiLocalesToObject(pageRes.value.locales)

usePageSeo({ title: pageRes.value.title, ...(pageRes.value.seo || {}) })

const changePage = (page: number) => {
  fetchFaqPageData(searchWords.value, page)
}
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
      label: locales.bread_nav_search,
    },
  ],
}

const bannerData = {
  title: locales.banner_title,
  searchTips: locales.search_tips,
  cardData: {
    hideWord: false,
    defaultVal: searchWords.value || '',
    prop: 'keyword',
  },
  keywordTitle: locales.search_word_tips,
}

const faqTips = computed(() =>
  locales.faq_tips ? locales.faq_tips.replace('{words}', searchWords.value) : '',
)
const localesData = computed(() => ({
  tips: locales.faq_tips,
  results: locales.results,
  search_empty: locales.search_empty,
  search_tips: faqTips.value,
}))

const handSearchData = (obj: any = {}) => {
  if (searchWords.value === obj.keyword) {
    return
  }
  searchWords.value = obj.keyword
  fetchFaqPageData(searchWords.value, 1)
  const query: any = {}

  if (type) {
    query.type = type
  }
  query.words = obj.keyword
  router.replace({
    path: route.path,
    query,
  })
  // if (type !== 'init') {
  //   window.location.href = `/faq/search-result.htm?words=${obj.keyword || ''}`
  // }
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

    <PagesFaqSearchResult
      :search-words="searchWords"
      :faqs="faqs"
      :faq-total="faqTotal"
      :locales="localesData"
      :current-page="currentPage"
      @change-page="changePage"
    />

    <PagesFaqBlocks :blocks="pageRes.blocks" />
  </div>
</template>

<style scoped lang="less">
.contact-page-faq {
  background: #f4fcff;
}
:deep(.contact-out) {
  background-color: #f1fafd !important;
}
</style>
