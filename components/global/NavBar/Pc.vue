<script setup lang="ts">
const { need } = usePromotionData()
const {
  isFixed,
  mainNavData,
  subNavData,
  subNavShow,
  logout,
  elkEventLabel,
  scrollHandler,
  navBarPcDom,
  promotionHeaderDom,
} = useNavBar()
const { isHeaderBannerShow } = usePromotion()
const userVisible = ref(false)

// props 传参
const props = defineProps({
  windowWidth: { type: Number, default: () => 1201 },
})

const activeIdx = ref<number>(-1)
/**
 * 上报相关  start
 * */
const getTrackData = (menu: any, url: string, event_value: string) => {
  // console.log('menu', menu)

  const event_label = menu.event_label || menu.url
  const event_target: any = {
    position: 'main_nav_header',
  }
  if (url) event_target.url = url
  return {
    event: url ? 'click' : 'hover',
    event_label,
    event_value,
    xargs_event_category: 'nav',
    event_target,
  }
}

const reportDatas = async (menu: any, url: string, event_value: string) => {
  const { $trace } = useNuxtApp() as any
  const data = getTrackData(menu, url, event_value)
  await $trace.traceCustomEvent(data)
  if (url) window.location.href = url
}

const reportTrackDatas = async (menu: any) => {
  const { $trace } = useNuxtApp() as any
  const data = {
    event: 'hover',
    event_label: menu?.key?.toLowerCase(),
    event_value: menu?.key?.toLowerCase(),
    event_category: 'nav',
    event_target: { position: 'main_nav_header' },
  }
  await $trace.traceCustomEvent(data)
}

/**
 * 上报相关  end
 * */

//  面板显示逻辑
let timer: any = null
let timerFlag: any = null
const debounce = (fn: any, delay: number) => {
  // 返回一个函数，oninput事件函数
  return function (this: any) {
    // 借助闭包，访问外部函数的变量 timer
    const args: any = arguments
    // const context: any = this
    if (timerFlag !== null) {
      clearTimeout(timerFlag)
    }
    timerFlag = setTimeout(() => {
      // fn.call(this)
      fn.apply(this, args)
    }, delay)
  }
}
const showNavItems = (idx: number, showStatus: string) => {
  // item.style.display = showStatus === 'block' ? 'block' : 'none'
  const navItems = document.getElementsByClassName('nav-item') as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < navItems.length; i++) {
    if (showStatus === 'block' && i === idx) {
      navItems[idx].style.backgroundColor = '#fff'

      const jNavItem = navItems[idx].querySelector('.j_nav_item') as HTMLElement
      if (jNavItem) {
        jNavItem.style.color = '#00a9f0'
      }

      const pcSelectOne = navItems[idx].querySelector('.pc-select-one') as HTMLElement
      if (pcSelectOne) {
        pcSelectOne.style.display = 'block'
      }
    } else {
      navItems[i].style.backgroundColor = ''

      const jNavItem = navItems[i].querySelector('.j_nav_item') as HTMLElement
      if (jNavItem) {
        jNavItem.style.color = '#fff'
      }
      const pcSelectOne = navItems[i].querySelector('.pc-select-one') as HTMLElement
      if (pcSelectOne) {
        pcSelectOne.style.display = 'none'
      }
    }
  }

  // navItems[idx].style.backgroundColor = showStatus === 'block' ? '#fff' : ''
}
const mouseEnterNavMenu = (index: number, length: number) => {
  // 清除任何现有的计时器
  if (timer) {
    clearTimeout(timer)
  }

  // 设置新的计时器
  timer = setTimeout(() => {
    // 如果在这个菜单项上悬停了超过 300 毫秒，那么显示这个菜单项的面板
    activeIdx.value = index
  }, 300)
  // more菜单动画
  if (index === length) {
    const pcSelectBox = document.getElementById('pcSelectBox') as HTMLElement
    const pageSel = document.getElementById('pcSelect') as HTMLElement
    pcSelectBox.style.height = pageSel.offsetHeight + 'px'
  } else {
    const debouncedFunction = debounce(showNavItems, 300)
    debouncedFunction(index, 'block')
  }
}

const mouseLeaveNavMenu = (index: number, length: number) => {
  // 如果鼠标离开了一个菜单项，那么清除计时器
  if (timer) {
    clearTimeout(timer)
  }
  // more菜单动画
  if (index === length) {
    const pcSelectBox = document.getElementById('pcSelectBox') as HTMLElement
    pcSelectBox.style.height = '0'
  } else {
    const debouncedFunction = debounce(showNavItems, 300)
    debouncedFunction(index, 'none')
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

// true 可复购用户
const reBuyUser = computed(() => {
  // 符合复购的老用户: 1,非全线新用户; 2,非全线最新aio用户
  if (useStore.common().mobile) {
    return false
  }

  // 最新 AIO 产品线
  const proLine = ['dvdfab', 'streamfab', 'playerfab', 'unifab', 'musicfab', 'passkey']
  const userTagsObj: any = useStore.common().userTagsRes || {}

  // 默认用户未购买全产品线 AIO
  let isAllNewAioWin = false
  let isAllNewAioMac = false
  // 遍历用户是否全部购买
  let allWinPurchased = true
  let allMacPurchased = true
  for (const line of proLine) {
    if (!userTagsObj[`dynamic_${line}_win_bool_full_option`]) {
      allWinPurchased = false
    }
    if (!userTagsObj[`dynamic_${line}_mac_bool_full_option`]) {
      allMacPurchased = false
    }
    if (!allWinPurchased && !allMacPurchased) {
      break
    }
  }
  isAllNewAioWin = allWinPurchased
  isAllNewAioMac = allMacPurchased

  // 全线新用户 (总授权数 包括 win,mac: common_num_options_count)
  const isNewUser = !userTagsObj?.common_num_options_count

  const result = {
    win: !isNewUser && !isAllNewAioWin,
    mac: !isNewUser && !isAllNewAioMac,
  }

  return result[useStore.common().client] || false
})

// 用户登录信息
const username = computed(() => {
  return useStore.common().user_info.username || decodeURIComponent(useStore.common().user_info.username)
})
const email = computed(() => {
  return useStore.common().user_info.email
})
const token = computed(() => {
  return useStore.common().user_info.token
})
const skeletonLoading = computed(() => {
  return useStore.common().user_info.isInit
})

// 导航按钮数据
const cardData: any = {
  // 两种模式 2 选 1
  // dom 元素消失在视口时，显示二级导航栏
  scrollDomId: 'test',
  pageNavId: 'NavBar',
  // 大于指定滚动高度时，显示二级导航栏
  scrollH: 0,
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

// 获取 dom 元素
const getElOffset = () => {
  // 二级导航
  const proNav = document.getElementById('proNavBarSed') as HTMLElement
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
      id: 'proNavBarSed',
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

const showPageNav = () => {
  const pageNavId = cardData.pageNavId
  const pageNav = document.getElementById(pageNavId) as HTMLElement
  const pageSubNav = document.getElementById('proNavBarSed') as HTMLElement
  const promotionHeader = document.getElementById('promotion-header-banner') as HTMLElement

  // 滚动条滚动距离
  const scrollDist = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  // 大于 scrollY 显示二级导航栏
  const scrollH = cardData.scrollH
  scrollY.value = (scrollDomH.value || scrollH) + pageNavH.value
  navShow.value = scrollDist > scrollY.value
  if (navShow.value && pageNav) {
    // 隐藏活动 header
    if (promotionHeader) {
      promotionHeader.style.display = 'none'
    }

    // 有二级导航
    if (pageSubNav) {
      // 隐藏公共 导航栏
      pageNav.style.display = 'none'
      pageSubNav.classList.add('page-sub-nav-list')
    }

    // 设置二级导航栏高度
    if (domObj.value?.proNav?.dom) {
      const proNav = domObj.value?.proNav?.dom
      const proNavStyle = getEleCptStyle(proNav)
      proNavH.value = proNavStyle?.allH || 0
    }
  } else if (pageNav) {
    // 显示活动 header
    if (isHeaderBannerShow.value && promotionHeader) {
      promotionHeader.style.display = 'block'
    }
    // 显示公共 导航栏
    pageNav.style.display = 'block'
    // 移除二级导航定位
    if (pageSubNav) {
      pageSubNav.classList.remove('page-sub-nav-list')
    }
  }
}

// 初始化
onMounted(() => {
  scrollHandler()
  // autoLogin() // 自动登录
  nextTick(() => {
    getElOffset()
    showPageNav()
  })
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', scrollHandler)
})

// 滚动页面时触发
const handleScroll = () => {
  // 共导航栏显示/隐藏
  showPageNav()
}
</script>

<template>
  <nav
    id="NavBar"
    ref="navBarPcDom"
    class="NavBar-wrapper fixed top-0 left-0 w-full z-99"
    :class="[isFixed ? 'nav-border' : '']"
  >
    <!-- 活动 header -->
    <div ref="promotionHeaderDom">
      <HeaderBanner v-if="need && windowWidth > 1200" class="header-box" />
    </div>
    <!-- 顶部导航栏 -->
    <div class="navbar-box-wrapper main-nav-pc">
      <BaseContainer>
        <div class="navbar-box flex-between w-full">
          <!-- 左侧 -->
          <div class="navbar-left flex items-center">
            <!-- logo -->
            <a
              v-track:click="{
                event: 'click',
                event_label: 'mainpage',
                event_value: 'mainpage',
                event_target: { position: 'main_nav_header' },
                event_category: 'nav',
              }"
              href="/"
              class="navbar-logo font-size-0"
            >
              <i :class="mainNavData?.logo"></i>
            </a>
            <!-- 菜单 -->
            <ul class="navbar-menu flex-between" @mouseleave="mouseLeaveMenuArea">
              <template v-for="(info, idx) in mainNavData?.leftNav">
                <li
                  v-if="info"
                  :key="'nav_l_' + idx"
                  class="nav-item pro-menu-item"
                  :class="[info?.link ? '' : 'j-nav-item-more-li']"
                  @mouseenter="() => mouseEnterNavMenu(idx, mainNavData?.leftNav?.length - 1)"
                  @mouseleave="() => mouseLeaveNavMenu(idx, mainNavData?.leftNav?.length - 1)"
                >
                  <!-- 导航产品线 -->
                  <a
                    v-if="info.link"
                    v-track:click="{
                      event: 'click',
                      event_label: info?.key?.toLowerCase(),
                      event_value: info?.key?.toLowerCase(),
                      event_target: { position: 'main_nav_header' },
                      event_category: 'nav',
                    }"
                    :href="info.link"
                    class="j_nav_item font-bold"
                    @mouseenter="reportTrackDatas(info)"
                    v-html="info?.title"
                  >
                  </a>
                  <!-- more -->
                  <div
                    v-else
                    class="j_nav_item font-bold j_nav_item_more"
                    @mouseenter="reportTrackDatas(info)"
                  >
                    <span v-html="info?.title"></span>
                    <i class="iconfont-sg icon-arrow_caret_down"></i>
                    <i class="iconfont-sg icon-arrow_caret_up"></i>
                  </div>
                  <!-- 下拉菜单 -->
                  <div v-if="info?.items?.length > 1" id="pcSelectBox" class="pc-select-box">
                    <PagesNavbarPcSelect :items="info?.items" />
                  </div>
                  <!-- 描述菜单 -->
                  <PagesNavbarPcSelectOne v-else v-bind="{ ...info?.items[0] }" />
                </li>
              </template>
            </ul>
          </div>
          <!-- 右侧  按钮-->
          <div class="navbar-right flex items-center">
            <!--右侧菜单 -->
            <template v-if="mainNavData?.download">
              <div class="nav-item nav-item-download">
                <a
                  v-track-label="getComponentsName('download')"
                  :href="mainNavData?.download?.url"
                  class="nav-right-a font-bold"
                  @click.prevent="
                    reportDatas(mainNavData, mainNavData?.download?.url, elkEventLabel[mainNavData?.key])
                  "
                  @mouseenter="reportDatas(mainNavData, '', elkEventLabel[mainNavData?.key])"
                >
                  {{ mainNavData?.download?.label }}
                </a>
              </div>
            </template>
            <!-- login 按钮 -->
            <div class="nav-item member-box nav-right-a">
              <!-- 复购折扣 -->
              <el-skeleton v-show="skeletonLoading" :loading="true" animated style="line-height: 0">
                <template #template>
                  <el-skeleton-item
                    variant="text"
                    style="width: 40px; background-color: #00a9f0; height: 40px; border-radius: 40px"
                  />
                </template>
              </el-skeleton>
              <!-- 未登录 -->
              <span v-if="!token" v-show="!skeletonLoading" class="no-login">
                <a
                  v-track-label="getComponentsName('login')"
                  class="font-bold btn login"
                  href="/member.htm?a=login"
                  @click.prevent="
                    reportDatas({}, '/member.htm?a=login', reBuyUser ? 'existing_user' : 'general')
                  "
                  @mouseenter="reportDatas({}, '', reBuyUser ? 'existing_user' : 'general')"
                >
                  <span class="login-text font-size-16">{{ mainNavData?.login }}</span>
                </a>
              </span>
              <!-- 已登录 -->
              <div
                v-show="!skeletonLoading"
                v-else
                v-track:hover="{
                  event: 'hover',
                  event_label: 'member',
                  event_value: reBuyUser ? 'existing_user' : 'general',
                  event_category: 'nav',
                  event_target: { position: 'main_nav_header' },
                }"
                v-track:click="{
                  event: 'click',
                  event_label: 'member',
                  event_value: reBuyUser ? 'existing_user' : 'general',
                  event_category: 'nav',
                  event_target: { position: 'main_nav_header' },
                }"
                class="user-info-con rebuy-user"
                @mouseenter="userVisible = true"
                @mouseleave="userVisible = false"
              >
                <!-- 用户名称 + member -->
                <a href="/member.htm?a=dashboard" class="user-name font-bold">
                  <span
                    class="name"
                    v-html="username?.substring(0, 1)?.toUpperCase() || email?.substring(0, 1)?.toUpperCase()"
                  ></span>
                  <!-- <span class="member-txt" v-html="mainNavData?.member"></span> -->
                </a>
                <!-- member 面板 -->
                <div v-if="userVisible" class="user-content">
                  <div class="infos">
                    <span v-if="username" class="name font-bold" v-html="username"></span>
                    <span v-if="email" class="my-desc-p email" v-html="email"></span>
                  </div>
                  <ul class="links my-member-links">
                    <li>
                      <a
                        href="/member.htm?a=dashboard"
                        @click.prevent="reportDatas({}, '/member.htm?a=dashboard', 'dashboard')"
                      >
                        <i class="iconfont-sg icon-dashboard_n"></i>
                        <span v-html="mainNavData?.dashboard"></span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/member.htm?a=get_support"
                        @click.prevent="reportDatas({}, '/member.htm?a=get_support', 'dashboard')"
                      >
                        <i class="iconfont-sg icon-get-support-n"></i>
                        <span v-html="mainNavData?.getSupport"></span>
                      </a>
                    </li>
                    <li>
                      <a
                        v-track:click="{
                          event: 'click',
                          xargs_event_category: 'get_email',
                          xargs_url_type_item: 'login',
                          xargs_login_status: false,
                        }"
                        @click.prevent="logout(token)"
                      >
                        <i class="iconfont-sg icon-exit"></i>
                        <span v-if="mainNavData?.logout" v-html="mainNavData?.logout"></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <span v-if="reBuyUser" class="nav_off_tag icon_nav_off_tag"></span>
            </div>
          </div>
        </div>
      </BaseContainer>
    </div>
  </nav>
  <template v-if="subNavData && subNavShow">
    <NavBarSubPc class="sub-pc-nav" v-bind="{ ...subNavData }" />
  </template>
</template>
<!-- 全局样式 -->
<style lang="less">
.pc-select-one {
  display: none;
}
.pc-select-box {
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
  position: absolute;
  top: 72px;
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
}
.nav-item {
  // &:hover {
  //   .pc-select-one {
  //     display: block;
  //   }
  // }
  &:last-child:hover {
    // .pc-select-one {
    //   display: none;
    // }
    .pc-select {
      opacity: 1;
    }
  }
}
.my-desc-p {
  color: #909090;
  font-size: 14px;
}
.main-nav-pc,
.sub-pc-nav {
  a[href^='/'] {
    color: @base-text-color;
  }
}
</style>

<style scoped lang="less">
.navbar-box-wrapper {
  position: relative;
  z-index: 99;
}
.header-box {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.tips_icon {
  vertical-align: middle;
  margin-right: 10px;
}

.NavBar-wrapper {
  background: #282b2c;

  &.nav-border {
    z-index: 99;

    &:after {
      //content: '';
      //position: absolute;
      //left: 0;
      //bottom: -1px;
      //width: 100%;
      //height: 1px;
      // background-image: linear-gradient(0deg, #00a5ea 0, #04c1b4 51%, #40d4a1 74%, #7ce78d 100%);
    }
  }
}

.btn &.transition::before,
&:not(.border, .border-blue, .transition)::before {
  width: 0;
  height: 0;
}
.nav_r_0,
.no-login {
  &:hover {
    text-decoration: underline;
  }
}

.navbar-box {
  position: relative;
  z-index: 98;
  height: @nav-height;
  color: #fff;
}
// pageNavContent
.new-min-nav-bottom {
  display: none;
}

.show-nav-list {
  padding: 20px 20px 30px 0;

  .new-min-nav-box {
    display: none;
  }
}

.pnc-bottom-box {
  line-height: 1;
  margin: 21px 20px;
  border-top: 1px solid #ecf2f3;
  padding-top: 25px;

  .pnc-txt {
    margin-bottom: 30px;

    color: #3333;
    white-space: normal;
    line-height: 1.5em;
  }

  .pnx-more {
    color: @primary-text-color !important;
    text-decoration: underline;
    cursor: pointer;
  }
}

.stream-bottom-box {
  color: @primary-text-color;
  font-size: @font-size-sm;
}
// 整体布局
.navbar-left,
.navbar-right {
  gap: 30px;
}

.NavBar-wrapper {
  .j_nav_item {
    padding: 0 16px;
    color: #fff;
  }

  .j-nav-item-more-li {
    .icon-arrow_caret_down {
      display: block;
    }
    .icon-arrow_caret_up {
      display: none;
    }
    i {
      @apply ml4;
      font-size: 12px;
    }
    &:hover {
      span,
      i {
        color: @base-text-color;
      }
      .icon-arrow_caret_down {
        display: none;
      }
      .icon-arrow_caret_up {
        display: block;
      }
    }
  }
  .j_nav_item_more {
    @apply flex-center;
  }

  .navbar-menu {
    position: relative;
    width: 100%;
    height: 100%;
    .j-nav-item-more-li {
      &:hover {
        background-color: #fff;
      }
    }
    .nav-item {
      // &:hover {
      //   background-color: #fff;
      // }
    }
  }

  .member-box {
    display: flex;
    align-items: center;
    white-space: nowrap;

    .user-info-con {
      color: #fff;
      position: relative;
      display: flex;
      height: 100%;
      align-items: center;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -20px;
        width: 100%;
        height: 20px;
      }

      .user-name {
        display: flex;
        align-items: center;

        .name {
          background: @primary-text-color;
          width: 40px;
          height: 40px;
          padding: 4px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          font-size: 20px;
          justify-content: center;
        }

        .member-txt {
          margin-left: 12px;
        }
      }
    }
    .user-content {
      position: absolute;
      color: #333;
      top: 48px;
      right: 0;
      padding: 12px 8px;
      width: 230px;
      background: #ffffff;
      box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
      border-radius: 12px;

      .infos {
        border-bottom: 1px solid #e4eaeb;
        border-radius: 4px 4px 0 0;
        padding: 0 8px 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;

        > span {
          height: 20px;
          display: block;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .name {
          height: 24px;
          color: #4d5b66;
          font-size: 16px;
        }
      }

      .links {
        padding: 8px 0 0;

        li {
          height: 38px;
          line-height: 38px;
          padding: 0 8px;
          cursor: pointer;

          a {
            display: flex;
            align-items: center;
            // color: @base-text-color;

            i {
              @apply font-size-20;
              margin-right: 10px;
            }
          }

          &:hover {
            background: #f1fafd;
            border-radius: 4px;

            a {
              color: @primary-text-color;
            }
          }
        }
      }
      .my-member-links {
        a {
          color: @base-text-color;
        }
      }
    }

    a.btn {
      display: flex;
      // min-width: 170px;
      height: 40px;

      border-radius: 24px;
      align-items: center;
      justify-content: center;
      position: relative;

      > i {
        display: inline-block;
        margin-right: 12px;
        width: 20px;
        height: 20px;
      }

      &.login {
        // background-color: @primary-text-color;
        color: #fff;
        padding: 0;
      }

      &.account {
        background-color: #fff;
        color: @primary-text-color;
      }
    }

    .nav_off_tag {
      margin-left: -10px;
      position: relative;
    }

    .user-info-con {
      &.rebuy-user {
        .user-name {
          position: relative;
          // min-width: 38px;
          // height: 38px;
          color: #fff;
          background: @primary-text-color;
          display: inline-flex;
          align-items: center;

          border-radius: 30px;

          .name {
            width: 40px;
            height: 40px;
            color: #fff;
            background: @primary-text-color;
          }
        }
      }

      .login-text {
        margin-right: 20px;
      }
    }
  }
  .nav-item-download {
    &:hover {
      .nav-right-a {
        text-decoration: underline;
      }
    }
  }

  .nav-item {
    position: relative;

    &:hover {
      .j_nav_item {
        // color: @primary-text-color;
      }
      .j_nav_item_more {
        color: @primary-text-color;
      }
    }

    .j_nav_item {
      cursor: pointer;
      height: 100%;
      line-height: @nav-height;
      white-space: nowrap;
    }

    a.j_nav_item i {
      vertical-align: middle;
      margin-right: 5px;
      color: @primary-text-color;
    }

    .nav-sub-title {
      width: 100%;
      line-height: 40px;
      padding-left: 20px;
      height: 40px;
    }

    a {
      display: block;
      // color: #fff;
    }
    .nav-right-a {
      color: #fff;
    }
  }

  .login-desc {
    .user-info-con {
      margin-left: 20px;

      .btn.login {
        padding-left: 4px;
      }
    }

    .btn.login {
      background: linear-gradient(270deg, #f5624d 0%, #f9ba33 100%);
      border: 0 none;
      display: inline-flex;
      align-items: center;

      > span {
        width: 36px;
        height: 36px;
        background: #ffffff;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ff9000;
        font-size: 20px;
        margin-right: 10px;
      }
    }

    &:hover {
      .btn.login {
        background: linear-gradient(270deg, #f5624d 0%, #f9ba33 100%);
        box-shadow: 0px 8px 16px 0px rgba(245, 98, 77, 0.5);
      }
    }

    .add-view {
      padding: 0 10px;
      border-radius: 40px;
      background: linear-gradient(270deg, #f5624d 0%, #f9ba33 100%);
      color: #fff;
      margin-left: 8px;
      line-height: 32px;
    }
  }
}

.NavBar-wrapper .nav-item {
  .pro-box:hover .pro-title {
    color: @primary-text-color;
  }
}

.NavBar-wrapper .login-desc.small-screen {
  a.btn {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;

    i {
      margin-right: 0;
    }
  }
}
</style>
