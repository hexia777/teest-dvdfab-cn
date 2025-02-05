<script setup lang="ts">
defineOptions({ name: 'ProNavBarMobile' })
interface ProItem {
  hide?: boolean
  event_label?: string
  href: string
  label: string
}

// props 传参
const props = defineProps({
  cardData: {
    type: Object,
    default: () => ({
      // 两种模式 2 选 1
      // dom 元素消失在视口时，显示二级导航栏
      scrollDomId: 'test',
      pageNavId: 'NavBar',
      // 大于指定滚动高度时，显示二级导航栏
      scrollH: 0,
    }),
  },
  navList: {
    type: Array as PropType<ProItem[]>,
    default: () => [],
  },
})

/**
 * 点击锚点  start
 * */
// 设置高亮, 上报
const activeIdx = ref<number>(0)
const clickMenu = (menu: any, index: number) => {
  activeIdx.value = index
  reportDatas(menu, menu.href)
  // 页面滚动
  const target = document.getElementById(menu.id) as HTMLElement
  if (target) {
    document.documentElement.scrollTop = target?.offsetTop - 50
  } else {
    document.documentElement.scrollTop = 0
  }
}

/**
 * 点击锚点  end
 * */

/**
 * 上报相关  start
 * */
const getTrackData = (menu: any, url: string) => {
  const event_label = menu.event_label || menu.url
  const event_target: any = {
    position: 'pro_nav_header_mobile',
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
 * 上报相关  end
 * */

/**
 * 导航显示相关  start
 * */
// 是否显示导航栏
const navShow = ref<boolean>(true)
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
  const pageNavId = props.cardData.pageNavId
  const pageNav = document.getElementById(pageNavId) as HTMLElement
  pageNavOffTop.value = pageNav?.offsetTop || 0
  pageNavOffH.value = pageNav?.offsetHeight

  if (pageNav) {
    const pageNavStyle = getEleCptStyle(pageNav)
    pageNavH.value = pageNavStyle?.allH || 0
  }

  // banner
  const scrollDomId = props.cardData.scrollDomId
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
const clcAnchorPositon = () => {
  // 滚动条实际滚动距离
  const scrollDist = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const anchorList = domObj.value?.anchor
  // 二级导航高度
  const extraDist = domObj.value?.proNav?.proNavH || 94
  const scrollTop = scrollDist + extraDist

  for (let i = 0; i < anchorList?.length; i++) {
    const anchor = anchorList[i]
    const nextAnchor = anchorList[i + 1]

    // 判断滚动条是否在当前区间内
    if (
      (nextAnchor && scrollTop >= anchor.offsetTop && scrollTop < nextAnchor.offsetTop) ||
      (i === anchorList.length - 1 && scrollTop >= anchor.offsetTop)
    ) {
      // 高亮显示对应的导航栏项
      activeIdx.value = i
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
  })
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav id="proNavBar" class="pronavBar-wrapper w-full">
    <BaseContainer>
      <div class="pronavBar-box" flex-center py-25 flex-wrap>
        <!-- 菜单 -->
        <ul v-if="navList?.length" class="pronavBar-menu-list" flex items-center gap40>
          <template v-for="(proItem, proIdx) in navList" :key="`menu-item-${proIdx}`">
            <li
              v-if="!proItem.hide"
              class="pronavBar-menu-item title7"
              :class="[activeIdx == proIdx ? 'active' : '', proItem.event_label]"
              @click="clickMenu(proItem, proIdx)"
            >
              <a class="pronavBar-menu-link fw-bold" v-html="proItem.label"></a>
            </li>
          </template>
        </ul>
      </div>
    </BaseContainer>
  </nav>
</template>
<style scoped lang="less">
.pronavBar-wrapper {
  background-color: @bg-gray2;
}

// 菜单 item
.pronavBar-menu-item {
  position: relative;

  &:first-child {
    &::before {
      @apply w0;
    }
  }

  &::before {
    content: '';
    background: #c7c7c7;
    @apply absolute w1 h16 left--20 top-50\%;
    transform: translate(0, -50%);
  }

  &:hover,
  &.active {
    border-bottom: 1px solid @primary-color;

    .pronavBar-menu-link {
      text-decoration: none;
      color: @primary-color;
    }
  }

  .pronavBar-menu-link {
    @apply block py-10;
    color: @base-text-color;
  }

  @media (max-width: @screen-xs) {
    &.features {
      display: none;
    }
  }
}
</style>
