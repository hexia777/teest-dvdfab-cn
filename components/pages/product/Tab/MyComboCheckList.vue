<script setup lang="ts">
interface CheckedPriceInfo {
  standardPrice: string | number | undefined
  specialOffer: string | number | undefined
  finalPrice: string | number | undefined
  offText: string | undefined
  finalPriceClear: string | number
}
const emits = defineEmits(['selPidsChange'])
const { $trace } = useNuxtApp() as any
const { apiStreamfabMycombo } = useApi()
const { getPriceByOpt, getElkParams, getBuyUrl } = useProductDiffPrice()
const props = defineProps({
  theme: {
    type: String,
    default: 'primary', // primary secondary
  },
  os: { type: String, default: 'win' },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  dlgInfo: {
    type: Object,
    default: () => {
      return {
        curPid: 0,
        list: [],
        textInfo: {},
      }
    },
  },
})

/** *********************常用变量*************************/
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commonJson = useI18n().value.common

const osText = computed(() => {
  return props.os
})
const proListData = props.dlgInfo.list.find((litem: any) => {
  const newItem = litem.attributes
  return newItem.system === osText.value
})
// 默认产品
let defaultPids: Array<string | number> = []

const aioProductItems = proListData.attributes?.aio_product_items?.data?.map((proItems: any) => {
  const newProItems = proItems.attributes
  newProItems.products = proItems.attributes.products?.data
    ? proItems.attributes.products?.data.map((pro: any) => {
        return pro.attributes
      })
    : proItems.attributes.products
  if (newProItems.selected_products.data?.length) {
    defaultPids = newProItems.selected_products?.data.map((sel: any) => sel.attributes.pid)
  }
  return newProItems
})
const defaultRecomPid = props.os === 'win' ? 906 : 1906
if (props.dlgInfo.curPid && props.dlgInfo.curPid !== defaultRecomPid) {
  defaultPids = [defaultRecomPid, props.dlgInfo.curPid]
}

const aioProInfo = getStrapiData(proListData.attributes.product)

const tagData: any = proListData.attributes?.tags?.map((tag: any) => {
  const pids = tag.products.data.map((pro: any) => {
    return pro.attributes.pid
  })
  return {
    key: tag.tag,
    title: tag.title,
    pids,
  }
})

// 选中的pid
const selPids = ref<Array<string | number>>([])
selPids.value = defaultPids

const planInfo = ref<Array<any>>([])
// 折扣比例
const rate = ref<number>(1)
// tab 类型
const proType = ref<string>()
proType.value = aioProductItems.length ? aioProductItems[0].key : ''
// 展示价格
const prices = ref<CheckedPriceInfo>({
  standardPrice: '',
  specialOffer: '',
  finalPrice: '',
  offText: '',
  finalPriceClear: 0,
})

// bundlePid
const bundlePid = computed(() => {
  return osText.value === 'win' ? 20051 : 21051
})

// 是否展示 mycombo 弹窗
const showAioDlg = ref<boolean>(false)
/** *********************方法*************************/
// 获取价格
const getPlanPrice = async () => {
  if (selPids.value.length < 2) {
    return
  }

  const params = {
    spids: selPids.value.join(','),
    pid: bundlePid.value,
    currency: currency[0],
  }
  try {
    const { data: res } = await apiStreamfabMycombo.calculatePrice(params)
    if (res && res.value?.cscode === 0) {
      const resData = res.value?.data
      rate.value = +(resData?.amount / resData?.standard_price).toFixed(10)
      prices.value.standardPrice = translatePrice(resData?.standard_price, currency[1], locale)
      prices.value.specialOffer = '-' + translatePrice(resData?.bundle_save, currency[1], locale)
      prices.value.finalPrice = translatePrice(resData?.amount, '<span>' + currency[1] + '</span>', locale)
      prices.value.finalPriceClear = resData?.amount
      const offPrice: string =
        (translatePrice(resData?.bundle_save.toFixed(0), currency[1]) as string, locale) || ''
      let nPrice = offPrice
      if (offPrice.includes(',')) {
        const priceArr = offPrice.split(',')
        nPrice = priceArr[0] + priceArr[1].substr(priceArr[1].length - 1)
      } else {
        nPrice = offPrice.split('.')[0]
      }
      prices.value.offText = commonJson.coupon_num_2.replace('{num}%', nPrice)
      renderComboData()
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

// 渲染ComboData
const renderComboData = () => {
  const planGrouInfo = []
  for (let i = 0; i < aioProductItems.length; i++) {
    const proItem = aioProductItems[i]
    const childs = []
    let checkNum = 0
    for (let j = 0; j < proItem.products.length; j++) {
      const pro = proItem.products[j]

      const oriPrice = translatePrice(getPriceByOpt(pro, 'LFT'), currency[1], locale)
      let hotText = ''
      tagData.forEach((tag: any) => {
        if (tag.pids.includes(pro.pid)) {
          hotText = tag.title
        }
      })
      const checked = selPids.value?.includes(pro.pid)
      let price = oriPrice
      if (checked && selPids.value.length > 1) {
        price = translatePrice(getPriceByOpt(pro, 'LFT') * rate.value, currency[1], locale)
      }
      if (checked) {
        checkNum++
      }
      const childInfo = {
        hotText,
        pid: pro.pid,
        name: pro.shortName,
        oriPrice,
        price,
        checked,
        slug: pro.slug,
      }
      childs.push(childInfo)
    }
    planGrouInfo.push({
      key: proItem.key,
      title: proItem.title,
      childs,
      num: checkNum,
    })
  }
  planInfo.value = planGrouInfo
}

const commonElkHandle = (params: any, event = 'click') => {
  const elkParams = {
    ...params,
    ...props.gTrackInfo,
    event,
  }
  $trace.traceCustomEvent({ ...elkParams })
}
/** *********************交互事件*************************/
// tab 切换
const tabChangeHandle = (item: any) => {
  proType.value = item.key
  const elkValue = proType.value === 'Popular Products' ? 'popular' : 'other'
  commonElkHandle({
    event_label: 'change_customize',
    event_value: elkValue,
  })
}
const selProChange = (evt: any) => {
  if (selPids.value.length === 9) {
    const pid = selPids.value.pop()
    if (document.getElementById('pmt-cb-pro-' + pid)) {
      ;(document.getElementById('pmt-cb-pro-' + pid) as HTMLInputElement).checked = false
    }
    showAioDlg.value = true
    commonElkHandle({
      event_category: 'streamfabAioDlgOpen',
      customize_options: selPids.value,
    })
  } else {
    getPlanPrice()
  }
}

const selPlanHandle = (pro: any) => {
  const route = pro.slug.replace(/.htm|\//g, '').replace(/-/g, '_')
  commonElkHandle({
    event_label: 'customize_product',
    event_value: osText.value === 'win' ? route : route + '_for_mac',
  })
  emits('selPidsChange', selPids.value)
}

/** *********************computed 变量*************************/
const allPlanInfo = computed(() => {
  return planInfo.value?.reduce((acc: any, cur: any) => {
    return acc.concat(cur.childs)
  }, [])
})

// 选中的元素
const selPlanInfo = computed(() => {
  const recomPlanInfo = allPlanInfo.value?.filter((v: any) => selPids.value.includes(v.pid))
  return recomPlanInfo || []
})
// 购买链接
const getCheckOutUrl = computed(() => {
  if (selPids.value.length < 2) {
    return ''
  }
  let params: any = {
    discount: 'streamfab_customize_aio',
  }
  params['cal' + bundlePid.value] = selPids.value.join(',')

  if (props.gTrackInfo && Object.keys(props.gTrackInfo).length) {
    params = {
      ...params,
      ...props.gTrackInfo,
      et_pa: 1,
    }
  }
  const urlSufix = urlParamsToString(params)
  return getCheckoutUrl(bundlePid.value, 'LFT', '&' + urlSufix)
})
const buyElkParams = computed(() => {
  return getElkParams(
    'buy_now',
    { pid: osText.value === 'win' ? '20051' : '21051', payment_price: prices.value.finalPriceClear },
    { customize_options: selPids.value, ...props.gTrackInfo },
    'checkout',
  )
})
/** *********************生命周期*************************/
watch(
  () => props.os,
  () => {
    renderComboData()
  },
)
onMounted(() => {
  renderComboData()
  getPlanPrice()
})
</script>

<template>
  <div class="mycombo-check-tab w100%">
    <div class="check-panel-tab flex-center flex-col w100%">
      <div class="tab-head">
        <template v-for="item in planInfo" :key="item.key">
          <div
            class="tab-head-item flex-center font-bold w50%"
            :class="{ active: item.key === proType }"
            :data-num="item.num ? item.num : ''"
            @click="tabChangeHandle(item)"
            v-html="item.title"
          ></div>
        </template>
      </div>
      <div class="pros-list">
        <div v-for="item in planInfo" v-show="item.key == proType" :key="item.key" class="pros-items">
          <template v-for="pro in item.childs" :key="'pro' + pro.pid">
            <div class="pros-wrap">
              <div class="pros-item">
                <label>
                  <input
                    :id="'cb-pro-' + pro.pid"
                    v-model="selPids"
                    type="checkbox"
                    :value="+pro.pid"
                    name="pid"
                    @change="selProChange"
                    @click.stop="selPlanHandle(pro)"
                  />
                  <span class="self_checkbox">
                    <i v-if="selPids.includes(+pro.pid)" class="iconfont-sg icon-check-h theme-color"></i>
                    <i v-else class="iconfont-sg icon-check-n font-size-17"></i>
                  </span>
                  <span>{{ pro.name }}</span>
                  <span v-if="pro.hotText" class="subscript" v-html="pro.hotText"></span>
                </label>
                <span class="fr">
                  <span v-if="pro.checked" class="p-ori" v-html="pro.oriPrice"></span>
                  <span class="p-cur" v-html="pro.price"></span>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="checked-reson">
      <div class="srb-left">
        <div
          class="srn-l-title"
          v-html="dlgInfo.textInfo.selectedTip?.replace('{num}', selPlanInfo.length)"
        ></div>
        <ul class="srn-l-content">
          <li v-for="(sel, idx) in selPlanInfo" :key="'sel_result' + idx" class="srn-l-wrap">
            <div class="srn-l-item">{{ sel.name }}</div>
          </li>
        </ul>
        <!-- 少于两个给出提示 -->
        <div v-if="selPlanInfo.length < 2" class="tips-box flex error mt16">
          <span class="iconfont-sg icon-c-notice mr10"></span>
          <div class="flex-center">{{ dlgInfo.textInfo.selectRequestText || '' }}</div>
        </div>
      </div>
      <div class="srb-right flex flex-col flex-items-end">
        <div class="pri-item mb10">
          <span class="pri-t" v-html="'Standard Price:'"></span>
          <span class="pri-v" v-html="prices.standardPrice"></span>
        </div>
        <div class="pri-item mb10">
          <span class="pri-t" v-html="'Special Offer:'"></span>
          <span class="pri-v" v-html="prices.specialOffer"></span>
        </div>
        <div class="pri-line"></div>
        <div class="pri-item cur mb10">
          <span class="pri-t" v-html="'Final Price:'"></span>
          <span class="pri-v font-size-36" v-html="prices.finalPrice"></span>
        </div>
        <MyButtonBuy
          v-track:click="buyElkParams"
          :show-icon="false"
          :label="dlgInfo.textInfo.checkBtnText"
          :href="getCheckOutUrl"
          :disabled="selPlanInfo.length < 2"
        />
      </div>
    </div>
    <PagesDialogSfAioDlg
      v-model="showAioDlg"
      :text-info="dlgInfo.textInfo"
      :pro-info="aioProInfo"
      :g-track-info="gTrackInfo"
    />
  </div>
</template>

<style scoped lang="less">
.theme-color {
  color: @primary-color;
}
.check-panel-tab {
  position: relative;
  background: @bg-white;
  border-radius: 16px;
  margin-top: 6px;
  .tab-head {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #eeeeee;
    .tab-head-item {
      font-size: @font-size;
      position: relative;
      line-height: @title-line-height;
      height: 60px;
      cursor: pointer;
      text-align: center;
      &:hover,
      &.active {
        color: @primary-color;
        &::before {
          background-color: @primary-color;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 2px;
      }
      &::after {
        content: attr(data-num);
        margin-left: 4px;
        transform: translateY(-50%);
        white-space: nowrap;
        font-size: @font-size-xs;
        color: #ff4200;
        font-weight: bold;
      }
    }
  }
  .pros-list {
    padding: 30px;
    width: 100%;
    .pros-wrap {
      width: 50%;
      margin-bottom: 12px;
      line-height: 30px;
      &:nth-child(odd) {
        padding-right: 30px;
      }
      &:nth-child(even) {
        padding-left: 30px;
      }
    }
    .pros-items {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .pros-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      label {
        display: flex;
        // align-items: center;
        cursor: pointer;
        line-height: @title-line-height;
        input {
          width: 0;
          border: none;
          opacity: 0;
        }
      }
      .subscript {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 16px;
        background: #ff4200;
        border-radius: 8px;
        padding: 0 8px;
        margin-left: 8px;
        font-size: 12px;
        color: #ffffff;
        font-style: italic;
        line-height: 1;
        flex: none;
      }
      .self_checkbox {
        margin-right: 8px;
        position: relative;
      }
      .p-ori {
        text-decoration: line-through;
        text-align: right;
        & + .p-cur {
          color: @secondary-color;
        }
      }
      .p-cur {
        margin-left: 12px;
        text-align: right;
      }
    }
  }
}
.checked-reson {
  display: flex;
  justify-content: space-between;
  padding: 30px 40px;
  .srb-left {
    width: 100%;
  }
  .srn-l-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 12px;
  }
  .srn-l-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;
    padding-left: 20px;

    li {
      width: calc(50% - 10px);
      list-style-type: disc;
    }
  }
  .srb-right {
    width: 100%;
    max-width: 400px;
    margin-left: 20px;
  }
  .pri-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pri-t {
      font-weight: bold;
    }
    .pri-v {
      text-align: right;
    }
    &.cur {
      .pri-v {
        font-weight: bold;
        color: @secondary-color;
      }
      :deep(.pri-v) {
        span {
          font-size: 18px;
        }
      }
    }
  }
  .tips-box {
    padding: 2px 10px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }
}

@media (max-width: 1200px) {
  .checked-reson {
    .srn-l-content {
      min-width: 240px;
    }
    .srb-right {
      max-width: 340px;
    }
  }
}
@media (max-width: 1024px) {
  .check-panel-tab {
    .pros-list {
      padding: 30px 20px;
      .pros-wrap {
        &:nth-child(odd) {
          padding-right: 20px;
        }
        &:nth-child(even) {
          padding-left: 20px;
        }
      }
    }
  }
  .checked-reson {
    .srn-l-content {
      flex-direction: column;
      ul {
        min-width: unset;
        width: 100%;
        max-width: 300px;
        &:first-child {
          margin-right: 0;
        }
      }
      li {
        width: 100%;
      }
    }
    .srb-right {
      max-width: 400px;
    }
  }
}
@media (max-width: 900px) {
  .check-panel-tab {
    .pros-list {
      .pros-wrap {
        width: 100%;
        &:nth-child(odd) {
          padding-right: 0;
        }
        &:nth-child(even) {
          padding-left: 0;
        }
      }
    }
  }
  .checked-reson {
    .srb-left {
      width: 100%;
      max-width: 50%;
    }
    .srn-l-content {
      max-width: 100%;
    }
    .srb-right {
      max-width: 50%;
    }
  }
}
@media (max-width: 640px) {
  .checked-reson {
    flex-direction: column;
    padding: 30px 16px;
    .srb-left {
      max-width: 100%;
    }
    .srn-l-content {
      flex-direction: row;
      gap: 5px;
      li {
        font-size: 14px;
        width: 100%;
      }
    }
    .srb-right {
      max-width: 100%;
      margin-top: 20px;
      margin-left: 0;
    }
  }
}
@media (max-width: 475px) {
  .check-panel-tab {
    .pros-list {
      .pros-item {
        label {
          align-items: flex-start;
        }
        .fr {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
  .checked-reson {
    .srn-l-content {
      flex-direction: column;
    }
  }
}
@media (max-width: 414px) {
  .check-panel-tab {
    .tab li {
      font-size: @base-font-size;
    }
  }
}
</style>
