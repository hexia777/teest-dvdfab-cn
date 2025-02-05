<script setup lang="ts">
defineOptions({ name: 'ProNavBarPc' })
interface ProItem {
  hide?: boolean
  event_label?: string
  href: string
  label: string
}
const props = defineProps({
  logoData: {
    type: Object,
    default: () => ({
      logo: 'navbar-logo font-size-0 icon_logo',
      url: 'http://fonts.googleapis.com/',
      title: 'StreamFab',
    }),
  },
  navList: {
    type: Array as any,
    default: () => [
      {
        label: 'Products',
      },
      {
        label: 'Free',
        key: 'free',
      },
      {
        label: 'FAQs',
        url: '/faq/streamfab.htm',
      },
      {
        label: 'Christmas Sales',
        url: 'http://fonts.googleapis.com/',
        coupon: '35% off',
      },
    ],
  },
})
const reloadBtnData = reactive({
  reloadOs: {
    win: false,
    mac: false,
  } as any, // 已经重新 reload 过的系统
  value: true, // 已经重新 reload 过的系统
})
const {
  getDefaultPriceInfo,
  userTypeMapKey,
  getPriceByOpt,
  getChildProName,
  getBuyUrl,
  getUpgradeExtParams,
  getElkParams,
  getUpgradePriceInfo,
} = useProductDiffPrice()

const commonJson = useI18n().value.common
const routeName = useRoute().name
const proInfo = useProInfo().value || {}
const macProInfo = useMacProInfo().value || {}
// 导航按钮数据
const cardData: any = {
  // 两种模式 2 选 1
  // dom 元素消失在视口时，显示二级导航栏
  scrollDomId: 'test',
  pageNavId: 'NavBar',
  // 大于指定滚动高度时，显示二级导航栏
  scrollH: 0,
  btnList: [
    {
      component: 'MyButtonDownload',
      info: {
        size: 'normal',
        showIcon: false,
        label: commonJson.free_download,
        theme: 'primary',
        slug: 'dvdfab',
      },
    },
    {
      component: 'MyButtonBuy',
      info: {
        size: 'normal',
        showIcon: false,
        label: commonJson.buy_now,
        theme: 'primary',
      },
    },
  ],
}
const osText = useOs().value
// 产品信息
const curProInfo: any = reactive({})
const renderData = (os: string, diffPriceInfo: any, isClient = true) => {
  let _proInfo: any = os === 'win' ? proInfo : macProInfo || proInfo
  // todo 优化兼容只有mac的情况
  if (routeName === 'mac_blu_ray_player') {
    _proInfo = macProInfo || useProInfo().value
  }
  if (!Object.keys(_proInfo).length) {
    _proInfo = proInfo
  }
  // 获取价格信息
  let priceInfo = getUpgradePriceInfo(_proInfo, diffPriceInfo) || {
    options: {
      has_lft_options_num: 0,
      has_nlt_options_num: 0,
      has_online_lft_options_num: 0,
      has_online_nlt_options_num: 0,
      has_online_options_num: 0,
      has_options_num: 0,
      total_options_num: _proInfo?.products?.data.length,
      lft_not_owned: {},
      lft_owned: {},
      not_owned: [],
      owned: [],
    },
    user_tag_type: 'new',
    price: getDefaultPriceInfo(_proInfo),
  }
  // playerfab 暂时未对接升级
  if (routeName === 'playerfab') {
    priceInfo = {
      options: {
        has_lft_options_num: 0,
        has_nlt_options_num: 0,
        has_online_lft_options_num: 0,
        has_online_nlt_options_num: 0,
        has_online_options_num: 0,
        has_options_num: 0,
        total_options_num: _proInfo?.products?.data.length,
        lft_not_owned: {},
        lft_owned: {},
        not_owned: [],
        owned: [],
      },
      user_tag_type: 'new',
      price: getDefaultPriceInfo(_proInfo),
    }
  }
  const userType = userTypeMapKey.streamfab[priceInfo.user_tag_type]
  // 产品数据更新
  if (!proInfo.price?.length && _proInfo.redirect_products?.data) {
    const _redireactProInfo = getStrapiData(proInfo.redirect_products?.data[0])
    if (_redireactProInfo) {
      _proInfo =
        os === _redireactProInfo.system
          ? _redireactProInfo
          : getStrapiData(_redireactProInfo.related_products?.data[0]) || _redireactProInfo
    }
  }
  Object.assign(curProInfo, _proInfo)
  // 按钮数据更新
  // cardData.btnList = cardData.btnList.flatMap((btn: any, index: number) => {
  //   // 免费产品不显示购买按钮
  //   if (curProInfo.type === 'free' && btn.component === 'MyButtonBuy') {
  //     cardData.btnList.splice(index, 1)
  //     btn.info['data-vars-bpid'] = proInfo.pid
  //     btn.info['data-warden-ck-parm'] = base64Encode({
  //       event_label: 'productpage_menu',
  //     })
  //   }

  //   btn.pid = curProInfo.pid
  //   if (btn.component === 'MyButtonDownload') {
  //     btn.info.href = curProInfo.downloadUrl?.[0].url
  //     btn.info['data-vars-dpid'] = curProInfo.pid
  //     btn.info['data-warden-ck-parm'] = base64Encode({
  //       event_label: 'productpage_menu',
  //     })
  //     if ([795].includes(+curProInfo.pid)) {
  //       return []
  //     }
  //   } else if (btn.component === 'MyButtonBuy') {
  //     if (!curProInfo.price?.length) {
  //       return []
  //     }
  //     // 规则 返回的price数组中 只有lft时 不展示弹窗
  //     if (
  //       (curProInfo.type === 'single' || [62001, 62004, 749].includes(+curProInfo.pid)) &&
  //       curProInfo.system !== 'android' &&
  //       ![845].includes(+curProInfo.pid)
  //     ) {
  //       btn.info.href = 'javascript:;'
  //     } else {
  //       btn.info.href = getBuyUrl(curProInfo, props, priceInfo.price, {}, 'LFT')
  //       if (curProInfo.system === 'android' || [845].includes(+curProInfo.pid)) {
  //         btn.click = getElkParams(
  //           'buy_now',
  //           { ...curProInfo, payment_price: priceInfo?.price?.payment_price },
  //           {},
  //         )
  //       }
  //       if (routeName === 'downloader') {
  //         const extParams = getUpgradeExtParams(priceInfo, curProInfo, 'streamfab', 'productpage_menu')
  //         btn.exposure = getElkParams('show', curProInfo, { ...extParams, event_label: 'productpage_menu' })
  //         btn.click = getElkParams('buy_now', curProInfo, { ...extParams, event_label: 'productpage_menu' })
  //         btn.info.href = getBuyUrl(curProInfo, props, priceInfo.price, extParams, 'LFT', userType)
  //         btn.info.label = userType !== 'new' ? commonJson.upgrade_now : commonJson.buy_now
  //       }
  //     }
  //   }
  //   return btn
  // })
  // 矫正购买按钮 show 上报
  if (isClient && !reloadBtnData.reloadOs[os]) {
    reloadBtnData.reloadOs[os] = true
    reloadBtnData.value = false
    nextTick(() => {
      reloadBtnData.value = true
    })
  }
}
const loadClientRoute = ['downloader', 'all_in_one', 'streamfab_for_android']
const loadClient = loadClientRoute.includes(routeName as string)
renderData(useOs().value, useProDiffPrice().value, !loadClient)
watch(
  () => useOs().value,
  (val) => {
    renderData(val, useProDiffPrice().value)
  },
)
watch(
  () => useProDiffPrice().value,
  (newVal) => {
    renderData(useOs().value, newVal)
  },
  {
    deep: true,
  },
)
/**
 * 点击锚点  start
 * */
// 设置高亮, 上报
const activeIdx = ref<number>(-1)
const clickMenu = (menu: any, index: number) => {
  activeIdx.value = index
  reportDatas(menu, menu.href)
  // 页面滚动
  const target = document.getElementById(menu.id) as HTMLElement
  if (target) {
    document.documentElement.scrollTop = target?.offsetTop - 100
  } else {
    document.documentElement.scrollTop = 0
  }
}

//  面板显示逻辑
let timer: any = null
const mouseEnterNavMenu = (index: number) => {
  // 清除任何现有的计时器
  if (timer) {
    clearTimeout(timer)
  }

  // 设置新的计时器
  timer = setTimeout(() => {
    // 如果在这个菜单项上悬停了超过 300 毫秒，那么显示这个菜单项的面板
    activeIdx.value = index
  }, 300)
}

const mouseLeaveNavMenu = (index: number) => {
  // 如果鼠标离开了一个菜单项，那么清除计时器
  if (timer) {
    clearTimeout(timer)
  }

  // 如果鼠标离开的是当前显示的菜单项，那么开始计时
  if (index === activeIdx.value) {
    timer = setTimeout(() => {
      // 如果在这个菜单项上没有悬停超过 300 毫秒，那么隐藏这个菜单项的面板
      activeIdx.value = -1
    }, 300)
  }
}

// 如果鼠标离开了整个菜单区域，那么隐藏任何显示的菜单面板
const mouseLeaveMenuArea = () => {
  if (timer) {
    clearTimeout(timer)
  }
  activeIdx.value = -1
}

/**
 * 上报相关  start
 * */
const getTrackData = (menu: any, url: string) => {
  const event_label = menu.event_label || menu.url
  const event_target: any = {
    position: 'pro_nav_header',
  }
  if (url) event_target.url = url
  return {
    event: url ? 'click' : 'hover',
    event_label,
    xargs_event_category: 'nav_product',
    event_target,
  }
}

const reportDatas = async (menu: any, url: string) => {
  const { $trace } = useNuxtApp() as any
  const data = getTrackData(menu, url)
  await $trace.traceCustomEvent(data)
}

/**
 * 导航显示相关  start
 * */
// 是否显示导航栏
const navShow = ref<boolean>(false)
// > scrollY 高度显示二级导航栏
const scrollY = ref<number>(0)
// 二级导航栏距离顶部的高度
const proNavOffTop = ref<number>(0)
const proNavOffH = ref<number>(0)
const proNavH = ref<number>(0)
// 公共导航栏
const pageNavOffTop = ref<number>(0)
const pageNavOffH = ref<number>(0)
const pageNavH = ref<number>(0)
// banner
const scrollDomH = ref<number>(0)
// 锚点
const domObj = ref<any>({})

// 滚动页面时触发
const handleScroll = () => {
  // 共导航栏显示/隐藏
  showPageNav()
  // 计算锚点对应位置
  clcAnchorPositon()
}

// 获取 dom 元素
const getElOffset = () => {
  // 二级导航
  const proNav = document.getElementById('proNavBar') as HTMLElement
  proNavOffTop.value = proNav?.offsetTop || 0
  proNavOffH.value = proNav?.offsetHeight

  // 公共导航
  const pageNavId = cardData.pageNavId
  const pageNav = document.getElementById(pageNavId) as HTMLElement
  pageNavOffTop.value = pageNav?.offsetTop || 0
  pageNavOffH.value = pageNav?.offsetHeight

  if (pageNav) {
    const pageNavStyle = getEleCptStyle(pageNav)
    pageNavH.value = pageNavStyle?.allH || 0
  }

  // banner
  const scrollDomId = cardData.scrollDomId
  const scrollDom = document.getElementById(scrollDomId) as HTMLElement

  if (scrollDom) {
    const scrollDomStyle = getEleCptStyle(scrollDom) || {}
    scrollDomH.value = scrollDomStyle?.allH || 0
  }

  // 锚点
  const overview = document.querySelector('#overview') as HTMLElement
  const overviewOffTop = overview?.offsetTop
  const features = document.querySelector('#features') as HTMLElement
  const featuresOffTop = features?.offsetTop
  const guide = document.querySelector('#guide') as HTMLElement
  const guideOffTop = guide?.offsetTop
  const techSpecs = document.querySelector('#tech_specs') as HTMLElement
  const techSpecsOffTop = techSpecs?.offsetTop

  // dom 元素
  domObj.value = {
    // 公共导航栏
    pageNav: {
      id: pageNavId,
      dom: pageNav,
      pageNavH: pageNavH.value,
      offsetTop: pageNavOffTop.value,
      offsetHeight: pageNavOffH.value,
    },
    // 二级导航栏
    proNav: {
      id: 'proNavBar',
      dom: proNav,
      proNavH: proNavH.value,
      offsetTop: proNavOffTop.value,
      offsetHeight: proNavOffH.value,
    },
    // dom 消失在视口时，显示二级导航栏
    scrollDom: {
      id: scrollDomId,
      dom: scrollDom,
      scrollDomH: scrollDomH.value,
      offsetHeight: scrollDomH.value,
    },
    anchor: [
      {
        id: 'overview',
        dom: overview,
        offsetTop: overviewOffTop || 0,
      },
      {
        id: 'features',
        dom: features,
        offsetTop: featuresOffTop || 0,
      },
      {
        id: 'guide',
        dom: guide,
        offsetTop: guideOffTop || 0,
      },
      {
        id: 'tech_specs',
        dom: techSpecs,
        offsetTop: techSpecsOffTop || 0,
      },
    ],
  }
}

const showPageNav = () => {
  const pageNavId = cardData.pageNavId
  const pageNav = document.getElementById(pageNavId) as HTMLElement

  // 滚动条滚动距离
  const scrollDist = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  // 大于 scrollY 显示二级导航栏
  const scrollH = cardData.scrollH
  scrollY.value = (scrollDomH.value || scrollH) + pageNavH.value
  navShow.value = scrollDist > scrollY.value

  if (navShow.value && pageNav) {
    // 隐藏公共 导航栏
    pageNav.style.display = 'none'

    // 设置二级导航栏高度
    if (domObj.value?.proNav?.dom) {
      const proNav = domObj.value?.proNav?.dom
      const proNavStyle = getEleCptStyle(proNav)

      proNavH.value = proNavStyle?.allH || 0
    }
  } else if (pageNav) {
    // 显示公共 导航栏
    pageNav.style.display = 'block'
  }
}

/**
 * 导航显示相关  end
 * */

// 获取 dom 的各种距离属性
const getEleCptStyle = (domItem: HTMLElement) => {
  if (!domItem) {
    return {}
  }

  const style = window.getComputedStyle(domItem)

  const height = parseFloat(style.height)
  const paddingTop = parseFloat(style.paddingTop)
  const paddingBottom = parseFloat(style.paddingBottom)
  const marginTop = parseFloat(style.marginTop)
  const marginBottom = parseFloat(style.marginBottom)

  let allH: number
  if (style.boxSizing === 'border-box') {
    allH = height + marginTop + marginBottom
  } else {
    allH = height + paddingTop + paddingBottom + marginTop + marginBottom
  }

  return {
    allH,
    height,
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
  }
}

/**
 * 计算锚点滚动对应区域  start
 * */
const pageNavActive: Array<string> = []
const clcAnchorPositon = () => {
  // 滚动条实际滚动距离
  const scrollDist = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  let anchorList = domObj.value?.anchor
  // 二级导航高度
  const extraDist = domObj.value?.proNav?.proNavH || 94
  const scrollTop = scrollDist + extraDist + 100
  const { $trace } = useNuxtApp() as any
  const arr: { offsetTop: any }[] = []
  anchorList?.forEach((item: { offsetTop: any }, index: number) => {
    if (index > 0 && item?.offsetTop) {
      arr.push(item)
    } else if (index === 0) {
      arr.push(item)
    }
  })
  anchorList = arr
  for (let i = 0; i < anchorList?.length; i++) {
    const anchor = anchorList[i]
    const nextAnchor = anchorList[i + 1]
    // 判断滚动条是否在当前区间内
    if (
      (nextAnchor && scrollTop >= anchor.offsetTop && scrollTop < nextAnchor.offsetTop) ||
      (i === anchorList.length - 1 && scrollTop >= anchor.offsetTop)
    ) {
      // 高亮显示对应的导航栏项
      // activeIdx.value = i
      if (!pageNavActive.includes(anchor.id)) {
        pageNavActive.push(anchor.id)
        $trace.traceCustomEvent({
          event: 'page_scroll',
          event_label: anchor.id,
        })
      }
      break
    }
  }
}

/**
 * 点击锚点滚动到对应区域  end
 * */

// 初始化
onMounted(() => {
  nextTick(() => {
    getElOffset()
    showPageNav()
  })
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav id="proNavBarSed" class="pronavBar-wrapper">
    <div class="sec-nav-bar">
      <BaseContainer>
        <div class="pronavBar-box" flex-between py-25>
          <!-- 左侧 -->
          <div class="pronavBar-left">
            <div class="pronavBar-left-box">
              <a :href="logoData.url" class="navbar-logo font-size-0">
                <i :class="logoData.logo"></i>
              </a>
              <span class="font-700" v-html="logoData.title"></span>
            </div>
            <!-- 菜单 -->
            <ul v-if="navList?.length" class="pronavBar-menu-list" flex items-center gap32>
              <li
                v-for="(proItem, proIdx) in navList"
                :key="`menu-item-${proIdx}`"
                class="pronavBar-menu-item title7"
                :class="{
                  active: activeIdx == proIdx,
                }"
                @click="clickMenu(proItem, proIdx)"
                @mouseenter="() => mouseEnterNavMenu(proIdx)"
                @mouseleave="() => mouseLeaveNavMenu(proIdx)"
              >
                <template v-if="proItem.url">
                  <a class="pronavBar-menu-link-a fw-bold" :href="proItem.url" v-html="proItem.label"> </a>
                </template>
                <template v-else>
                  <span
                    v-if="proItem.label"
                    class="pronavBar-menu-link fw-bold"
                    v-html="proItem.label"
                  ></span>
                </template>
                <span v-if="proItem.coupon" class="coupon" v-html="proItem.coupon"></span>
                <NavBarFreeDropMenu v-show="proItem.key === 'free' && activeIdx === 1" />
              </li>
            </ul>
          </div>
          <!-- 右侧 -->
          <div class="pronavBar-right" flex justify-end>
            <!-- 按钮 -->
            <div class="pronavBar-btn-box" flex items-center gap10>
              <template v-for="(btn, btnIdx) in cardData.btnList" :key="`btn-item-${btnIdx}`">
                <template v-if="btn.component === 'MyButtonBuy'">
                  <component
                    :is="btn.component"
                    v-if="btn.info?.href === 'javascript:;'"
                    data-buy-dlg="show"
                    :data-pid="btn.pid"
                    v-bind="{ ...btn.info }"
                  />
                  <template v-else>
                    <component
                      :is="btn.component"
                      v-if="reloadBtnData.value && reloadBtnData.reloadOs[osText]"
                      v-track:click="btn.click"
                      v-track:exposure="btn.exposure"
                      v-bind="{ ...btn.info }"
                    />
                  </template>
                </template>
                <component :is="btn.component" v-else v-bind="{ ...btn.info }" />
              </template>
            </div>
          </div>
        </div>
      </BaseContainer>
    </div>
    <NavBarBasicDropMenu
      v-show="activeIdx === 0"
      @mouseenter="() => mouseEnterNavMenu(0)"
      @mouseleave="() => mouseLeaveNavMenu(0)"
    />
  </nav>
</template>
<style scoped lang="less">
.pronavBar-wrapper {
  background-color: #fff;
  position: relative;
}
.sec-nav-bar {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg, #00a5ea 0, #04c1b4 51%, #40d4a1 74%, #7ce78d 100%);
  }
}
.pronavBar-box {
  flex-direction: row;
  padding: 0;
}

// 菜单 item
.pronavBar-menu-item {
  padding: 16px 0;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  &:last-child {
    .pronavBar-menu-link-a {
      background: linear-gradient(270deg, #10a716 0%, #ffaa14 54%, #ff3636 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }
  }

  .coupon {
    padding: 4px 8px;
    background: #ff3b30;
    border-radius: 14px 14px 14px 0px;
    color: #fff000;
    @apply ml6 inline-block font-size-14;
  }

  &.active,
  &:hover {
    // box-shadow: 0 1px 0 0 @primary-color;
    .pronavBar-menu-link-a,
    .pronavBar-menu-link {
      text-decoration: none;
      color: #00a9f0;
    }
    &:last-child {
      .pronavBar-menu-link-a {
        text-decoration: underline;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 1px;
          background-image: linear-gradient(270deg, #10a716 0%, #ffaa14 54%, #ff3636 100%);
        }
      }
    }
  }

  .pronavBar-menu-link {
    @apply block py-10;
    color: @base-text-color;
  }
}

.pronavBar-btn-box {
  @apply ml-30;
}
.pronavBar-left {
  display: flex;
  white-space: nowrap;
  .pronavBar-left-box {
    @apply flex items-center mr43;
  }
  .title4 {
    text-overflow: ellipsis;
  }
}
</style>
