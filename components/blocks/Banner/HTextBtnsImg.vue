<script setup lang="ts">
import discountPidJson from '@/assets/json/product/special_discount_pid.json'

const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'dvdfab', // normal other dvdfab streamfab musicfab middle recordfab bookfab
  },
  textTheme: {
    type: String,
    default: 'dark', // dark light
  },
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
  // 更新 tips 文案
  // updateText: {
  //   type: String,
  //   default: '',
  // },
  media: {
    type: Object,
    default: () => {},
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  imgClass: {
    type: String,
    default: '',
  },
  reloadBtnData: {
    type: Object,
    default: () => {
      return {
        reloadOs: {
          win: false,
          mac: false,
        } as any, // 已经重新 reload 过的系统
        value: true, // 已经重新 reload 过的系统
      }
    },
  },
  // 下载按钮文案
  downloadBtn: { type: String, default: '' },
})
const { getLowestPrice } = useProductDiffPrice()
const isMobile = useStore.common().mobile
const macData: any = useAttrs().macData || props
// 接受子组件的方法, 抛出去
const emits = defineEmits(['tabClick'])
const routeName = useRoute().name as string
const commomJson = useI18n().value.common
const proInfo = useProInfo().value || {}
const macProInfo = useMacProInfo().value || proInfo
const imgData = getStrapiData(props.media) || {}
let styleData = getStrapiData(props.style) || null
const loadClient = routeName === 'downloader' || routeName === 'all_in_one'
const hasMac = Object.keys(proInfo).length > 0 && (Object.keys(macProInfo).length > 0 || props.macLink)
const osText = useStore.common().client

const bannerInfo = reactive({
  btnList: [] as any,
  title: '',
  desc: '',
  descSub: [] as any,
  updateText: '', // 更新时间
  proInfo: {} as any,
  imgData: {} as any,
  styleData: {} as any,
})

const defaultBtnList = [
  {
    info: {
      href: '/',
      showIcon: true,
      label: commomJson.try_for_free,
      theme: 'primary',
      os: osText,
      size: 'large',
      slug: proInfo.slug,
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
      slug: proInfo.slug,
      tag: 'a',
      couponText: props.buyNowTip,
      click: () => {
        // if (window?.dlgShow) {
        // window?.dlgShow()
        // }
      },
    },
    component: 'MyButtonBuy',
    tipText: '',
    tipIconClass: '',
  },
]

const commomStore = useStore.common()

const _reloadBtnData = {
  reloadOs: {
    win: false,
    mac: false,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
}

if (!loadClient) {
  _reloadBtnData.reloadOs.win = true
  _reloadBtnData.reloadOs.mac = true
}
// 默认背景
const defaultStyle: any = {
  dvdfab: {
    background: 'linear-gradient(180deg, #a9ebd8 0%, #ffffff 100%)',
    paddingBottom: 0,
  },
  streamfab: {
    background: 'linear-gradient(180deg, #c2edff 0%, #ffffff 100%)',
    paddingBottom: 0,
  },
  musicfab: {
    background: 'linear-gradient(180deg, #d8f6f2 0%, #ffffff 100%)',
    paddingBottom: 0,
  },
  playerfab: {
    background: 'linear-gradient(115deg, #015deb 0%, #12a9f5 100%)',
  },
  passkey: {
    background: 'linear-gradient(115deg, #015deb 0%, #12a9f5 100%)',
  },
  recordfab: {
    background: 'linear-gradient(180deg, #E2E7FF 0%, #FFFFFF 100%)',
  },
  bookfab: {
    background: 'linear-gradient(rgb(226, 244, 255) 0%, rgb(255, 255, 255) 100%)',
  },
  other: {
    backgroundColor: '#0c8ef1',
    backgroundImage: commomStore.mobile ? '' : `url('${useImgPath().value + '/cn/product/banner1.jpg'}')`,
    backgroundRepeat: ' no-repeat',
    backgroundPositon: 'cover',
    backgroundSize: 'cover',
  },
  middle: {
    background: commomStore.mobile
      ? 'linear-gradient(115deg, #1572E7 0%, #EA63FF 100%)'
      : `url('${useImgPath().value + '/cn/product/banner2.jpg'}') center no-repeat`,
    backgroundSize: 'cover',
    backgroundColor: '#8d75ff',
  },
}
styleData = !styleData || Object.keys(styleData).length === 0 ? defaultStyle[props.type] : styleData

// 默认图片样式
const mediaStyle: any = {
  dvdfab: {
    width: '480',
    height: '340',
    class: 'ml90',
  },
  streamfab: {
    width: '570',
    height: '525',
  },
  musicfab: {
    width: '596',
    height: '440',
    class: 'ml30',
  },
  playerfab: {
    width: '340',
    height: '340',
  },
  passkey: {
    width: '340',
    height: '340',
  },
  recordfab: {
    width: '570',
    height: '400',
  },
  bookfab: {
    width: '570',
    height: '443',
  },
  other: {
    width: '340',
    height: '340',
  },
  middle: {
    width: '340',
    height: '340',
  },
}

// 购买链接
const getBuyUrl = (proInfo: { [key: string]: any }, pid: number) => {
  const buyLinkPids: number[] = [845]
  if (!buyLinkPids.includes(proInfo.pid) && (proInfo.type === 'single' || proInfo.type === 'bundle')) {
    return 'javascript:;'
  }
  let params: any = {}
  if (props.gTrackInfo && Object.keys(props.gTrackInfo).length) {
    params = {
      ...params,
      ...props.gTrackInfo,
      et_pa: 1,
    }
  }
  const urlSufix = urlParamsToString(params)
  let couponStr = ''
  if (proInfo.coupon && proInfo.coupon.length) {
    couponStr = `&coupon=${proInfo.coupon[0].key}`
  }
  return getCheckoutUrl(pid, 'LFT', (urlSufix ? '&' + urlSufix : '') + couponStr)
}

/**
 * @function getDiscountConfigBuyPid
 * @description 获取配置文件中特殊优惠的产品
 * @param pid
 */
const getDiscountConfigBuyPid = (pid: number) => {
  const discountPidCfg = JSON.parse(JSON.stringify(discountPidJson))
  return discountPidCfg[pid]
}
const renderData = (os: string, isClient = true) => {
  let _curProInfo =
    os === 'win'
      ? Object.values(proInfo).length // 兼容media系统只有mac 没有 win
        ? proInfo
        : macProInfo
      : macProInfo && Object.values(macProInfo).length // 兼容media系统只有win 没有 mac
      ? macProInfo
      : proInfo
  if (!Object.keys(_curProInfo).length) {
    _curProInfo = proInfo
  }
  _curProInfo.addLftFix = true
  if (!_curProInfo.price?.length && _curProInfo.redirect_products?.data) {
    const _redireactProInfo = getStrapiData(_curProInfo.redirect_products)
    if (_redireactProInfo) {
      _redireactProInfo.downloadUrl = _redireactProInfo.downloadUrl.length
        ? _redireactProInfo.downloadUrl
        : _curProInfo.downloadUrl
      _redireactProInfo.name = _curProInfo.name
      _redireactProInfo.addLftFix = false
      _curProInfo = _redireactProInfo
    }
  }

  const clientInfo = getStrapiData(_curProInfo.client_info)
  // 按钮
  bannerInfo.btnList = props.btnList.length
    ? props.btnList.flatMap((btn: object) => {
        // 后端禁用 component 字段，需要手动赋值
        btn.component = btn.componentName || btn.component
        console.log(btn)
        return btn
      })
    : defaultBtnList.flatMap((btn: any) => {
        btn.info.slug = proInfo.slug
        if (btn.component === 'MyButtonDownload') {
          if (!_curProInfo.downloadUrl) {
            return []
          }
          btn.info.os = _curProInfo.system
          btn.info.href = _curProInfo.downloadUrl?.[0].url
          btn.info.label = props.downloadBtn ? props.downloadBtn : btn.info.label
          btn.info['data-warden-ck-parm'] = base64Encode({
            event_label: 'productpage_summary',
            pids: [_curProInfo.pid],
          })
          if (props.type === 'middle') {
            btn.info.osVersion = clientInfo.systemVersion || ''
            btn.info.theme = 'white'
            btn.tipText = ''
            btn.tipIconClass = ''
          }
        } else if (btn.component === 'MyButtonBuy') {
          // middle 类型无购买按钮
          if (props.type === 'middle') {
            return []
          }
          if (!_curProInfo.price?.length) {
            return []
          }
          // 规则: 当前产品页对应的pid  购买按钮上应该展示最低价(需要排除aio页面)
          if (
            (_curProInfo.type === 'single' || [749].includes(+_curProInfo?.pid)) &&
            _curProInfo.price?.length
          ) {
            // 获取当前产品最低的价格方案
            const lowestPrice = getLowestPrice(_curProInfo, { getOpt: true, unit: 'hidden' })
            btn.info.price = lowestPrice.value
          }
          btn.info.href = getBuyUrl(_curProInfo, _curProInfo.pid)
          btn.click = {
            event: 'click',
            event_category: 'show_buy_window',
            // event_label: 'banner',
            pids: [_curProInfo.pid],
          }
          // 845产品页购买按钮应该上报buy_now
          if ([845].includes(+proInfo.pid)) {
            btn.click = {
              event: 'buy_now',
              pids: [_curProInfo?.pid || 845],
            }
          }
          // banner购买按钮显示特殊配置的价格折扣,不显示最低价
          const specialDiscountPro = getDiscountConfigBuyPid(_curProInfo.pid)
          if (specialDiscountPro) {
            const targetPrice = _curProInfo.price.find((item: any) => item.key === specialDiscountPro.opt)
            btn.info.price = targetPrice?.value * specialDiscountPro.rate
            btn.info.couponText = commomJson.coupon_num_2.replace('{num}', specialDiscountPro.discount)
          }
        }
        return btn
      })
  const propsInfo = os === 'win' ? props : macData
  bannerInfo.imgData = getStrapiData(propsInfo.media) || {}
  bannerInfo.imgData = { ...bannerInfo.imgData, ...mediaStyle[props.type] }
  // 类型是 musicfab 展示 tip
  if (props.type === 'musicfab') {
    if (_curProInfo.type === 'single') {
      bannerInfo.imgData.showTip = true
    } else {
      bannerInfo.imgData = { ...bannerInfo.imgData, ...{ width: '540', height: '450' } }
    }
  }
  bannerInfo.desc = propsInfo.desc
  bannerInfo.descSub = propsInfo.descSub
  bannerInfo.title = _curProInfo.name
  if (_curProInfo.type === 'aio' && _curProInfo.addLftFix) {
    bannerInfo.title = `${bannerInfo.title} (${commomJson.lifetime})`
  }
  bannerInfo.updateText = clientInfo
    ? commomJson.last_update + ' ' + transformDate(clientInfo.updateDate, commomStore.locale)
    : ''

  // 矫正购买按钮 show 上报
  if (isClient && !_reloadBtnData.reloadOs[os]) {
    _reloadBtnData.reloadOs[os] = true
    _reloadBtnData.value = false
    nextTick(() => {
      _reloadBtnData.value = true
    })
  }
  useReloadBtnData().value = _reloadBtnData
}

renderData(osText, !loadClient)

// 是否展示更新文案
const showUpdateText = computed(() => {
  return ['dvdfab', 'streamfab', 'musicfab', 'playerfab', 'passkey'].includes(props.type)
})

const tabClick = (os: string) => {
  renderData(os)
  emits('tabClick', os)
}

// 预加载
const links = []
if (props.type === 'other') {
  links.push({
    rel: 'preload',
    href: useImgPath().value + '/cn/product/banner1.jpg',
    as: 'image',
  })
} else if (props.type === 'middle') {
  links.push({
    rel: 'preload',
    href: useImgPath().value + '/cn/product/banner2.jpg',
    as: 'image',
  })
}
if (links.length) {
  usePageOtherHead({
    link: links,
  })
}
const reloadBtnDataCmp = computed(() => {
  return loadClient ? useReloadBtnData().value : _reloadBtnData
})
</script>

<template>
  <div
    class="pro-top-banner"
    :class="[`ptb-theme-${type}`, `ptb-text-${textTheme}`, { mobile: isMobile }]"
    :style="styleData"
  >
    <BaseContainer>
      <div class="ptb-top flex flex-items-center">
        <div class="ptb-left">
          <h1 class="ptb-title mb20" v-html="bannerInfo.title || title"></h1>
          <div
            class="ptb-desc font-s-20"
            :class="{ mb40: !bannerInfo.descSub?.length }"
            v-html="bannerInfo.desc"
          ></div>
          <div v-if="bannerInfo.descSub?.length" class="ptb-desc-p mb40 font-s-20">
            <p
              v-for="(pItem, pIndex) in bannerInfo.descSub"
              :key="'p-item-' + pIndex"
              v-html="pItem.value"
            ></p>
          </div>
          <slot name="middle" :data="$attrs"></slot>
          <BaseSwitchOs v-if="hasMac" :mac-link="macLink" class="mb18" @tab-click="tabClick" />
          <div class="btn-group flex">
            <div v-for="(btn, idx) in bannerInfo.btnList" :key="'btn-item' + idx + osText" class="btn-item">
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
                    v-if="reloadBtnDataCmp.value && reloadBtnDataCmp.reloadOs[osText]"
                    v-track:exposure="btn.exposure"
                    v-track:click="btn.click"
                    v-bind="btn.info"
                  />
                </template>
              </template>

              <component :is="btn.component" v-bind="btn.info" v-else />
              <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
                <i :class="btn.tipIconClass"></i>
                <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
              </div>
            </div>
          </div>
          <div v-if="showUpdateText" class="font-s-14 gray-color mt40" v-html="bannerInfo.updateText"></div>
        </div>
        <div v-if="bannerInfo.imgData && Object.keys(bannerInfo.imgData).length" class="ptb-right">
          <MyImg
            class="my-img"
            :class="imgClass"
            :loading="''"
            :src="bannerInfo.imgData.url"
            :width="bannerInfo.imgData.width"
            :height="bannerInfo.imgData.height"
            preload
            :alt="bannerInfo.imgData.alternativeText || bannerInfo.title"
          />
          <span v-if="bannerInfo.imgData.showTip" class="img-desc font-s-18 font-bold">{{
            proInfo.shortName?.replace('Converter', '').trim()
          }}</span>
          <slot name="img-extra"></slot>
        </div>
      </div>
      <!-- 底部的 slot -->
      <slot name="bottom" :data="$attrs"></slot>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.pro-top-banner {
  padding: @gap-lg 0;
  background-size: cover;
  background-position: center;

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
.ptb-theme-bookfab {
  .ptb-right {
    margin-left: 30px;
  }
}
.ptb-theme-musicfab {
  .ptb-right {
    margin-left: 30px;
  }

  :deep(.ptb-desc-p) {
    p {
      position: relative;
      padding-left: 20px;

      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @base-text-color;
        position: absolute;
        left: 0px;
        top: 12px;
      }
    }
  }
}

.ptb-theme-streamfab {
  position: relative;
  padding: 0;

  .ptb-top {
    align-items: flex-start;
  }

  .ptb-left {
    padding-top: @gap-lg;
  }

  .my-img {
    position: relative;
    top: 0;
  }
}

// 居中布局
.ptb-theme-middle {
  text-align: center;
  background: linear-gradient(115deg, #1572e7 0%, #ea63ff 100%);

  .ptb-top {
    justify-content: center;
  }

  .btn-group {
    justify-content: center;
  }
}

.ptb-theme-other {
  background: linear-gradient(115deg, #0059ea 0%, #11a9f5 100%);

  :deep(.ptb-desc) {
    a {
      color: @text-white-color !important;
      text-decoration: underline;

      &:hover {
        .white-opacity(0.7) !important;
      }
    }
  }
}

.img-desc {
  background: linear-gradient(270deg, #00a38a, #26c656);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  left: 7%;
  top: 41%;
}

.ptb-text-light {
  color: @text-white-color;

  .tip-text {
    color: @text-white-color;
  }
}

.float-up-down {
  position: relative;
  animation: float-up-down 5s ease-in-out infinite;
}

@keyframes float-up-down {
  0% {
    top: 0px;
  }
  50% {
    top: 20px;
  }
  100% {
    top: 0px;
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
  }

  .btn-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .ptb-theme-middle {
    .btn-group {
      align-items: center;
    }
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

  .ptb-theme-streamfab {
    .ptb-left {
      padding-top: 0;
    }
  }
}
</style>
<style lang="less">
.ptb-theme-dvdfab,
.ptb-theme-musicfab {
  & + .block-box.bg-normal,
  & + .pro-nav-bar-box + .block-box.has-bg {
    margin-top: @gap-md;
  }
}
.ptb-theme-recordfab {
  & + .pro-nav-bar-box + .block-box {
    padding-top: 0;
  }
}
</style>
