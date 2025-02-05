<script setup lang="ts">
// 主导航
defineOptions({ name: 'NavBarMobile' })
const { need } = usePromotionData()
const { showHide } = useNavBarMobile()
const { locales, isFixed, scrollHandler, navBarMobileDom, promotionHeaderDom, mainNavData, subNavShow } =
  useNavBar()
// props 传参
const props = defineProps({
  windowWidth: { type: Number, default: () => 0 },
})

interface NavData {
  leftNav?: [
    {
      title: string
      items: any[]
      link: string
      mobileShowDetail?: any
      id: string | number
    },
  ]
  download?: {
    url: string
    label: string
  }
}
const navData = computed(() => mainNavData.value as NavData)

// 菜单开关
const navToggle = ref(false)
const clickNavToggle = (flag: boolean) => {
  navToggle.value = flag

  if (navToggle.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 初始化
let token = ''
const elkNavMain = 'main_nav_header'
onMounted(() => {
  scrollHandler()
  token = useCookie('laravel_session').value || ''
  window.addEventListener('scroll', scrollHandler)
})
</script>

<template>
  <nav
    ref="navBarMobileDom"
    class="NavBar-wrapper fixed top-0 left-0 right-0 white z-100 flex flex-col"
    :class="[navToggle ? 'open-menu' : '']"
  >
    <div class="head-wrap">
      <!-- 活动 header -->
      <div ref="promotionHeaderDom">
        <HeaderBanner v-if="need && windowWidth <= 1200" />
      </div>
      <BaseContainer class="navbar-container" :class="[isFixed || navToggle ? 'nav-border' : '']">
        <!-- header -->
        <div class="navbar-box flex-between w-full">
          <div class="navbarm-left flex items-center gap25">
            <!-- logo -->
            <a v-track-label="getComponentsName('index')" href="/" class="navbar-logo font-size-0">
              <i class="dvdfab_main_nav_logo logo"></i>
            </a>
          </div>
          <div class="navbarm-right flex items-center gap20">
            <!-- 菜单开关 -->
            <i
              v-show="!navToggle"
              class="iconfont-sg icon-mobile-menu m_menu"
              role="tabpanel"
              @click="clickNavToggle(true)"
            ></i>
            <i
              v-show="navToggle"
              class="iconfont-sg icon-menu-close menu_close"
              role="tabpanel"
              @click="clickNavToggle(false)"
            ></i>
          </div>
        </div>
        <!-- 二级导航 -->
        <nav-bar-sub-mobile v-if="subNavShow" />
      </BaseContainer>
    </div>

    <!-- 菜单面板 -->
    <transition name="moveL">
      <div v-show="navToggle" class="navbar-menu">
        <ul v-if="navData.leftNav && navData.leftNav.length > 0" class="menu-list-box">
          <li v-for="(item, idx) in navData.leftNav" :key="item.id">
            <div
              v-if="item.items.length && !item.link"
              class="first-menu-item"
              @click.prevent="showHide('itemPId', item, idx)"
            >
              <span v-html="item.title"></span>
              <span class="icon">
                <i
                  :class="[
                    'iconfont-sg icon-expand',
                    item.mobileShowDetail == 0 ? 'icon-menu-expand' : 'icon-menu-unexpand',
                  ]"
                ></i>
              </span>
            </div>

            <!-- 子菜单 -->
            <div
              :id="'itemPId' + idx"
              class="sub-box"
              :class="{ 'more-box': item.items.length && !item.link }"
            >
              <ul class="sub-menu-list-box">
                <li v-for="subItem in item.items" :key="subItem.id">
                  <a
                    v-track:click="{
                      event: 'click',
                      event_label: subItem.title.toLowerCase(),
                      event_value: subItem.title.toLowerCase(),
                      event_category: 'nav',
                      event_target: { position: elkNavMain },
                    }"
                    class="sub-item-a"
                    :href="subItem.link || item.link"
                  >
                    <i :class="subItem.icon"></i>
                    <div class="content">
                      <div class="fw-bold" v-html="subItem.title"></div>
                      <div class="desc" v-html="subItem.desc"></div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <!-- 下载 -->
          <li v-if="navData.download">
            <a
              v-track:click="{
                event: 'click',
                event_label: 'download',
                event_value: 'download',
                xargs_event_category: 'nav',
                event_target: { position: elkNavMain },
              }"
              class="first-menu-item"
              :href="navData.download.url"
            >
              <span v-html="navData.download.label"></span>
            </a>
          </li>
        </ul>

        <!-- 登录按钮 -->
        <div class="login-btn-box">
          <a v-track-label="getComponentsName('member')" href="/member.htm" class="btn nav-btn fw-bold">
            <template v-if="token">
              {{ locales.common.member_center }}
            </template>
            <template v-else>
              {{ locales.common.login }}
            </template>
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style lang="less" scoped>
.sub-box {
  overflow: hidden;
  transition: all 0.5s;
}
.menu-list-box {
  background: #3a3c3d;
  color: #fff;
  padding-top: 8px;

  .first-menu-item {
    height: 52px;
    align-items: center;
    padding: 0 20px;
    padding-left: 18px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #4c4d4f;
    margin-top: 8px;
    color: #fff;
    .icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .sub-menu-list-box {
    li {
      padding: 8px 19px;
      .sub-item-a {
        display: flex;
        font-size: 14px;
        > i {
          scale: 0.84;
        }
        .content {
          padding-left: 10px;
          flex: 1;
          color: #fff;
          .desc {
            font-size: 12px;
            color: #c0c0c0;
          }
        }
      }
    }
  }
  .more-box {
    height: 0;
    .sub-menu-list-box li {
      padding: 8px 27px;
    }
  }
}

.login-btn-box {
  border-top: 1px solid #4c4d4f;
  padding: 16px 20px;
  background: #3a3c3d;
}
.nav-btn {
  display: block;
  height: 52px;
  font-size: 16px;
  line-height: 52px;
  color: #fff;
  text-align: center;
  background-color: #00a9f0;
  border-radius: 100px;
}
</style>
<style scoped lang="less">
.NavBar-wrapper {
  &.open-menu {
    overflow: auto;
    bottom: 0;
  }

  .navbar-container {
    position: relative;
    background: #282b2c;
    padding-left: 5px;
    padding-right: 15px;
    height: @nav-height;

    &.nav-border {
      z-index: 99;
      .NavBar-wrapper-sub::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(0deg, #00a5ea 0, #04c1b4 51%, #40d4a1 74%, #7ce78d 100%);
      }
    }
  }

  // 整体布局
  // 导航条
  .navbar-box {
    position: relative;
    z-index: 98;
    background: #282b2c;
    height: 100%;
  }

  // 菜单面板
  .navbar-menu {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - @nav-height);
    overflow: auto;
    padding: 10px 0 50px;
    background: rgba(0, 0, 0, 0.4);
    padding-top: 0;
    z-index: 99;
  }
}

/** amp 里面 移动端导航使用 */
div[class*='sidebar-mask'] {
  display: none;
}

.NavBar-wrapper {
  .icon-expand,
  .m_menu,
  .menu_close {
    color: #fff;
    font-size: 28px;
    cursor: pointer;
  }
  .icon-expand {
    font-size: 20px;
  }
  .logo {
    transform: scale(0.7272);
  }
}
</style>
