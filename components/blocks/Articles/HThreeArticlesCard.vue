<script setup>
const { apiArticle } = useApi()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  id: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array,
    default: () => [],
  },
  hasAuthorLink: {
    type: Boolean,
    default: false,
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg bg-normal' }
    },
  },
})

const locale = useStore.common().locale
const articleInfoList = reactive({})
if (props.items?.length) {
  const url_list = props.items?.map((item) => item.value) || []
  const url_list_obj = {}
  url_list.forEach((url, index) => {
    if (url.includes('http://') || url.includes('https://')) {
      const pathname = new URL(url).pathname
      url = url.includes('review.') ? '/review' + pathname : pathname
    }
    url_list_obj[index + 1] = url
  })
  const params = {
    lang: locale,
    url_list: url_list_obj,
    extend: 1,
  }

  const { data } = await apiArticle.getFirstImgUrl(params, { immediate: true, key: String(props.id) })
  // console.log('params: ', JSON.stringify(params))
  Object.keys(data.value.data).forEach((key) => {
    const item = data.value.data[key]
    articleInfoList[key] = item
  })
}

const list = computed(() => {
  const newList =
    (props.items?.length &&
      props.items?.map((item, idx) => {
        const articleInfo = articleInfoList[idx + 1]
        if (articleInfo) {
          const newItem = {
            link: item.value,
            ...articleInfo,
          }
          if (props.hasAuthorLink) {
            newItem.authorLink = `/author/${articleInfo.author?.toLowerCase().replaceAll(' ', '-')}.htm`
          }
          return newItem
        }
        return item
      })) ||
    []
  return newList
})
</script>

<template>
  <div class="article-content-2 block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 v-if="title" class="title2 article-title mb40 text-center" v-html="title"></h2>
      <ul class="article-ul flex gap30">
        <template v-for="(item, key) in list" :key="key">
          <BlocksArticlesCard
            v-if="item.title"
            :has-author-link="hasAuthorLink"
            :article="item"
            class="art-card"
          />
        </template>
      </ul>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.article-content-2 {
  .article-ul {
    flex-wrap: wrap;
    .art-card {
      width: calc((100% - 30px * 2) / 3);
    }
  }
}
@media (max-width: 1024px) {
  .article-content-2 {
    padding-top: 38;
  }
}
@media (max-width: 768px) {
  .article-content-2 {
    padding-top: 38;
    .article-ul {
      .art-card {
        width: 100%;
      }
    }
  }
}
</style>
