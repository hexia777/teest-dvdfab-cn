<script setup lang="ts">
const locale = useStore.common().locale
const { data } = await useApi().apiArticle.getAuthorList({ lang: locale })

const authorList =
  data.value?.data?.map((item) => {
    return {
      id: item.id,
      name: item.name,
      url: `/author/${item.name.toLowerCase()}.htm`,
      icon: `https://c.dvdfab.cn/images/article/author/${locale}/${item.name.toLowerCase()}.png`,
    }
  }) || []

const articleList = ref([])
const pageNum = ref(1)
const pageLen = ref(9)
const maxPageNum = 10

const route = useRoute()
const authorId = route.params?.id
const authorPage = route.params?.page || 1
const paginationData = reactive({
  type: authorId ? 'route' : 'event',
  pageSize: pageLen.value,
  total: 0,
  pageUrl: authorId ? `/author/${authorId}` : '',
  pageParams: '',
  currentPageProp: authorPage,
})

const authorInfo = ref({})
const getAuthorArticleList = async (author?: string) => {
  const params = {
    lang: locale,
    start: (Number(authorPage) - 1) * pageLen.value,
    len: !authorId ? pageLen.value * maxPageNum : pageLen.value,
  }
  if (author) params.author = author
  const { data: authorArticleRes } = await useApi().apiArticle.getAuthorArticleList(params)
  const res = authorArticleRes.value || {}
  const { article: articleData, product_info: productMap } = res.data
  if (!articleData?.list?.length || !productMap) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  articleList.value =
    articleData?.list?.map((item) => {
      return {
        ...item,
        authorLink: `/author/${item.author.toLowerCase()}.htm`,
        link: `/${item.article_type}${item.type ? '/' + item.type.replace(/_/g, '-') : ''}/${item.url}${
          item.article_type === 'resource' ? '' : '.htm'
        }`,
        img: item.cover_img,
        tag: productMap[item.product]?.product_name_new || '',
        tagUrl: productMap[item.product]?.route_new || '',
      }
    }) || []
  const total = articleData?.total || 0
  paginationData.total = total > maxPageNum * pageLen.value ? maxPageNum * pageLen.value : total
  if (author && articleData?.list?.[0]?.author_info) {
    authorInfo.value = articleData?.list?.[0]?.author_info
    authorInfo.value.icon = `https://c.dvdfab.cn/images/article/author/${locale}/${authorInfo.value.author_name.toLowerCase()}.png`
    authorInfo.value.addressList = [
      {
        name: 'facebook',
        icon: 'icon-facebook',
        url: authorInfo.value.facebook_address,
      },
      {
        name: 'instagram',
        icon: 'icon-instagram',
        url: authorInfo.value.instagram_address,
      },
      {
        name: 'linkedin',
        icon: 'icon-linkedin',
        url: authorInfo.value.linkedin_address,
      },
      {
        name: 'pinterest',
        icon: 'icon-pinterest',
        url: authorInfo.value.pinterest_address,
      },
      {
        name: 'twitter',
        icon: 'icon-twitter',
        url: authorInfo.value.twitter_address,
      },
    ]
  }
}

await getAuthorArticleList(authorId)
usePageSeo({
  title: authorInfo.value?.meta_title,
  ...{
    metaTitle: authorInfo.value?.meta_title,
    metaDescription: authorInfo.value?.meta_description,
    keywords: authorInfo.value?.meta_keywords,
  },
})

const resourceCateList = ref([])
const localesMap = ref({})
const apiCommon = useApi().apiCommon
const { data: resourceRes, error } = await apiCommon.getCommonPageData({
  'populate[seo][populate]': '*',
  '[filters][slug][$eq]': 'author',
  'populate[authorLinks][populate]': '*',
  'populate[locales][populate]': '*',
  locale: useStore.common().locale,
})
if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Server Error' })
}
if (resourceRes.value && resourceRes.value.data) {
  const data = getStrapiData(resourceRes.value.data?.[0] || {})
  resourceCateList.value = data?.authorLinks || []
  localesMap.value = convertStrapiLocalesToObject(data?.locales || [])
  if (!authorId) {
    usePageSeo({ title: data?.title, ...(data?.seo || {}) })
  }
}
const changePage = (page: number) => {
  pageNum.value = page
}
</script>

<template>
  <div class="author-page">
    <div class="author-banner">
      <div class="container">
        <template v-if="!authorId">
          <h1 class="title" v-html="localesMap.author_title_editor_profile"></h1>
          <div class="photo-box author-index mt22">
            <template v-for="(item, index) in authorList">
              <div v-if="item.name" :key="index" class="authors-photo">
                <a :href="item.url">
                  <div class="img-box">
                    <i :style="'background-image: url(' + item.icon + ');'"></i>
                  </div>
                  <span class="author-name" v-html="item.name"></span>
                </a>
              </div>
            </template>
          </div>
        </template>
        <div v-else class="photo-box author-detail">
          <div class="authors-photo">
            <i :style="'background-image: url(' + authorInfo.icon + ');'"></i>
          </div>
          <div class="desc-box">
            <div class="desc" v-html="authorInfo.description"></div>
            <div v-if="authorInfo.mailbox" class="contact">
              <span>
                {{ localesMap.author_contact }}:
                <a class="email" :href="'mailto:' + authorInfo.mailbox" v-html="authorInfo.mailbox"></a>
              </span>
              <template v-for="(item, key) in authorInfo.addressList" :key="key">
                <a v-if="item.url" :href="item.url" target="_blank" rel="noopener" class="author-icon-con">
                  <i class="iconfont-sg" :class="item.icon"></i>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="author-content">
      <BaseContainer>
        <div v-if="resourceCateList.length" class="resource-cate-list">
          <template v-for="(item, index) in resourceCateList" :key="index">
            <div class="class-box">
              <a :href="item.link">
                <my-img
                  :width="getStrapiData(item.media)?.width"
                  :height="getStrapiData(item.media)?.height"
                  :src="getStrapiData(item.media)?.url"
                  :alt="item?.mediaAlt || ''"
                />
                <div class="text" v-html="item.title"></div>
              </a>
            </div>
          </template>
        </div>
        <h1 v-if="authorId" class="text-center mt80 mb40" v-html="localesMap.author_title_latest_posts"></h1>
        <h2 v-else class="text-center mt80 mb40" v-html="localesMap.author_title_latest_posts"></h2>
        <ul class="flex flex-wrap gap30 mb60">
          <template v-for="index in Math.ceil(articleList.length / pageLen)" :key="index">
            <ul v-show="index === pageNum" class="flex flex-wrap gap30 mb40 w100%">
              <template v-for="idx in pageLen" :key="(index - 1) * pageLen + idx - 1">
                <BlocksArticlesCard
                  v-if="articleList?.[(index - 1) * pageLen + idx - 1]?.title"
                  :has-author-link="true"
                  class="art-card"
                  :article="articleList[(index - 1) * pageLen + idx - 1]"
                />
              </template>
            </ul>
          </template>
        </ul>
        <BasePagination
          v-if="paginationData.total > paginationData.pageSize"
          v-bind="paginationData"
          @change-page="changePage"
        />
      </BaseContainer>
    </div>
  </div>
</template>

<style lang="less">
.author-page {
  .author-banner .container {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .author-banner {
    min-height: 326px;
    background-image: linear-gradient(#2460e9, #c55cfc);
    padding-bottom: 35px;
    .title {
      font-size: 42px;
      text-align: center;
      margin: auto;
      padding-top: 40px;
      color: #fff;
      line-height: 66px;
    }
  }
  .photo-box {
    &.author-index {
      overflow: hidden;
      display: grid;
      justify-content: space-between; /* 水平居中对齐 */
      align-content: center; /* 垂直居中对齐 */
      grid-template-columns: repeat(6, 110px); /* 自动适应列数，每列最小宽度为 110px */
      grid-auto-rows: auto; /* 自动调整行高 */
      gap: 15px;
      .authors-photo {
        width: 110px;
        // margin-bottom: 15px;
        // margin-right: 100px;
        i {
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .img-box {
          padding: 5px;
          background-color: rgba(0, 0, 0, 0.102);
          border-radius: 50%;
          line-height: 0;
        }
        &:hover .author-name {
          text-decoration: underline;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &.author-detail {
      display: flex;
      padding: 90px 0 20px;
      .authors-photo {
        margin-bottom: 20px;
        padding: 5px;
        height: fit-content;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        line-height: 0;
        i {
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      .contact {
        display: flex;
        gap: 10px;
        align-items: center;
        width: auto;
        height: fit-content;
        background: none;
        .author-icon-con i {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.5);
          &:hover {
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
  .author-name {
    display: block;
    text-align: center;
    color: #fff;
    margin-top: 10px;
  }
  .desc-box {
    overflow: hidden;
    color: #fff;
    padding-left: 30px;
    line-height: 1.5;
    .desc {
      margin-bottom: 20px;
    }
    .contact a.email {
      color: @text-white-color !important;
      text-decoration: underline;
      &:hover {
        .white-opacity(0.7) !important;
      }
    }
  }
  .resource-cate-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .class-box {
      &:hover .text {
        color: @link-text-color;
      }
      .text {
        width: 70%;
        text-align: center;
        margin: 10px auto 0;
        color: #3b5159;
      }
    }
  }
  .author-content {
    padding: 40px 0 80px;
    background: #f4f8f9;
  }
  .art-card {
    width: calc((100% - 30px * 2) / 3);
    flex-shrink: 0;
  }
}

@media (max-width: 1024px) {
  .author-page {
    .resource-cate-list {
      gap: 10px;
      justify-content: center;
    }
    .art-card {
      width: calc((100% - 30px) / 2);
    }
  }
}

@media (max-width: 800px) {
  .author-page .photo-box.author-index {
    grid-template-columns: repeat(4, 110px); /* 自动适应列数，每列最小宽度为 110px */
  }
}

@media (max-width: 768px) {
}
@media (max-width: 640px) {
  .author-page {
    .container {
      padding: 0 5%;
    }
    .author-banner {
      .title {
        font-size: 2rem;
        line-height: 3.125rem;
      }
      .photo-box {
        &.author-index {
          justify-content: space-around;
        }
        &.author-detail {
          flex-direction: column;
          align-items: center;
          padding: 2.625rem 0 2.25rem;
          .desc-box {
            padding-left: 0;
            .desc {
              text-align: center;
            }
            .contact {
              justify-content: center;
            }
          }
        }
      }
      .authors-photo {
        margin-right: 0;
      }
    }
  }
  .author-page {
    .art-card {
      width: 100%;
    }
  }
}
@media (max-width: 540px) {
  .author-page .photo-box {
    &.author-index {
      grid-template-columns: repeat(3, 110px); /* 自动适应列数，每列最小宽度为 110px */
      gap: 0;
    }
    &.author-detail .contact {
      flex-wrap: wrap;
      span {
        min-width: 100%;
        text-align: center;
      }
    }
  }
}
@media (max-width: 375px) {
  .author-page .photo-box.author-index {
    grid-template-columns: repeat(2, 110px); /* 自动适应列数，每列最小宽度为 110px */
  }
}
</style>
