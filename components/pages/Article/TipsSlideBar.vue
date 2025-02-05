<script lang="ts" setup>
import type { PropType } from 'vue'
import type { ArticleCategory } from '~/apis/interface/article'

const props = defineProps({
  catalogData: {
    type: Object,
    default: () => {},
  },
  relatedTipsData: {
    type: Object,
    default: () => {},
  },
  relatedResourceData: {
    type: Object,
    default: () => {},
  },
  popularTags: {
    type: Object,
    default: () => {},
  },

  type: {
    type: String as PropType<ArticleCategory>,
    default: '',
  },
})

const lang = useStore.common().locale

const formatArticleUrl = (url: string) => {
  if (!url) {
    return ''
  }
  const newUrl = url.replace(/_/g, '-')
  return newUrl
}

const getRelatedResourceLink = (lang: string, type: string, url: string) => {
  if (lang === 'ja') {
    return formatArticleUrl(`/${type}/${url}.html`)
  }
  if (type.includes('downloader') || type.includes('youtube-to-mp3-converter')) {
    return formatArticleUrl(`/${type}/${url}`)
  }
  return formatArticleUrl(`/resource/${type}/${url}`)
}

onBeforeMount(() => {})
</script>

<template>
  <div class="article-sidebar">
    <div v-if="relatedTipsData.tips && relatedTipsData.tips.length" class="related-tips mb20">
      <PagesProductResourceArticleWithBgTitle :title="relatedTipsData.title" />
      <ul class="p20 my-a">
        <li v-for="item in relatedTipsData.tips" :key="item.id">
          <a
            v-if="item.title"
            :href="'/' + item.article_type + '/' + item.url + '.htm'"
            v-html="item.title"
          ></a>
        </li>
      </ul>
    </div>
    <div v-if="relatedResourceData.items && relatedResourceData.items.length" class="related-tips mb20">
      <PagesProductResourceArticleWithBgTitle :title="relatedResourceData.title" />
      <ul class="p20 my-a">
        <li v-for="item in relatedResourceData.items" :key="item.id">
          <a
            v-if="item.title"
            :href="getRelatedResourceLink(lang, item.type, item.url)"
            v-html="item.title"
          ></a>
        </li>
        <div></div>
      </ul>
      <!-- <div class="tr">
        <a href="/resource" v-html="$t('tips.learn_more_2')"></a>
      </div> -->
    </div>

    <!-- Tags -->
    <!-- <PagesProductResourceArticlePopularTags
      v-if="popularTags?.items?.length"
      class="mb20"
      v-bind="{ ...popularTags }"
    /> -->

    <div v-if="catalogData?.items?.length" class="sticky top-100 mt20">
      <!-- 目录 -->
      <PagesProductResourceArticleCatalog
        v-if="catalogData?.items?.length"
        class="mb20"
        v-bind="{ ...catalogData }"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.related-tips {
  background-color: #fff;
  ul {
    li {
      @apply pb16;
      @apply pl20 relative flex justify-between;
      color: @link-text-color;
      &:before {
        @apply absolute top-8 left-0 w-6 h-6 b-rd-50\%;
        content: '';
        background: @base-text-color;
      }
      &:hover {
        &:before {
          background: @link-text-color;
        }
      }
      a {
        color: @base-text-color;
        &:hover {
          color: @link-text-color;
        }
      }
    }
  }
}
</style>
