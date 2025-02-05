<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
      }
    },
  },
  textTheme: {
    type: String,
    default: 'dark',
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // 差异化标题
  titles: {
    type: Array<any>,
    default: () => [],
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // banner 按钮组信息
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
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
})

const aioPageMap: any = { 'all-in-one': 'dvdfab', downloader: 'streamfab' }
const reloadBtnData = reactive({
  reloadOs: {
    win: false,
    mac: false,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
})
const {
  getDefaultPriceInfo,
  getPriceByOpt,
  getUpgradeExtParams,
  getElkParams,
  getBuyUrl,
  getLowestPrice,
  getUpgradePriceInfo,
  getAmazonCouponValue,
} = useProductDiffPrice()

const commomJson = useI18n().value.common
const proInfo = useProInfo().value || {}
const macProInfo = useMacProInfo().value || {}
const osText = useOs().value
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]

const defaultBtnList = [
  {
    info: {
      href: '/',
      showIcon: true,
      label: commomJson.try_for_free,
      theme: 'primary',
      os: 'win',
      size: 'large',
      slug: '',
    },
    component: 'MyButtonDownload',
    tipText: commomJson.download_info,
    tipIconClass: 'iconfont-sg icon-safe font-size-24 pr8 success-color',
  },
  {
    info: {
      href: '/',
      size: 'large',
      showIcon: true,
      label: commomJson.buy_now,
      theme: 'primary',
      slug: '',
    },
    component: 'MyButtonBuy',
  },
]

const userTypeMapKey: any = {
  all_in_one: {
    upgrade_user: 'upgrade',
    complete_user: 'complement',
    is_new_user: 'new',
    is_newest_aio_user: 'new',
  },
  downloader: {
    new: 'new',
    aio_all: 'new',
    sub: 'new',
    single_upgrade: 'upgrade',
    mycombo_upgrade: 'upgrade',
    aio_upgrade: 'complement',
  },
}
const defaultUserTypeMap: any = {
  all_in_one: 'is_new_user',
  downloader: 'new',
}

const routeName = useRoute().name as string
const typeMapKey = userTypeMapKey[routeName] || {}
const defaultUserType = defaultUserTypeMap[routeName] || 'new'

const bannerInfo = reactive({
  btnList: [] as any,
  title: '',
  desc: '',
  proInfo: {} as any,
  showPriceBox: false,
  priceGiftInfo: {} as any,
})

// fab365 页面相关处理
const dvdfab365 = {
  isFab365: routeName === 'dvdfab365',
  getPriceGiftInfo: (priceInfo: any, goMember: boolean) => {
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
  },
  getGoMemberUrl: (params: any) => {
    const _params: any = {
      a: 'dvdfab365',
    }
    for (const key in params) {
      if (key.startsWith('ext_params_')) {
        _params[key] = params[key]
      }
    }
    return '/member.htm?' + urlParamsToString(_params)
  },
  getElkParams: (priceInfo: any, os: string, goMember: boolean) => {
    return {
      event_category: goMember
        ? '365page_gotomember'
        : priceInfo?.price?.code
        ? priceInfo?.price?.code
        : 'dvdfab_365_non_discount',
      ext_params_str_param1: '365',
      ext_params_str_param2: 'upgrade_price',
      ext_params_str_param3: 'dvdfab_365_bottom',
      ext_params_str_param4: os,
      ext_params_str_param5: priceInfo.user_tag_type,
      ext_params_str_param6: proInfo.name,
      ext_params_num_param2: goMember ? priceInfo?.price?.origin_price : priceInfo?.price.payment_price,
    }
  },
}

const renderData = (os: string, proDiffPrice: any, isClient = true) => {
  let _curProInfo =
    os === 'win'
      ? Object.values(proInfo).length // 兼容media系统只有mac 没有 win
        ? proInfo
        : macProInfo
      : macProInfo && Object.values(macProInfo).length // 兼容media系统只有win 没有 mac
      ? macProInfo
      : proInfo
  if (!_curProInfo) {
    _curProInfo = proInfo
  }
  if (!_curProInfo.price?.length && proInfo.redirect_products?.data) {
    const _redireactProInfo = getStrapiData(proInfo.redirect_products?.data[0])
    if (_redireactProInfo) {
      _curProInfo =
        os === _redireactProInfo.system
          ? _redireactProInfo
          : getStrapiData(_redireactProInfo.related_products?.data[0]) || _redireactProInfo
    }
  }
  // 获取价格信息
  let priceInfo = getUpgradePriceInfo(_curProInfo, proDiffPrice, defaultUserType)
  // passkey playerfab暂时未对接升级,需s升级的时候 把数组中的routeName删除即可
  if (['passkey', 'playerfab'].includes(routeName)) {
    priceInfo = {
      options: {
        has_lft_options_num: 0,
        has_nlt_options_num: 0,
        has_online_lft_options_num: 0,
        has_online_nlt_options_num: 0,
        has_online_options_num: 0,
        has_options_num: 0,
        total_options_num: _curProInfo.products.data.length,
      },
      user_tag_type: defaultUserType,
      price: getDefaultPriceInfo(proInfo),
    }
  }
  const type = typeMapKey[priceInfo.user_tag_type]
  const goMember = dvdfab365.isFab365 ? ['active', 'renew', 'rebuy'].includes(priceInfo.user_tag_type) : false
  bannerInfo.showPriceBox =
    (dvdfab365.isFab365 && priceInfo.user_tag_type !== 'active') ||
    Object.keys(defaultUserTypeMap).includes(routeName)
  if (_curProInfo.system === 'android') {
    const _price = getPriceByOpt(proInfo)
    bannerInfo.showPriceBox = +priceInfo.price.payment_price !== +_price
  }
  // 礼物部分
  let giftText = []
  const productAttrs = proInfo.product_attrs?.data || []
  if (productAttrs && productAttrs.length) {
    const amazonPriceText = getAmazonCouponValue(proInfo)
    const giftNameType = ['upgrade_user', 'complete_user'].includes(priceInfo.user_tag_type)
      ? priceInfo.user_tag_type
      : 'is_new_user'
    const giftMediaSlug = os === 'win' ? 'all-in-one-gift-common' : 'all-in-one-mac-gift-common'
    const giftMediaTags =
      routeName === 'all_in_one'
        ? productAttrs.find(
            (giftItem: any) =>
              giftItem.attributes.slug === giftMediaSlug && giftItem.attributes.name === giftNameType,
          )
        : productAttrs.find((giftItem: any) => giftItem.attributes.type === 'gift-common')
    if (giftMediaTags) {
      giftText = giftMediaTags.attributes.tags?.flatMap((gText: any) => {
        // all-in-one
        if (routeName === 'all_in_one') {
          if (type === 'complement') {
            return []
          }
        }
        // downloader
        if (routeName === 'downloader' && type === 'complement') {
          return []
        }
        return {
          value: gText.value.replace('{num}', amazonPriceText),
        }
      })
    }
  }
  // 总数
  const totalProNum = priceInfo.options?.total_options_num
  // 拥有在线 LFT
  const hasLftOnline = priceInfo.options?.has_online_lft_options_num
  const noLftOnline = totalProNum - hasLftOnline

  const avgPrice = priceInfo?.price?.payment_price / noLftOnline
  const standardLabel =
    type === 'new'
      ? commomJson.standard_price
      : routeName === 'downloader'
      ? commomJson?.per_pro.replace('{num}', translatePrice(avgPrice, currency[1], locale) as string) +
        ' X ' +
        noLftOnline
      : commomJson.standard_price
  const finalLabel = type === 'new' ? commomJson.final_price : commomJson.upgrade_price

  bannerInfo.priceGiftInfo = dvdfab365.isFab365
    ? dvdfab365.getPriceGiftInfo(priceInfo, goMember)
    : {
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
  if (_curProInfo.system === 'android') {
    bannerInfo.priceGiftInfo.standardLabel = commomJson.standard_price
    bannerInfo.priceGiftInfo.finalLabel = commomJson.final_price
    bannerInfo.priceGiftInfo.giftList = []
  }

  let titleObj = props.titles && props.titles.find((tit) => tit.key === type)
  titleObj = titleObj || props.titles.find((tit) => tit.key === 'new')
  bannerInfo.title = titleObj?.value || props.title
  // 按钮
  bannerInfo.btnList = defaultBtnList.flatMap((btn: any) => {
    btn.info.slug = proInfo.slug
    if (btn.component === 'MyButtonDownload') {
      if (!_curProInfo.downloadUrl || (_curProInfo.downloadUrl && !_curProInfo.downloadUrl.length)) {
        return []
      }
      btn.info.os = _curProInfo.system
      btn.info.href = _curProInfo.downloadUrl?.[0].url
      btn.exposure = {}
      btn.info['data-warden-ck-parm'] = base64Encode({
        event_label: 'productpage_bottom',
        pids: [_curProInfo.pid],
      })
    } else if (btn.component === 'MyButtonBuy') {
      // aio 页面
      if (Object.keys(aioPageMap).includes(proInfo.slug)) {
        const proLine = aioPageMap[proInfo.slug]
        const paramStr3 = proLine === 'streamfab' ? 'upgrade_license' : 'aio_bottom'
        const extParams = getUpgradeExtParams(priceInfo, _curProInfo, proLine, paramStr3)
        btn.info.href = getBuyUrl(_curProInfo, props, priceInfo.price, extParams, 'LFT', type)
        btn.exposure = getElkParams('show', _curProInfo, extParams)
        btn.click = getElkParams('buy_now', _curProInfo, extParams)
        if (type === 'new') {
          // btn.info.price = priceInfo?.price?.payment_price || getPriceByOpt(proInfo)
          btn.info.price = ''
          btn.info.label = commomJson.buy_now
        } else {
          btn.info.label = commomJson.upgrade_now
          btn.info.price = ''
          btn.info.showIcon = true
        }
      } else if (dvdfab365.isFab365) {
        const fab365ElkParams = dvdfab365.getElkParams(priceInfo, 'win', goMember)
        btn.info.slug = _curProInfo.slug
        btn.info.showIcon = false
        btn.info.label = goMember ? props.toMemberCenter : commomJson.subscribe_now
        btn.info.href = goMember
          ? dvdfab365.getGoMemberUrl({ ...fab365ElkParams, et_pa: 1 })
          : getBuyUrl(proInfo, props, priceInfo.price, { ...fab365ElkParams, et_pa: 1 }, '1Y')
        btn.tipText = goMember ? props.nodeDesc : ''
        btn.exposure = getElkParams('show', proInfo, fab365ElkParams)
        btn.click = getElkParams(goMember ? 'click' : 'buy_now', proInfo, fab365ElkParams)
      } else {
        if (!_curProInfo.price?.length) {
          return []
        }
        // 获取当前产品最低的价格方案
        const lowestPrice = getLowestPrice(_curProInfo, { getOpt: true, unit: 'hidden' })
        btn.info.href =
          _curProInfo.type === 'single' && _curProInfo.system !== 'android'
            ? 'javascript:;'
            : getBuyUrl(_curProInfo, props, priceInfo.price, {}, lowestPrice.key)
        btn.info.price =
          _curProInfo.type === 'aio' ? priceInfo?.price?.payment_price : lowestPrice.value || ''
        if (bannerInfo.showPriceBox && _curProInfo.system === 'android') {
          btn.info.price = ''
        }
        btn.info.label = commomJson.buy_now
        btn.click =
          _curProInfo.type === 'single' && _curProInfo.system !== 'android'
            ? {
                event: 'click',
                event_category: 'show_buy_window',
                // event_label: 'mid_banner',
                pids: [_curProInfo.pid],
              }
            : getElkParams('buy_now', { ..._curProInfo, payment_price: priceInfo?.price?.payment_price }, {})
      }
    }
    return btn
  })
  // 矫正购买按钮 show 上报
  if (isClient && !reloadBtnData.reloadOs[os]) {
    reloadBtnData.reloadOs[os] = true
    reloadBtnData.value = false
    nextTick(() => {
      reloadBtnData.value = true
    })
  }
}
const loadClient = routeName === 'downloader' || routeName === 'all_in_one' || dvdfab365.isFab365
renderData(osText, useProDiffPrice().value, !loadClient)

watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal, useProDiffPrice().value)
  },
)

watch(
  () => useProDiffPrice().value,
  (val: any) => {
    renderData(useOs().value, val)
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div
    class="mid-banner text-center block-box"
    :class="[blockClass.value, `text-${textTheme}`, routeName]"
    :style="style"
  >
    <BaseContainer>
      <div class="mb-content flex flex-col flex-items-center flex-justify-center">
        <!-- :class="props.desc ? 'mb20' : 'mb60'"  -->
        <h2 class="mb-title mb60" v-html="bannerInfo.title"></h2>
        <!-- <p v-if="props.desc" class="mb-desc mb40 font-s-20" v-html="props.desc"></p> -->
        <slot name="middle" :data="$attrs"></slot>
        <PagesProductGiftBox
          v-if="bannerInfo.showPriceBox"
          class="mb40 posi-mid"
          v-bind="bannerInfo.priceGiftInfo"
        />
        <div class="btn-group flex flex-justify-center">
          <div v-for="(btn, idx) in bannerInfo.btnList" :key="'btn-item' + idx" class="btn-item">
            <template v-if="btn.component === 'MyButtonBuy'">
              <component
                :is="btn.component"
                v-bind="btn.info"
                v-if="btn.info.href === 'javascript:;'"
                v-track:click="btn.click"
                data-buy-dlg="show"
                :data-pid="proInfo.pid"
              />
              <template v-else>
                <component
                  :is="btn.component"
                  v-if="reloadBtnData.value && reloadBtnData?.reloadOs[osText]"
                  v-track:exposure="btn.exposure"
                  v-track:click="btn.click"
                  v-bind="btn.info"
                />
              </template>
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
.tip-text {
  color: @text-gray-color;
}
.btn-group {
  gap: 30px;
}
.text-light {
  color: @text-white-color;
  .tip-text {
    color: @text-white-color;
  }
}

.posi-mid {
  &.no-gift {
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
  :deep(&.no-gift) {
    .price-box {
      max-width: 240px;
    }
  }
}
.dvdfab365 {
  .mb-title {
    margin-bottom: 40px;
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
}

@media (max-width: 640px) {
  .btn-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
