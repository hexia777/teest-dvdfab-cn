<script setup lang="ts">
// 二级导航
defineOptions({ name: 'NavBarMobileSub' })
const { showHide } = useNavBarMobile()
const { isFixed, handProTag, handProLink } = useNavBar()
const { BtnList, reloadBtnData } = useNavBarBtnList()
const osText = useOs().value
const commonJson = useI18n().value.common

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

// 二级导航数据
interface SubNavData {
  product?: {
    label: string
    bundleInfo: any[]
    pcBundleList: any[]
    mobileBundleList: any[]
    subList: any[]
    bottomInfo: any
    mobileShowDetail?: number
    mobileBundleTitle?: string
    pcBundleTitle?: string
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
const { subNavData } = useNavBar()
const navData = computed(() => subNavData.value as SubNavData)

const getElkData = (event_label: string = 'mainpage', event_value: string = 'mainpage') => {
  return {
    event: 'click',
    event_category: 'nav',
    event_label,
    event_value,
    event_target: {
      position: navData.value?.productLine + '_nav_header',
    },
  }
}
</script>

<template>
  <nav
    class="NavBar-wrapper-sub fixed left-0 right-0 white z-99 flex flex-col"
    :class="[
      navToggle ? 'open-menu-1' : '',
      'theme-nav-' + (navData.productLine === 'musicfab' ? 'musicfab' : 'dvdfab'),
    ]"
  >
    <BaseContainer class="navbar-container" :class="[isFixed || navToggle ? 'nav-border' : '']">
      <!-- header -->
      <div class="navbar-box flex-between w-full">
        <div class="navbarm-left">
          <!-- logo -->
          <a v-track:click="getElkData()" class="navbarm-left flex items-center" :href="navData.logoLink">
            <i class="logo" :class="navData.logo"></i>
            <span class="fw-bold">{{ navData.logo_title }}</span>
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
    </BaseContainer>

    <!-- 菜单面板 -->
    <transition name="moveL">
      <div v-show="navToggle" class="navbar-menu">
        <ul class="menu-list-box">
          <!-- products -->
          <li v-if="navData.product">
            <div
              class="first-menu-item justify-between"
              @click.prevent="showHide('subItemPId', navData.product, 0)"
            >
              <span v-html="navData.product.label"></span>
              <span class="icon">
                <i
                  :class="[
                    'iconfont-sg icon-expand',
                    navData.product.mobileShowDetail == 0 ? 'icon-menu-expand' : 'icon-menu-unexpand',
                  ]"
                ></i>
              </span>
            </div>

            <!-- 菜单展开 -->
            <div
              id="subItemPId0"
              class="sub-box"
              :class="{ 'height-0': navData.product.mobileShowDetail == 0 }"
            >
              <!-- all-in-one信息 -->
              <!-- 单个bundle -->
              <template v-if="navData.product.bundleInfo.length > 0">
                <div v-for="item in navData.product.bundleInfo" :key="item.id" class="product-box">
                  <div class="product-items bg-normal" :class="item.class">
                    <div class="tit fw-bold inline-flex justify-items-center">
                      <span v-html="item.title"></span>
                      <span
                        v-if="item.off"
                        class="nav-tag-off"
                        :class="item.offClass"
                        v-html="item.off"
                      ></span>
                    </div>
                    <div class="desc" v-html="item.desc"></div>
                    <a
                      v-track:click="
                        getElkData(
                          'products',
                          item.title.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_'),
                        )
                      "
                      class="btn-more btn normal border"
                      :href="item.link"
                      v-html="commonJson.learn_more"
                    ></a>
                  </div>
                </div>
              </template>

              <!-- 多个bundle -->
              <template v-else>
                <!-- pc -->
                <div v-if="navData.product.pcBundleList.length > 0" class="product-box">
                  <div class="title fw-bold" v-html="navData.product.pcBundleTitle"></div>
                  <a
                    v-for="item in navData.product.pcBundleList"
                    :key="item.id"
                    v-track:click="
                      getElkData('products', item.title.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_'))
                    "
                    :href="item.link"
                    class="product-items bg-normal"
                    :class="item.class"
                  >
                    <div class="tit fw-bold inline-flex justify-items-center">
                      <span v-html="item.title"></span>
                      <span
                        v-if="item.off"
                        class="nav-tag-off"
                        :class="item.offClass"
                        v-html="item.off"
                      ></span>
                    </div>

                    <div class="desc" v-html="item.desc"></div>
                  </a>
                </div>
                <!-- mobile -->
                <div v-if="navData.product.mobileBundleList.length > 0" class="product-box">
                  <div class="title fw-bold" v-html="navData.product.mobileBundleTitle"></div>
                  <a
                    v-for="item in navData.product.mobileBundleList"
                    :key="item.id"
                    v-track:click="getElkData('products', item.title.toLowerCase().replace(/\s+/g, '_'))"
                    :href="item.link"
                    class="product-items bg-normal"
                    :class="item.class"
                  >
                    <div class="tit fw-bold inline-flex justify-items-center">
                      <span v-html="item.title"></span>
                      <span
                        v-if="item.off"
                        class="nav-tag-off"
                        :class="item.offClass"
                        v-html="item.off"
                      ></span>
                    </div>
                    <div class="desc" v-html="item.desc"></div>
                  </a>
                </div>
              </template>

              <!-- 分割线 -->
              <div class="divider"></div>

              <!-- 产品列表 -->
              <div v-for="item in navData.product.subList" :key="item.id" class="product-list">
                <div class="title fw-bold" v-html="item.title"></div>
                <div v-for="subItem in item.products.data" :key="subItem.id" class="list-items">
                  <a
                    v-track:click="
                      getElkData('products', subItem.attributes.shortName.toLowerCase().replace(/\s+/g, '_'))
                    "
                    class="tit"
                    :href="handProLink(getStrapiData(subItem))"
                    v-html="subItem.attributes.shortName"
                  ></a>
                  <span
                    v-if="handProTag(getStrapiData(subItem))?.tag"
                    :class="[
                      handProTag(getStrapiData(subItem))?.tag
                        ? 'nav-tag-' + handProTag(getStrapiData(subItem)).tag.toLowerCase()
                        : '',
                    ]"
                    v-html="subItem.attributes.product_attrs.data[0]?.attributes?.name"
                  ></span>
                </div>
              </div>

              <!-- View All Products > -->
              <div v-if="navData.product.bottomInfo.title" class="view-more text-center">
                <a
                  v-track:click="getElkData('products', '- pnx_more')"
                  class="fw-bold"
                  :href="handProLink(getStrapiData(navData.product.bottomInfo))"
                  v-html="navData.product.bottomInfo.title"
                ></a>
              </div>
            </div>
          </li>
          <!-- free -->
          <li v-if="navData.free && navData.free.label">
            <div
              class="first-menu-item justify-between"
              @click.prevent="showHide('subItemPId', navData.free, '1')"
            >
              <span v-html="navData.free.label"></span>
              <span class="icon">
                <i
                  :class="[
                    'iconfont-sg icon-expand',
                    navData.free.mobileShowDetail == 0 ? 'icon-menu-expand' : 'icon-menu-unexpand',
                  ]"
                ></i>
              </span>
            </div>
            <div
              id="subItemPId1"
              class="sub-box free-box"
              :class="{ 'height-0': navData.free.mobileShowDetail == 0 }"
            >
              <div v-for="item in navData.free.items" :key="item.id" class="product-box">
                <a
                  v-track:click="getElkData('free', item.title.toLowerCase().replace(/\s+/g, '_'))"
                  class="product-items"
                  :class="item.class"
                  :href="handProLink(getStrapiData(item))"
                >
                  <div class="tit fw-bold">
                    <span v-html="item.title"></span>
                  </div>
                  <div class="desc" v-html="item.desc"></div>
                </a>
              </div>
            </div>
          </li>

          <!-- faqs -->
          <li v-if="navData.faqs">
            <a
              v-track:click="getElkData('faqs', 'faqs')"
              class="first-menu-item justify-between"
              :href="navData.faqs.url"
            >
              <span v-html="navData.faqs.label"></span>
            </a>
          </li>

          <!-- 活动 -->
          <li v-if="navData.promotion">
            <a
              v-track:click="getElkData('promotion', 'promotion')"
              class="first-menu-item justify-inherit"
              :href="navData.promotion.link"
            >
              <span
                class="fw-bold promotion-name promotion-menu-style"
                v-html="navData.promotion.label"
              ></span>
              <span class="discount-box">
                <span>{{ navData.promotion.off }} </span>
                <img :src="navData.promotion.media?.data[0]?.attributes?.url" width="23" height="32" />
              </span>
            </a>
          </li>
        </ul>

        <!-- 购买下载按钮 -->
        <div class="btn-box">
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
    </transition>
  </nav>
</template>

<style lang="less" scoped>
.open-menu-1 {
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg, #00a5ea 0, #04c1b4 51%, #40d4a1 74%, #7ce78d 100%);
  }
  .navbar-container {
    &.nav-border {
      z-index: 99;
    }
  }
}

// 减去一级导航，减去二级导航
.NavBar-wrapper-sub .navbar-menu {
  min-height: calc(100vh - @nav-height - @sub-nav-height + 10px);
}
// 减去一级导航
.nav-border .NavBar-wrapper-sub .navbar-menu {
  min-height: calc(100vh - @nav-height + 10px);
}

&[data-has-headbanner='has-headbanner'] {
  // 减去一级导航，减去二级导航，减去促销导航
  .NavBar-wrapper-sub .navbar-menu {
    min-height: calc(100vh - @nav-height - @sub-nav-height - @promotion-height + 10px);
  }
  // 减去一级导航，减去促销导航
  .nav-border .NavBar-wrapper-sub .navbar-menu {
    min-height: calc(100vh - @nav-height - @promotion-height + 10px);
  }
}

.sub-box {
  overflow: hidden;
  transition: all 0.5s;
  padding: 0 30px;
  &.height-0 {
    height: 0;
  }

  // 展开产品信息
  // aio
  .product-box {
    color: #333;
    font-size: 16px;
    padding-bottom: 18px;
    .product-items {
      padding: 14px;
      border-radius: 9px;
      margin-top: 9px;
      display: block;
      color: #333;
      .desc {
        font-size: 14px;
        color: #c0c0c0;
        margin-top: 2px;
      }
      .btn-more {
        width: 190px;
        height: 45px;
        line-height: 45px;
        border-radius: 30px;
        display: inline-block;
        text-align: center;
        font-weight: 600;
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }
  .divider {
    margin-top: 10px;
    padding-bottom: 18px;
    border-top: 1px solid #e4eaeb;
  }

  // 产品列表
  .product-list {
    margin-bottom: 24px;
    .title {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .list-items {
      margin-bottom: 4px;
    }
    .tit {
      color: #909090;
      font-size: 14px;
    }
  }

  .view-more {
    margin-top: -8px;
    margin-bottom: 16px;
    a {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #333;
    }
  }
  &.free-box {
    .product-box {
      padding: 0;
      padding-bottom: 18px;
      .product-items {
        margin-top: 0;
        padding: 0;
      }
    }
  }
}
.navbarm-left {
  flex: 1;
  justify-content: center;
  > a {
    color: #333333;
    font-size: 18px;
  }
}
.menu-list-box {
  background: #fff;
  color: #333333;
  font-size: 16px;
  .first-menu-item {
    height: 52px;
    align-items: center;
    padding: 0 22px;
    display: flex;
    border-top: 1px solid #e4eaeb;
    color: #333333;
    .icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .promotion-name {
      font-size: 16px;
    }
    .discount-box {
      margin-left: 10px;
      > span {
        background: #ff3b30;
        border-radius: 14px 14px 14px 0px;
        color: #fff000;
        font-size: 14px;
        max-width: 12.5rem;
        padding: 4px 10px;
      }
      > img {
        margin-left: -8px;
        margin-top: 2px;
      }
    }
  }
}

.btn-box {
  border-top: 1px solid #e4eaeb;
  padding: 18px 22px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  > a,
  > a :deep(.btn) {
    width: 100%;
    height: 52px;
    margin-bottom: 14px;
    max-width: 460px;
    font-size: 18px;
    &:last-child {
      margin-bottom: 0;
    }
  }
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
.NavBar-wrapper-sub {
  background: #fff;
  height: 64px;

  &.open-menu {
    overflow: auto;
    bottom: 0;
  }

  .navbar-container {
    position: relative;
    background: #fff;
    padding: 0 15px;
    height: 100%;
    width: 100%;
  }

  // 整体布局
  // 导航条
  .navbar-box {
    position: relative;
    z-index: 98;
    height: 62px;
  }

  // 菜单面板
  .navbar-menu {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 10px 0 50px;
    background: rgba(0, 0, 0, 0.4);
    padding-top: 0;
  }
}

.NavBar-wrapper-sub {
  .m_menu,
  .menu_close {
    color: #4d5b67;
    font-size: 28px;
    cursor: pointer;
  }
  .icon-expand {
    font-size: 20px;
  }
  .logo {
    transform: scale(0.84);
    margin-right: 5px;
  }
}
</style>
