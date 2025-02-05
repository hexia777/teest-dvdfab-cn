<script setup lang="ts">
// 二级导航数据
interface SubNavData {
  product?: {
    label: string
    bundleInfo: any[]
    pcBundleList: any[]
    mobileBundleList: any[]
    subList: any[]
    bottomInfo: any
  }
  free?: any
  faqs?: any
  promotion?: any
  logoLink: string
  logo: string
  logo_title: string
  product_rels?: any
  productLine?: string
}
const props = defineProps({
  logo: {
    type: String,
    default: '',
  },
  logoLink: {
    type: String,
    default: '',
  },
  logo_title: {
    type: String,
    default: '',
  },
  productLine: {
    type: String,
    default: '',
  },
  free: {
    type: Object,
    default: () => {},
  },
  faqs: {
    type: Object,
    default: () => {},
  },
  product: {
    type: Object,
    default: () => {},
  },
  promotion: {
    type: Object,
    default: () => {},
  },
  product_rels: {
    type: Object,
    default: () => {},
  },
})

const { BtnList, reloadBtnData } = useNavBarBtnList()
const { subNavData } = useNavBar()
const navData = computed(() => subNavData.value as SubNavData)
const getElkData = (event_label: string = 'mainpage', event_value: string = 'mainpage') => {
  return {
    event: 'click',
    event_category: 'nav',
    event_label,
    event_value,
    event_target: {
      position: navData.value.productLine + '_nav_header',
    },
  }
}
// navList数据处理
const navList = [
  {
    label: props.product?.label,
    key: 'product',
    url: '',
    coupon: '',
    elkParams: getElkData('products', 'products'),
  },
]
if (props.free?.label) {
  navList.push({
    label: props.free?.label,
    key: 'free',
    url: '',
    coupon: '',
    elkParams: getElkData('free', 'free'),
  })
}
if (props.faqs?.label) {
  navList.push({
    label: props.faqs?.label,
    key: 'faqs',
    url: props.faqs?.url,
    coupon: '',
    elkParams: getElkData('faqs', 'faqs'),
  })
}
if (props.promotion?.label) {
  navList.push({
    label: props.promotion?.label,
    url: props.promotion?.link,
    coupon: props.promotion?.off,
    key: 'promotion',
    elkParams: getElkData('promotion', 'promotion'),
  })
}
const promotionImg = getStrapiData(props.promotion?.media)?.data[0]?.attributes

const osText = useOs().value

// 设置高亮, 上报
const activeIdx = ref<number>(-1)
const { $trace } = useNuxtApp() as any

//  面板显示逻辑
let timer: any = null
const mouseEnterNavMenu = (index: number, elkparams: {}) => {
  // 清除任何现有的计时器
  if (timer) {
    clearTimeout(timer)
  }

  // 设置新的计时器
  timer = setTimeout(() => {
    // 如果在这个菜单项上悬停了超过 300 毫秒，那么显示这个菜单项的面板
    activeIdx.value = index
    // 只有显示该菜单才能做elk上发送事件,防止无效的hover事件上报
    if (elkparams && Object.keys(elkparams).length > 0) {
      $trace.traceCustomEvent({
        ...elkparams,
        event: 'hover',
      })
    }
  }, 300)
}

const mouseLeaveNavMenu = (index: number, obj: object) => {
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
  } else {
    activeIdx.value = -1
  }
}
const hiddenPanelHandle = (idx: number) => {
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
</script>

<template>
  <nav id="proNavBarSed" class="pronavBar-wrapper">
    <div
      class="sec-nav-bar"
      :class="['theme-nav-' + (['musicfab'].includes(productLine) ? 'musicfab' : 'dvdfab')]"
    >
      <BaseContainer>
        <div class="pronavBar-box" flex-between py-25>
          <!-- 左侧 -->
          <div class="pronavBar-left">
            <div class="pronavBar-left-box">
              <a v-track:click="getElkData()" :href="logoLink" class="my-navbar-logo">
                <i :class="logo"></i>
                <span class="font-700 logo-title" v-html="logo_title"></span>
              </a>
            </div>
            <!-- 菜单 -->
            <ul v-if="navList?.length" class="pronavBar-menu-list" flex items-center gap32>
              <template v-for="(proItem, proIdx) in navList" :key="`menu-item-${proIdx}`">
                <li
                  v-if="proItem.label"
                  v-track:click="proItem.elkParams"
                  class="pronavBar-menu-item title7"
                  :class="{
                    active: activeIdx == proIdx && proItem?.key !== 'faqs',
                    active_faqs: proItem?.key === 'faqs',
                  }"
                  @mouseenter.capture.self="() => mouseEnterNavMenu(proIdx, proItem.elkParams)"
                  @mouseleave="() => mouseLeaveNavMenu(proIdx)"
                >
                  <template v-if="proItem.url">
                    <a
                      :class="[
                        proItem?.key === 'promotion'
                          ? 'promotion-menu-style font-800'
                          : 'pronavBar-menu-link-a font-500',
                      ]"
                      :href="proItem.url"
                      :target="productLine === 'unifab' && proItem.key === 'promotion' ? '_blank' : '_self'"
                      v-html="proItem.label"
                    >
                    </a>
                  </template>
                  <template v-else>
                    <span
                      v-if="proItem.label"
                      class="pronavBar-menu-link font-500"
                      v-html="proItem.label"
                    ></span>
                  </template>
                  <a
                    v-if="proItem.coupon"
                    class="promotion-menu-coupon"
                    :href="proItem.url"
                    :target="productLine === 'unifab' ? '_blank' : '_self'"
                  >
                    <span v-html="proItem.coupon"></span>
                    <my-img
                      v-if="promotionImg && promotionImg?.url"
                      class="promotion-menu-coupon-icon"
                      :src="promotionImg?.url"
                      :width="promotionImg?.width"
                      :height="promotionImg?.height"
                      :alt="promotion?.mediaAlt"
                    />
                  </a>

                  <!-- free -->
                  <template v-if="proItem.key === 'free' && activeIdx === 1">
                    <div v-for="freeItem in free?.items" :key="freeItem.id" class="free-box">
                      <PagesNavbarFreeDropMenu
                        v-track:click="getElkData('free', freeItem.title.toLowerCase().replace(/\s+/g, '_'))"
                        v-bind="{ ...freeItem }"
                      />
                    </div>
                  </template>
                </li>
              </template>
            </ul>
          </div>
          <!-- 右侧 -->
          <div class="pronavBar-right" flex justify-end>
            <div class="pronavBar-btn-box" flex items-center gap10>
              <template v-for="(btn, btnIdx) in BtnList" :key="`btn-item-${btnIdx}`">
                <template v-if="btn.component === 'MyButtonBuy'">
                  <component
                    :is="btn.component"
                    v-if="btn.info?.href === 'javascript:;'"
                    v-track:click="btn.click"
                    data-buy-dlg="show"
                    :data-pid="btn.pid"
                    :data-pname="btn.pname"
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
    <div v-show="activeIdx === 0" class="pc-nav-menu">
      <PagesNavbarBasicDropMenu
        :info="product"
        :product-line="productLine"
        @hiddenPanelHandle="hiddenPanelHandle"
        @mouseenter="() => mouseEnterNavMenu(0)"
        @mouseleave="() => mouseLeaveNavMenu(0)"
      />
    </div>
  </nav>
</template>
<style scoped lang="less">
.pc-nav-menu {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: rgba(0, 0, 0, 0.6);
  z-index: 98;
  margin-top: 1px;
  transition: all 0.5s;
}
.page-sub-nav-list {
  position: fixed !important;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
}
.pronavBar-right {
  padding: 16px 0;
}
.pronavBar-wrapper {
  background-color: #fff;
  position: relative;
}
.my-navbar-logo {
  @apply flex-center;
  margin-left: -5px;
  i {
    scale: (32/44);
  }
}
.sec-nav-bar {
  position: relative;
  z-index: 3;
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

  &.active,
  &:hover {
    // box-shadow: 0 1px 0 0 @primary-color;
    .pronavBar-menu-link-a,
    .pronavBar-menu-link {
      text-decoration: none;
      // color: #00a9f0;
    }
  }

  .pronavBar-menu-link {
    @apply block py-10;
  }
}
.active_faqs {
  &:hover {
    .pronavBar-menu-link-a {
      color: #00a9f0;
    }
  }
}
.theme-nav-musicfab {
  .active_faqs {
    &:hover {
      .pronavBar-menu-link-a {
        color: @text-mf-nav-color;
      }
    }
  }
}

.pronavBar-btn-box {
  @apply ml-30;
}
.pronavBar-left {
  display: flex;
  white-space: nowrap;
  .pronavBar-left-box {
    @apply flex items-center w160;
  }
  .title4 {
    text-overflow: ellipsis;
  }
}
.free-box {
  background: #ffffff;
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
  border-radius: 0px 0px 12px 12px;
  padding: 12px;
  min-width: 273px;
  position: absolute;
  z-index: 1;
  transform: translate(0, 17px);
}
</style>
