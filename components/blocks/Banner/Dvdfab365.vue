<script setup lang="ts">
const props = defineProps({
  macLink: {
    type: String,
    default: '',
  },
  buyNowTip: { type: String, default: '' },
  // 产品信息
  product: {
    type: Object,
    default: () => {},
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // desc list
  descSub: {
    type: Array<any>,
    default: () => [],
  },
  // banner 按钮组信息
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  media: {
    type: Object,
    default: () => {},
  },
  // dvdfab365 用户
  nodeDesc: {
    type: String,
    default: '',
  },
  toMemberCenter: {
    type: String,
    default: '',
  },
  // 下载按钮文案
  downloadBtn: { type: String, default: '' },
})
const { getCurrentEmail, loadDiffPrice, getPriceByOpt, getElkParams, getBuyUrl, getUpgradePriceInfo } =
  useProductDiffPrice()

const isMobile = useStore.common().mobile
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commomJson = useI18n().value.common
const proInfo = useProInfo().value || {}
let diffPrices = reactive(useProDiffPrice().value)

const bannerInfo = reactive({
  btnList: [] as any,
  proInfo: {} as any,
  imgData: {} as any,
  desc: '',
  title: '',
  showNodeDesc: false,
  showPriceGiftInfo: true,
  priceGiftInfo: {},
})

const defaultBtnList = [
  {
    info: {
      href: '/',
      size: 'large',
      showIcon: false,
      label: commomJson.subscribe_now,
      theme: 'primary',
      slug: proInfo.slug,
      tag: 'a',
      couponText: props.buyNowTip,
    },
    component: 'MyButtonBuy',
    tipText: '',
    tipIconClass: '',
  },
]

const getPriceGiftInfo = (priceInfo: any, goMember: boolean) => {
  // 是否展示原价
  const isOriPrice = goMember || priceInfo.user_tag_type === 'new'
  return {
    standardLabel: isOriPrice ? '' : commomJson.standard_price + ': ',
    standardPrice: isOriPrice
      ? ''
      : translatePrice(priceInfo?.price?.origin_price, currency[1], locale) +
        ` (${commomJson.num_year.replace('{num}', '1')})`,
    finalLabel: isOriPrice ? commomJson.standard_price + ': ' : commomJson.final_price + ': ',
    finalPrice:
      translatePrice(
        goMember
          ? getPriceByOpt(proInfo, '1Y')
          : priceInfo?.price?.payment_price || getPriceByOpt(proInfo, '1Y'),
        `<span>${currency[1]}</span>`,
        locale,
      ) + `<span class="ml10 font-normal">(${commomJson.num_year.replace('{num}', '1')})</span>`,
  }
}
const getGoMemberUrl = (params: any) => {
  const _params: any = {
    a: 'dvdfab365',
  }
  for (const key in params) {
    if (key.startsWith('ext_params_')) {
      _params[key] = params[key]
    }
  }
  return '/member.htm?' + urlParamsToString(_params)
}
const renderInfoHandle = (os: string) => {
  // 获取价格信息
  const priceInfo = getUpgradePriceInfo(proInfo, diffPrices, 'new')
  const goMember = ['active', 'renew', 'rebuy'].includes(priceInfo.user_tag_type)

  bannerInfo.priceGiftInfo = getPriceGiftInfo(priceInfo, goMember)

  const elkParams = {
    event_category: goMember
      ? '365page_gotomember'
      : priceInfo?.price?.code
      ? priceInfo?.price?.code
      : 'dvdfab_365_non_discount',
    ext_params_str_param1: '365',
    ext_params_str_param2: 'upgrade_price',
    ext_params_str_param3: 'dvdfab_365',
    ext_params_str_param4: os,
    ext_params_str_param5: priceInfo.user_tag_type,
    ext_params_str_param6: proInfo.name,
    ext_params_num_param2: goMember ? priceInfo?.price?.origin_price : priceInfo?.price.payment_price,
  }
  bannerInfo.showPriceGiftInfo = priceInfo.user_tag_type !== 'active'
  bannerInfo.showNodeDesc = goMember
  // 按钮
  bannerInfo.btnList = defaultBtnList.flatMap((btn: any) => {
    btn.info.slug = proInfo.slug
    btn.info.href = goMember
      ? getGoMemberUrl({ ...elkParams, et_pa: 1 })
      : getBuyUrl(proInfo, props, priceInfo.price, { ...elkParams, et_pa: 1 }, '1Y')
    btn.info.label = goMember ? props.toMemberCenter : commomJson.subscribe_now
    btn.exposure = getElkParams('show', proInfo, elkParams)

    btn.click = getElkParams(goMember ? 'click' : 'buy_now', proInfo, elkParams)
    return btn
  })
  bannerInfo.imgData = getStrapiData(props.media) || {}
}

renderInfoHandle('win')

const loading = ref(true)
loading.value = true

onMounted(() => {
  const currentEmail = getCurrentEmail() as string
  setTimeout(() => {
    const pids = [proInfo.pid]
    loadDiffPrice('win', pids, currentEmail, 'streamfab').then((res) => {
      loading.value = false
      if (res.data.value?.cscode === 200 && res.data.value.data?.details) {
        useProDiffPrice().value = res.data.value.data?.details?.product
        diffPrices = useProDiffPrice().value
        renderInfoHandle('win')
      }
    })
  }, 200)
})
</script>

<template>
  <div class="pro-top-banner ptb-theme-fab365 ptb-text-dark" :class="[{ mobile: isMobile }]">
    <BaseContainer>
      <div class="ptb-top flex flex-items-center">
        <div class="ptb-left">
          <h1 class="ptb-title mb20" v-html="proInfo.name || title"></h1>
          <div class="ptb-desc font-s-20 mb40" v-html="desc"></div>
          <div v-if="bannerInfo.showPriceGiftInfo" class="flex mb40">
            <el-skeleton :loading="loading" animated class="dark">
              <template #template>
                <el-skeleton-item variant="h3" class="w320! max-w-503 h128!" />
              </template>
              <template #default>
                <PagesProductGiftBox v-bind="bannerInfo.priceGiftInfo" />
              </template>
            </el-skeleton>
          </div>
          <div class="btn-group flex">
            <div v-for="(btn, idx) in bannerInfo.btnList" :key="'btn-item' + idx" class="btn-item">
              <template v-if="btn.component === 'MyButtonBuy'">
                <el-skeleton :loading="loading" animated class="btn-buy">
                  <template #template>
                    <el-skeleton-item variant="button" class="btn-buy-ske w278! h66! border-rd-66!" />
                  </template>
                  <template #default>
                    <component
                      :is="btn.component"
                      v-track:exposure="btn.exposure"
                      v-track:click="btn.click"
                      v-bind="btn.info"
                    />
                  </template>
                </el-skeleton>
              </template>
            </div>
          </div>
          <div v-if="bannerInfo.showNodeDesc" class="mt16 font-s-14 tip-text" v-html="props.nodeDesc"></div>
        </div>
        <div v-if="bannerInfo.imgData && Object.keys(bannerInfo.imgData).length" class="ptb-right">
          <MyImg
            class="my-img"
            :loading="''"
            :src="bannerInfo.imgData.url"
            :width="bannerInfo.imgData.width"
            :height="bannerInfo.imgData.height"
            :style="{ width: '446px', height: '409px' }"
            preload
            :alt="bannerInfo.imgData.alternativeText || bannerInfo.title"
          />
        </div>
      </div>
      <!-- 底部的 slot -->
      <slot name="bottom" :data="$attrs"></slot>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.pro-top-banner {
  padding: @gap-lg 0 0;
  background-size: cover;
  background-position: center;
  background: linear-gradient(180deg, #c2edff 0%, #ffffff 100%);

  .ptb-top {
    gap: 30px;
    justify-content: space-between;
  }
  .btn-group {
    gap: 20px;
  }
  .ptb-right {
    position: relative;
    transition: 0.2s;
  }
  .tip-text {
    color: @text-gray-color;
  }
}

:deep(.product-info) {
  span {
    flex: none;
  }
  del {
    text-align: left;
    width: 100%;
    color: @text-gray-color;
  }
  .product-info-price {
    span {
      font-size: 20px;
    }
  }
}

@media (max-width: 1200px) {
  .ptb-right {
    img {
      width: 360px;
      height: auto;
    }
  }
}
@media (max-width: 1024px) {
  .pro-top-banner {
    min-height: unset;
  }
  .ptb-right {
    display: none;
  }
}
@media (max-width: 640px) {
  .pro-top-banner {
    padding: @gap-md 0;
    .tip-text {
      text-align: center;
    }
  }
  .btn-group {
    flex-direction: column;
    align-items: flex-start;
  }
  .ptb-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    .ptb-desc,
    .ptb-title {
      text-align: center;
    }
  }
  .btn-buy-ske {
    width: 210px !important;
    height: 49px !important;
  }
}
</style>
<style lang="less">
.ptb-theme-fab365 {
  & + .block-box.no-bg {
    padding-top: 0;
  }
}
</style>
