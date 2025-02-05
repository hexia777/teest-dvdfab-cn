<script setup lang="ts">
// const commonJson = useI18n().value.common
const tipsHeaderOs = ref(useOs().value)
const tipsBannerOs = ref(useOs().value)

const apiCommon = useApi().apiCommon
const { data: tipsRes, error } = await apiCommon.getCommonPageData({
  'populate[seo][populate]': '*',
  '[filters][slug][$eq]': 'tips',
  'populate[locales]': '*',
  // 'populate[blocks][populate]': `items,media,blockClass,items.media,bottomLink,
  // items.banner,items.descSub,lineList,items.home_product_card,items.home_product_card.items,
  // items.home_product_card.items.media,more,items.home_product_card.items.items,
  // items.home_product_card.items.iconLink`,
  locale: useStore.common().locale,
})
if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Server Error' })
}
let pageTitle = ''
let strapiLocales: any = {}
// console.log('===============tipsRes', tipsRes)
if (tipsRes.value && tipsRes.value.data) {
  const data = getStrapiData(tipsRes.value.data?.[0] || {})
  usePageSeo({ title: data?.title, ...(data?.seo || {}) })
  strapiLocales = convertStrapiLocalesToObject(data?.locales || [])
  pageTitle = data?.title || ''
}

const tipsFor = strapiLocales.tips_for || ''
const tips_search_null = strapiLocales.tips_search_null || ''
const tips_title = strapiLocales.tips_title || ''

const freeTrial = useI18n().value.article.free_trial

const { apiArticle } = useApi()
const lang = useStore.common().locale

const route = useRoute()
const keyword = route.query.keyword as string
const tipsParams: any = {
  lang,
  start: 0,
  len: 99999,
}
if (keyword) {
  tipsParams.keyword = encodeURIComponent(keyword)
}
const [{ data: productsRes }, { data: tips }] = await Promise.all([
  apiArticle.getTipsProducts({ lang }),
  apiArticle.searchTipsArticle(tipsParams),
])

const addTipsToProducts = (products: any, allTips: any) => {
  if (!products) {
    return {}
  }
  if (!allTips || !allTips.length) {
    return products
  }
  products.win = products.win
    .map((item: any) => {
      item.tips = allTips.filter(
        (tip: any) => Number(tip.product) === item.pid || Number(tip.product_upgrade) === item.pid,
      )
      return item
    })
    .filter((item: any) => item.tips && item.tips.length)
  products.mac = products.mac
    .map((item: any) => {
      item.tips = allTips.filter(
        (tip: any) => Number(tip.product) === item.pid || Number(tip.product_upgrade) === item.pid,
      )
      return item
    })
    .filter((item: any) => item.tips && item.tips.length)
  return products
}
const products = addTipsToProducts(unref(productsRes.value?.data), unref(tips.value?.data))

const searchValue = ref(keyword || '')
const showSearchResult = ref(!!keyword)
const activePid = ref(products?.[tipsHeaderOs.value]?.[0]?.pid || '')
const activeProduct = ref<any>(products?.[tipsBannerOs.value]?.[0] || {})
const activeBannerProduct = ref<any>(products?.[tipsBannerOs.value]?.[0] || {})

const activeProductTips = computed(() => {
  if (showSearchResult.value) {
    return tips.value?.data || []
  }
  return activeProduct.value.tips || []
})
const clientProducts = computed(() => {
  return products?.[tipsHeaderOs.value] || []
})
// console.log('==============products', products)
// console.log('==============tips', tips.value)

onMounted(() => {})

const bannerData = computed(() => {
  const boxImg = `https://assets.dvdfab.cn/dvdfab/box/${activeBannerProduct.value.product_box}`
  const showSwitchOs = !!activeBannerProduct.value.relation_pid
  return {
    // bgImg:
    //   activeBannerProduct.value.product_line === 'streamfab'
    //     ? 'https://c2.dvdfab.cn/images/article/1x_m/streamfab_banner.jpg'
    //     : 'https://c2.dvdfab.cn/images/article/1x_m/banner.jpg',
    bgImg: 'https://c1.dvdfab.cn/images/article/1x_m/banner_new.jpg',
    title: activeBannerProduct.value.top_title,
    desc: activeBannerProduct.value.top_content,
    showSwitchOs,
    // 产品信息
    proInfo: {
      name: activeBannerProduct.value.product_name,
      url: activeBannerProduct.value.route_new,
    },
    imgInfo: {
      url: boxImg,
      width: '255',
      height: '255',
      alt: activeBannerProduct.value.product_name || '',
    },
    titleLink: activeBannerProduct.value.route_new,
    boxImgElkParams: {
      event_label: 'banner',
      event_value: 'tips',
      event_category: 'productbox',
    },
    titleElkParams: {
      event_label: 'banner',
      event_value: 'tips',
      event_category: 'productname',
    },
    btnList: [
      {
        info: {
          href: activeBannerProduct.value.down_url_new,
          showIcon: true,
          label: useI18n().value.common.free_download,
          theme: 'primary',
          icon: `icon-${tipsBannerOs.value} font-size-20 font-normal`,
          size: 'medium',
          slug: '',
          // osVersion: commonJson[`${tipsBannerOs.value}_version`],
          'data-warden-ck-parm': base64Encode({
            event_value: 'topic',
            event_label: 'banner',
            pids: [activeBannerProduct.value.pid],
          }),
        },
        component: 'MyButtonDownload',
        tipText: '',
        tipIconClass: '',
      },
    ],
  }
})

const toggleBannerOs = (os: 'win' | 'mac') => {
  tipsBannerOs.value = os
  const relationPid = activeBannerProduct.value.relation_pid
  const targetProduct = products?.[os]?.find((item: any) => item.pid === relationPid)
  activeBannerProduct.value = targetProduct || activeBannerProduct.value
}

const toggleHeaderOs = (os: 'win' | 'mac') => {
  tipsHeaderOs.value = os

  activePid.value = products?.[os]?.[0]?.pid || ''
  const product = products?.[os]?.[0] || {}
  activePid.value = product.pid
  activeProduct.value = product
  if (!product.pid) {
    return
  }

  if (os === tipsBannerOs.value) {
    activeBannerProduct.value = product
  } else {
    const relationPid = product.relation_pid
    if (relationPid) {
      const targetProduct = products?.[tipsBannerOs.value]?.find((item: any) => item.pid === relationPid)
      activeBannerProduct.value = targetProduct || product
    } else {
      activeBannerProduct.value = product
    }
  }
}
const changeProduct = (product: any) => {
  activePid.value = product.pid
  activeProduct.value = product
  if (tipsHeaderOs.value === tipsBannerOs.value) {
    activeBannerProduct.value = product
  } else {
    const relationPid = product.relation_pid
    if (relationPid) {
      const targetProduct = products?.[tipsBannerOs.value]?.find((item: any) => item.pid === relationPid)
      activeBannerProduct.value = targetProduct || product
    } else {
      activeBannerProduct.value = product
    }
  }
}

const matchSearchValueAtTitle = (title: string) => {
  if (searchValue.value && showSearchResult.value) {
    const reg = new RegExp(searchValue.value, 'ig')
    title = title.replace(reg, '<font color="#dd4b39"><b>$&</b></font>')
    return title
  }
  return title
}

const searchTips = () => {
  // navigateTo(`/tips.htm?keyword=${searchValue.value}`)
  if (searchValue.value) {
    window.location.href = `/tips.htm?keyword=${searchValue.value || ''}`
  } else {
    window.location.href = '/tips.htm'
  }
}
</script>

<template>
  <div class="tips-box">
    <PagesArticleBanner v-bind="bannerData" @tab-click="toggleBannerOs">
      <template #middle>
        <div class="free-trial">
          {{ freeTrial }}
        </div>
      </template>
    </PagesArticleBanner>
    <div class="pt40 pb20">
      <BaseContainer>
        <div class="tips-content">
          <div v-show="!showSearchResult" class="tips-left">
            <div class="header flex-between">
              <h1 class="font-size-20">{{ tips_title }}</h1>
              <div class="os-tabs">
                <div :class="{ active: tipsHeaderOs === 'win' }" @click="toggleHeaderOs('win')">
                  <i class="iconfont-sg icon-win"></i>
                </div>
                <div :class="{ active: tipsHeaderOs === 'mac' }" @click="toggleHeaderOs('mac')">
                  <i class="iconfont-sg icon-mac"></i>
                </div>
              </div>
            </div>
            <ul class="p16">
              <li
                v-for="product in clientProducts"
                :key="product.pid"
                :class="{ active: activePid === product.pid }"
                @click="changeProduct(product)"
              >
                {{ product.product_name_new }}
              </li>
            </ul>
          </div>
          <div class="tips-right">
            <div class="header">
              <input v-model="searchValue" class="search" type="search" @keyup.enter="searchTips" />
              <div class="search-box" @click="searchTips">
                <i class="iconfont-sg icon-search"></i>
              </div>
            </div>
            <div v-show="!showSearchResult" class="pt16 mb16">
              <h2 class="font-size-24">
                {{ tipsFor }}
                <span>{{ activeProduct.product_name }}</span>
              </h2>
            </div>
            <ul v-if="activeProductTips && activeProductTips.length">
              <li v-for="tip in activeProductTips" :key="tip.id">
                <a :href="'/tips/' + tip.url + '.htm'" v-html="tip.title"></a>
              </li>
            </ul>
            <ul v-else>
              <li v-html="tips_search_null"></li>
            </ul>
          </div>
        </div>
      </BaseContainer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tips-box {
  position: relative;
  background: #f4f8f9;
  .free-trial {
    color: #fde800;
    line-height: 24px;
    font-weight: 700;
  }
}
.tips-content {
  display: flex;
  min-height: 620px;
  .tips-left {
    width: 27%;
    background: #fff;
    margin-right: 20px;
    flex-shrink: 0;
    .header {
      height: 58px;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid #e4eaeb;
    }
    .os-tabs {
      display: flex;
      div {
        width: 40px;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 2px solid transparent;
        cursor: pointer;
      }
      .active {
        border-bottom: 2px solid @primary-color;
        .iconfont-sg {
          font-size: 20px;
          color: @primary-color;
        }
      }
      .iconfont-sg {
        font-size: 20px;
        color: #3b5159;
      }
    }
    ul {
      li {
        font-weight: bold;
        margin-bottom: 16px;
        cursor: pointer;
      }
      li.active {
        color: @primary-color;
      }
    }
  }
  .tips-right {
    flex: 1;
    background: #fff;
    padding: 0 16px;
    .header {
      display: flex;
      justify-content: flex-end;
      height: 58px;
      align-items: center;
      border-bottom: 1px solid #e4eaeb;
      position: relative;
      .search {
        box-sizing: border-box;
        height: 38px;
        padding: 0 32px 0 16px;
        line-height: 38px;
        color: #00a9f0;
        border: 1px solid #c4e1eb;
        display: inline-block;
        border-radius: 38px;
        width: 40%;
      }
      .search-box {
        position: absolute;
        top: 0;
        right: 0;
        height: 58px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        .icon-search {
          color: @text-gray-color;
          font-size: 24px;
        }
      }
    }
    ul {
      li {
        cursor: pointer;
        padding: 10px 0;
        &::before {
          display: inline-block;
          content: '●';
          padding-right: 10px;
          color: #666;
          font-size: 6px;
        }
        a {
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .tips-content {
    min-height: 0;
    flex-direction: column;
    .tips-left {
      width: 100%;
      margin-right: 0;
      margin-bottom: 20px;
    }
    .tips-right {
      width: 100%;
      margin-right: 0;
      .header {
        display: none;
      }
    }
  }
}
</style>
