<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  ArticleResource,
  ArticleProductInfo,
  ArticleProduct,
  ArticleCategory,
} from '~/apis/interface/article'
const props = defineProps({
  recommendProducts: {
    type: Object as PropType<ArticleResource>,
    default: () => {},
  },
  hotArticles: {
    type: Object,
    default: () => {},
  },
  latestArticles: {
    type: Object,
    default: () => {},
  },
  catalogData: {
    type: Object,
    default: () => {},
  },
  popularTags: {
    type: Object,
    default: () => {},
  },
  promotionData: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String as PropType<ArticleCategory>,
    default: '',
  },
})
const route = useRoute()
const $t = useI18n().value
const cookies_name = ref<string>('')
const diffTimeFun = (start, end) => {
  return Math.floor((end - start) / 60 / 60 / 24)
}
onBeforeMount(() => {
  updateCookies()
})

const updateCookies = () => {
  const thumbs = localStorage.getItem('resource_thumbs_up')
  if (thumbs && JSON.parse(thumbs).length) {
    const thumbsList = JSON.parse(thumbs)
    const currentTime = parseInt(new Date().getTime() / 1000 + '') + '' // 获取当前时间戳
    thumbsList.forEach((item, index) => {
      if (route?.params?.id === item.url) {
        const diffTime = diffTimeFun(item.createTime, currentTime)
        if (diffTime < 3) {
          cookies_name.value = item.thumbs
        } else {
          const newList = thumbsList.filter((i, n) => {
            return index !== n
          })
          localStorage.setItem('resource_thumbs_up', JSON.stringify(newList))
        }
      }
    })
  }
}
</script>

<template>
  <div class="article-sidebar">
    <!-- <PagesProductResourceArticleHotProducts class="mb20" /> -->
    <!-- <PagesProductResourceArticleRecommendedPro class="mb20" />
          <PagesProductResourceRecommendProDownload class="mb20" />
          <PagesProductResourceBaseRecommendedAioPro class="mb20" /> -->
    <!-- latest article -->
    <PagesProductResourceArticleHotProducts
      v-if="hotArticles?.items?.length"
      class="mb20"
      v-bind="{ ...hotArticles }"
    />
    <PagesProductResourceArticleLatest
      v-if="latestArticles?.items && latestArticles?.items[0] && latestArticles?.items[0]?.articles?.length"
      class="mb20"
      v-bind="{ ...latestArticles }"
    />
    <!-- Tags -->
    <PagesProductResourceArticlePopularTags
      v-if="popularTags?.items?.length && type !== 'drmdownloader'"
      class="mb20"
      v-bind="{ ...popularTags }"
    />
    <!-- 活动图 -->
    <PromotionResourceBanner class="mb20" :pro-line="'streamfab'" />
    <div v-if="catalogData?.items?.length" class="sticky top-100 mt20">
      <!-- 目录 -->
      <PagesProductResourceArticleCatalog
        v-if="catalogData?.items?.length"
        class="mb20"
        v-bind="{ ...catalogData }"
      />
      <!-- 点赞 -->
      <template v-if="type !== 'topic'">
        <PagesProductResourceThumbUp
          :title="$t.article.thumbs_text"
          :cookies-name="cookies_name"
          @update="updateCookies"
        />
      </template>
    </div>
  </div>
</template>
