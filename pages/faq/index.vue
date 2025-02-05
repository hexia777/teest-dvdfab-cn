<script setup lang="ts">
const apiFaq = useApi().apiFaq
const lang = useStore.common().locale

const faqs = ref<any>([])
const faqCategory = ref<any>([])
const faqTypes = ref<any>([])

const getIndexFaqCategory = async () => {
  const { data: faqsRes } = await apiFaq.getFaqCategory({
    lang,
    route_name: 'index', // index 分类
    len: 10,
  })
  // console.log('faqCategoryResfaqCategoryRes==============Index', faqsRes)
  if (faqsRes.value?.cscode === 0) {
    faqs.value = faqsRes.value?.data.list || []
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

const getFaqTypes = async () => {
  const { data: faqTypesRes } = await apiFaq.getFaqTypes({
    lang,
    route_name: 'type',
  })
  // console.log('faqTypesResfaqTypesRes==============', faqTypesRes)
  if (faqTypesRes.value?.cscode === 0) {
    faqTypes.value = faqTypesRes.value?.data || []
  }
}

const getPageData = () => {
  return useCommonPageData({
    'populate[seo][populate]': '*',
    '[filters][slug][$eq]': 'faq',
    'populate[locales]': '*',
    locale: lang,
    'populate[blocks][populate]': 'media',
    'populate[faqIcons][populate]': 'media',
  })
}

const [, , , pageRes] = await Promise.all([
  getIndexFaqCategory(),
  getFaqCategory(),
  getFaqTypes(),
  getPageData(),
])

if (faqTypes.value.length && pageRes.faqIcons && pageRes.faqIcons.length) {
  faqTypes.value = faqTypes.value.map((item: any) => {
    const icon = pageRes.faqIcons.find((i: any) => i.title === item.route_name)
    return {
      ...item,
      iconData: icon,
    }
  })
}

// console.log('================pageRes', pageRes)
const locales = convertStrapiLocalesToObject(pageRes.locales)

usePageSeo({ title: pageRes.title, ...(pageRes.seo || {}) })

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
      //  { label: this.$t('common_basic.common_1'), link: this.$t('common_basic.common_29') },
      label: locales.banner_title,
      // link: '/faq.htm',
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

const handSearchData = (obj: any = {}, type: any) => {
  if (type !== 'init') {
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
      @hand-search-data="handSearchData"
    />
    <PagesFaqSearchList :items="faqTypes" />
    <div class="block-box pt0">
      <PagesFaqPopularQuestions v-if="faqs?.length" :faqs="faqs" :title="locales.faq_title || ''" />
    </div>
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
    <!-- <PagesContact :contact="contact" :block-class="blockClass" /> -->
  </div>
</template>

<style scoped lang="less">
:deep(.contact-out) {
  background-color: #f1fafd !important;
}
</style>
