<script setup lang="ts">
enum RecommandDiffCardType {
  new = 'new', // 新用户
  upgrade = 'upgrade', // 升级
  complement = 'complement', // 补全
}

const props: any = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'no-bg',
      }
    },
  },
  new: {
    type: Object,
    default: () => {},
  },
  upgrade: {
    type: Object,
    default: () => {},
  },
  complement: {
    type: Object,
    default: () => {},
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})

const {
  getDefaultPriceInfo,
  getPriceByOpt,
  getChildProName,
  getBuyUrl,
  getUpgradeExtParams,
  getElkParams,
  getUpgradePriceInfo,
} = useProductDiffPrice()
const commomJson = useI18n().value.common
const proInfo = useProInfo().value || {}
const macProInfo = useMacProInfo().value || {}
const osText = useOs().value
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]

const proPriceInfo = proInfo?.price || []

const showDesc = ref(0)
const checkDetail = (index: number) => {
  if (index === showDesc.value) {
    showDesc.value = 0
    return
  }
  showDesc.value = index
}

const defaultBtnList = [
  {
    info: {
      href: '/',
      size: 'large',
      showIcon: true,
      label: commomJson.free_download,
      theme: 'primary',
      transition: false,
      os: 'win',
      slug: proInfo.slug,
    },
    component: 'MyButtonDownload',
  },
  {
    info: {
      href: '/',
      showIcon: true,
      label: commomJson.free_download,
      theme: 'border',
      transition: false,
      os: 'mac',
      slug: proInfo.slug,
    },
    component: 'MyButtonDownload',
  },
]
const typeMapKey: any = {
  new: 'new',
  aio_all: 'new',
  sub: 'new',
  single_upgrade: 'upgrade',
  mycombo_upgrade: 'upgrade',
  aio_upgrade: 'complement',
}

const blockInfo = reactive({
  type: '',
  title: '',
  newDescList: [] as any,
  productList: [] as any,
  priceGiftInfo: {} as any,
  btnList: [] as any,
  proInfo: {} as any,
})

const reloadBtnData = computed(() => {
  return useReloadBtnData().value
})

const getAmazonCouponValue = (_proInfo: any) => {
  let amazonCp = _proInfo.amazon.find((item: any) => item.key === currency[0])
  amazonCp = amazonCp || _proInfo.amazon.find((item: any) => item.key === 'USD')
  if (amazonCp) {
    const text = translatePrice(amazonCp?.value, currency[1], locale) as string
    return text.replace(/(\.00)|(,00)/g, '')
  }
  return ''
}
const renderData = (os: string) => {
  let _curProInfo = os === proInfo.system ? proInfo : macProInfo
  if (!Object.keys(_curProInfo).length) {
    _curProInfo = proInfo
  }
  blockInfo.proInfo = _curProInfo

  // 获取价格信息
  const priceInfo = getUpgradePriceInfo(_curProInfo, useProDiffPrice().value) || {
    options: {
      has_lft_options_num: 0,
      has_nlt_options_num: 0,
      has_online_lft_options_num: 0,
      has_online_nlt_options_num: 0,
      has_online_options_num: 0,
      has_options_num: 0,
      total_options_num: _curProInfo.products.data.length,
      lft_not_owned: {},
      lft_owned: {},
      not_owned: [],
      owned: [],
    },
    user_tag_type: 'new',
    price: getDefaultPriceInfo(proInfo),
  }

  const type = typeMapKey[priceInfo.user_tag_type]
  blockInfo.type = type || 'new'
  // 总数
  const totalProNum = priceInfo.options?.total_options_num
  // 拥有在线 LFT
  const hasLftOnline = priceInfo.options?.has_online_lft_options_num
  const noLftOnline = totalProNum - hasLftOnline
  const textInfo = props[blockInfo.type]
  blockInfo.title = textInfo?.title
  blockInfo.newDescList = [
    {
      title: textInfo.firstTag,
      desc: textInfo.firstDesc,
    },
    {
      title: textInfo.secondTag,
      desc: textInfo.secondDesc,
    },
  ]
  blockInfo.productList = [
    {
      title: textInfo.firstDesc.replace('{num}', hasLftOnline),
      btnText: commomJson.detail,
      proList: priceInfo.options?.lft_owned || [],
    },
    {
      title: textInfo.secondDesc.replace('{num}', noLftOnline),
      btnText: commomJson.detail,
      proList: priceInfo.options?.lft_not_owned || [],
    },
  ]
  // 礼物部分
  let giftText = []
  const productAttrs = proInfo.product_attrs?.data || []
  if (productAttrs && productAttrs.length) {
    const amazonPriceText = getAmazonCouponValue(proInfo)

    const giftMediaTags = productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
    if (giftMediaTags) {
      giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
        if (blockInfo.type === 'complement') {
          return []
        }
        return {
          value: gText.value.replace('{num}', amazonPriceText),
        }
      })
    }
  }
  const avgPrice = priceInfo?.price?.payment_price / noLftOnline
  const standardLabel =
    blockInfo.type === 'new'
      ? commomJson.standard_price
      : commomJson?.per_pro.replace('{num}', translatePrice(avgPrice, currency[1], locale) as string) +
        ' X ' +
        noLftOnline
  const finalLabel = blockInfo.type === 'new' ? commomJson.final_price : commomJson.upgrade_price
  blockInfo.priceGiftInfo = {
    standardLabel,
    standardPrice: translatePrice(
      priceInfo?.price?.origin_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    finalLabel,
    finalPrice: translatePrice(
      priceInfo?.price?.payment_price || getPriceByOpt(proInfo),
      currency[1],
      locale,
    ),
    giftList: giftText,
  }
  // 按钮
  if (blockInfo.type === 'new') {
    blockInfo.btnList = defaultBtnList.map((btn: any) => {
      btn.info.slug = proInfo.slug
      if (btn.component === 'MyButtonDownload') {
        const _curProInfoBtn =
          btn.info.os === proInfo.system ? proInfo : getStrapiData(proInfo.related_products?.data[0])
        btn.info.href = _curProInfoBtn.downloadUrl?.[0].url
      }
      return btn
    })
  } else {
    const extParams = getUpgradeExtParams(priceInfo, _curProInfo, 'streamfab', 'upgrade_license')

    blockInfo.btnList = [
      {
        info: {
          label: commomJson.upgrade_now,
          showIcon: true,
          href: getBuyUrl(_curProInfo, props, priceInfo.price, extParams, 'LFT', blockInfo.type),
          size: 'large',
          theme: 'primary',
          slug: proInfo.slug,
        },
        exposure: getElkParams('show', _curProInfo, extParams),
        click: getElkParams('buy_now', _curProInfo, extParams),
        component: 'MyButtonBuy',
      },
    ]
  }
}
renderData(osText)
watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal)
  },
)

watch(
  () => useProDiffPrice().value,
  () => {
    renderData(useOs().value)
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <div
        class="recommand-diff-card flex-center flex-col"
        :class="blockInfo.type !== RecommandDiffCardType.new ? 'old' : ''"
      >
        <div class="title2 text-center mb32" v-html="blockInfo?.title"></div>
        <div v-if="blockInfo.type == RecommandDiffCardType.new" class="rdc-content text-center max-w-800">
          <div
            v-for="(item, idx) in blockInfo.newDescList"
            :key="'new-c-list' + idx"
            class="new-c-list flex-col flex-center mb40"
          >
            <div class="title b-radius-md mb12" v-html="item?.title"></div>
            <div class="desc" v-html="item.desc"></div>
          </div>
        </div>
        <div v-else class="rdc-content text-center flex-center flex-col max-w-800 mb24">
          <div class="mb40 old-c-list-wrap">
            <div
              v-for="(item, idx) in blockInfo.productList"
              :key="'old-c-list' + idx"
              class="old-c-list flex pos-relative"
            >
              <span class="mr15" v-html="item?.title"></span>
              <div
                v-if="item.proList"
                class="detail"
                @mouseenter="checkDetail(idx + 1)"
                @mouseleave="showDesc = 0"
              >
                {{ item.btnText }}
                <ul v-if="showDesc === idx + 1">
                  <li
                    v-for="pid in item.proList"
                    :key="'pro' + pid"
                    v-html="getChildProName(blockInfo.proInfo, pid, true)"
                  ></li>
                </ul>
              </div>
            </div>
          </div>
          <PagesProductGiftBox
            v-bind="{
              ...blockInfo.priceGiftInfo,
              splitLine: { show: true, color: 'rgba(255, 144, 0, 0.2)' },
            }"
          />
        </div>

        <div class="btn-group flex flex-justify-center gap40">
          <div v-for="(btn, idx) in blockInfo.btnList" :key="'btn-item' + idx" class="btn-item">
            <template v-if="btn.component === 'MyButtonBuy'">
              <component
                :is="btn.component"
                v-if="reloadBtnData.value && reloadBtnData.reloadOs[osText]"
                v-track:click="btn.click"
                v-track:exposure="btn.exposure"
                v-bind="{ ...btn.info }"
              />
            </template>
            <component :is="btn.component" v-else v-bind="{ ...btn.info }" />
            <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
              <i :class="btn.tipIconClass"></i>
              <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.recommand-diff-card {
  background-color: #eefaff;
  padding: @gap-md;
  border-radius: 40px;
  &.old {
    background-color: #fff9f2;
    .product-info {
      background-color: rgba(255, 144, 0, 0.05);
    }
  }
}
.new-c-list {
  .title {
    color: @primary-color;
    background-color: rgba(0, 169, 240, 0.1);
    padding: 2px 16px;
  }
}
.old-c-list {
  & + .old-c-list {
    margin-top: 12px;
  }
}

.detail {
  width: 60px;
  color: @secondary-color;
  text-decoration-line: underline;
  cursor: pointer;
  ul {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    z-index: 4;
    left: 0;
    transform: translateX(50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    cursor: default;
    text-align: left;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #a2aeb2;
    }
    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: transparent;
    }
  }
}

@media (max-width: 1024px) {
  .detail ul {
    right: unset;
    transform: translateX(0);
    text-align: center;
  }
}

@media (max-width: 640px) {
  .recommand-diff-card {
    padding: 30px 20px;
  }
  .btn-group {
    gap: 10px;
    :deep(.btn) {
      &.large {
        min-width: 100%;
      }
    }
  }
  .old-c-list-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .old-c-list {
      margin: 0;
    }
  }
  .detail ul {
    transform: initial;
    width: 100%;
  }
}
@media (max-width: 414px) {
  .recommand-diff-card {
    padding: 30px 20px;
  }
  .btn-group {
    width: 100%;
    gap: 20px;
    flex-direction: column;
  }
}
</style>
