<script setup lang="ts">
const { locales, handProTag, handProLink, elkEventLabel, scrollHandler, navBarPcDom } = useNavBar()
const { $trace } = useNuxtApp() as any
// props 传参
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
  productLine: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['hiddenPanelHandle'])
// subList数据二次处理
const subList = computed(() => {
  const arr = [] as any
  const cols1 = [] as any
  const cols2 = [] as any
  const cols3 = [] as any
  props.info?.subList?.forEach((item: { col: number }, index: any) => {
    if (item.col === 1) {
      cols1.push(item)
    }
    if (item.col === 2) {
      cols2.push(item)
    }
    if (item.col === 3) {
      cols3.push(item)
    }
  })
  arr.push(cols1)
  arr.push(cols2)
  arr.push(cols3)
  return arr
})
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

const getElkData = (event_label: string = 'mainpage', event_value: string = 'mainpage') => {
  return {
    event: 'click',
    event_category: 'nav',
    event_label,
    event_value,
    event_target: {
      position: props.productLine + '_nav_header',
    },
  }
}

/**
 * 上报相关  end
 * */
const viewAllClick = (e: any) => {
  $trace.traceCustomEvent({
    ...getElkData('products', 'pnx_more'),
  })
  if (e.target.href.includes(useRoute().name)) {
    const anchor = e.target.dataset.anchor
    if (anchor) {
      document.querySelector('#' + anchor)?.scrollIntoView({
        behavior: 'instant',
      })
    }
  } else {
    location.href = e.target.href
  }

  emit('hiddenPanelHandle', -1)
}
const proLine = ['streamfab', 'musicfab']
// 初始化
onMounted(() => {
  scrollHandler()
  // autoLogin() // 自动登录
  window.addEventListener('scroll', scrollHandler)
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <nav
    id="SecNavBar"
    ref="navBarPcDom"
    class="NavBar-wrapper"
    :class="['theme-nav-' + (['musicfab'].includes(productLine) ? 'musicfab' : 'dvdfab')]"
  >
    <div v-if="info?.subList" class="flex nav-item-sub nav-anchor">
      <BaseContainer class="flex nav-sub-list">
        <!-- 左侧图片栏 bundleInfo -->
        <div v-if="info?.bundleInfo?.length" class="sub-left" :class="['theme-nav-' + productLine]">
          <template v-for="(bundle, n) in info.bundleInfo">
            <template v-if="bundle && !proLine.includes(info.key)">
              <PagesNavbarAioItem
                :key="n + 'bundle'"
                class="pro-box"
                :class="[
                  bundle.class ? bundle.class : '',
                  { 'show-bundle': info.switch == n || info.bundleInfo.length != 2 },
                ]"
                v-bind="{
                  ...bundle,
                  elkParams: getElkData('products', 'products'),
                  imgUrl: bundle?.media?.data?.attributes?.url,
                  btnInfo: {
                    label: locales.common.learn_more,
                    href: bundle.link,
                    tag: 'a',
                    theme: 'border',
                  },
                }"
              />
            </template>
          </template>
        </div>
        <!-- streamfab musicfab 下拉菜单 -->
        <template v-if="info.pcBundleTitle || info.mobileBundleTitle">
          <div class="sub-left">
            <PagesNavbarSubItems
              v-bind="{
                elkParams: getElkData('products', 'products'),
                productLine: productLine,
                items: [
                  {
                    title: info.pcBundleTitle,
                    items: info.pcBundleList,
                  },
                  {
                    title: info.mobileBundleTitle,
                    items: info.mobileBundleList,
                  },
                ],
              }"
            />
          </div>
        </template>
        <!-- 右侧目录栏 -->
        <div v-if="subList && subList.length" class="show-nav-list">
          <!-- region 大于1200px布局 -->
          <div v-if="subList?.length" class="flex" :class="info?.key + '-pro-nav'">
            <div v-for="(colList, i) in subList" :key="info?.key + '-col-pro-' + i" class="col-pro">
              <ul
                v-for="(rowItem, j) in colList"
                :key="info?.key + '_sub_group_' + i + '_' + j"
                class="sub-group sub-list flex-wrap"
                :class="{ 'show-pro-list': info.tabKey == rowItem?.key }"
              >
                <!-- 分组标题 -->
                <li v-if="rowItem?.title" :key="'sub_title_' + i" class="nav-sub-title">
                  <b v-html="rowItem.title"></b>
                </li>
                <template
                  v-for="(subItem, n) in rowItem?.products?.data"
                  :key="info?.key + 'sub_list_' + i + '_' + j + '_' + n"
                >
                  <li class="sub-list-item text-hover-color">
                    <a
                      v-track:click="
                        getElkData(
                          'products',
                          getStrapiData(subItem)?.shortName.toLowerCase().replace(/\s+/g, '_'),
                        )
                      "
                      :href="handProLink(getStrapiData(subItem))"
                      data-nav="pro text-hover-color"
                      :class="`${getStrapiData(subItem).class || ''}`"
                    >
                      {{ getStrapiData(subItem)?.shortName }}
                    </a>
                    <!-- 标签 -->
                    <span
                      v-if="handProTag(getStrapiData(subItem))?.tag"
                      class="nav-tag"
                      data-nosnippet
                      :class="
                        handProTag(getStrapiData(subItem))
                          ? 'nav-tag-' + handProTag(getStrapiData(subItem)).tag.toLowerCase()
                          : ''
                      "
                    >
                      {{ handProTag(getStrapiData(subItem))?.name }}
                    </span>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <!--endregion-->
          <!-- region 底部 超链接 -->
          <div v-if="info?.bottomInfo?.title" class="pnc-bottom-box pc-nav-bottom linear-bg-primary">
            <div
              v-if="info.bottomInfo?.title && !info.bottomInfo?.link"
              class="pnc-txt"
              v-html="info.bottomInfo.title"
            ></div>
            <a
              v-if="info.bottomInfo?.title && info.bottomInfo?.link"
              :href="`${info.bottomInfo.link + (info.bottomInfo.anchor ? '#' + info.bottomInfo.anchor : '')}`"
              :data-anchor="info.bottomInfo.anchor"
              class="pnx-more text-right"
              @click.prevent="viewAllClick"
            >
              {{ info.bottomInfo.title }}
            </a>
          </div>
          <!--endregion-->
        </div>
      </BaseContainer>
    </div>
  </nav>
</template>
<!-- 全局样式 -->
<style lang="less">
.lang-de {
  .NavBar-wrapper {
    .navbar-menu {
      .off-tag {
        span {
          font-size: 20px;
        }
      }
    }
  }
}
.theme-nav-musicfab {
  .col-pro:nth-of-type(2) {
    padding-top: 36px;
  }
}
</style>

<style scoped lang="less">
.tips_icon {
  vertical-align: middle;
  margin-right: 10px;
}

.NavBar-wrapper {
  background: #fff;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  z-index: 9;
  &:hover {
    display: block !important;
  }
  .sub-items {
    padding-bottom: 20px;
  }
  &.nav-border {
    z-index: 99;
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
}
.nav-sub-list {
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%;
}
.navbar-box {
  position: relative;
  z-index: 98;
  height: @nav-height;
  background: #fff;
}

@media (max-width: 768px) {
  .navbar-box .nav_download {
    display: none;
  }
}

// pageNavContent
.new-min-nav-bottom {
  display: none;
}

.show-nav-list {
  padding: 0 20px 30px 48px;
  padding-bottom: 0;

  .new-min-nav-box {
    display: none;
  }
}

.new-min-nav-box {
  padding: 10px 0;
  position: relative;
  background: #f4f8f9;
}

.new-min-nav {
  display: flex;
}

.min-nav-lf {
  padding-left: 10px;
  width: 220px;
  display: flex;
  flex-direction: column;
  position: relative;

  .min-title {
    min-height: 41px;
    line-height: 1.5;

    color: @base-text-color;
    padding: 8px 20px;
    border-radius: 100px 0px 0px 100px;
    cursor: pointer;
    text-wrap: initial;
  }
}

.new-min-nav {
  .min-title.active {
    background: #fff;
    font-weight: bold;
  }

  .min-nav-rt.active {
    z-index: 1;
    opacity: 1;
  }
}

.min-nav-rt {
  font-size: 1rem;
  width: 300px;
  position: absolute;
  left: 230px;
  top: 0;
  opacity: 0;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;

  .min-nav-item {
    width: 100%;
    line-height: 2.5rem;
    padding-left: 1.25rem;
    height: 2.5rem;
    padding-bottom: 0;
    padding-right: 100px;

    a {
      font-size: 1rem;

      &:hover {
        color: @primary-text-color;
      }
    }

    .more-link {
      color: @primary-text-color;
      text-decoration: underline;
    }
  }
}

.pnc-bottom-box {
  margin-top: 25px;
  padding: 8px 0;
  text-align: center;
  position: relative;
  transition: all 1s;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: #ecf2f3;
    transition: all 1s;
  }
  &::before {
    top: 0;
  }
  .pnc-txt {
    margin-bottom: 30px;

    color: #3b5159;
    white-space: normal;
    line-height: 1.5em;
  }

  .pnx-more {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    transition: all 0.3s;
  }
}

.stream-bottom-box {
  color: @primary-text-color;
  font-size: @font-size-sm;
}

// 整体布局
.navbar-left,
.navbar-right,
.navbar-menu {
  gap: 30px;
}

.NavBar-wrapper {
  .j_nav_item {
    i {
      margin-left: 8px;
    }
  }

  .navbar-menu {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .sub-list-item {
    a {
      color: #909090;
    }
  }

  .free {
    background: #1db300;
    color: #fff;
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
          width: 46px;
          height: 46px;
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
      min-width: 290px;
      background: #ffffff;
      box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      color: #3b5159;
      top: 55px;
      right: 0;

      .infos {
        background: #f1fafd;
        border-radius: 4px 4px 0 0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;

        > span {
          height: 28px;
          line-height: 25px;
          display: block;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .name {
          color: #4d5b66;
          font-size: 20px;
        }
      }

      .links {
        padding: 20px 0;

        li {
          height: 40px;
          line-height: 40px;
          padding: 0 20px;

          a {
            display: flex;
            align-items: center;

            i {
              @apply font-size-20;
              margin-right: 10px;
            }
          }

          &:hover {
            background: #e2f9ff;

            a {
              color: @primary-text-color;
            }
          }
        }
      }
    }

    a.btn {
      display: flex;
      min-width: 170px;
      height: 46px;

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
        background-color: @primary-text-color;
        color: #fff;
      }

      &.account {
        background-color: #fff;
        color: @primary-text-color;
      }
    }

    .nav_off_tag {
      position: absolute;
      z-index: 1;
      right: -7px;
      top: 0;
    }

    .user-info-con {
      &.rebuy-user {
        .user-name {
          position: relative;
          min-width: 170px;
          height: 46px;
          padding: 4px;
          padding-right: 40px;
          color: #fff;
          background: @primary-text-color;
          display: inline-flex;
          align-items: center;

          border-radius: 30px;

          .name {
            width: 38px;
            height: 38px;
            color: @primary-text-color;
            background: #fff;
          }
        }
      }

      .login-text {
        margin-right: 20px;
      }
    }
  }

  .tab-box {
    position: relative;

    .nav-tag {
      position: absolute;
      top: -69px;
      right: -10px;
      font-size: 12px;
      background-color: rgb(255, 17, 17);
      color: #fff000;
      font-weight: bold;
    }
  }

  .nav-item {
    position: relative;

    &:hover {
      .j_nav_item {
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
      color: #3b5159;
    }
  }

  .dvdfab-nav-box,
  .streamfab-nav-box {
    position: inherit;

    .nav-item-sub {
      // left: -118px;
      transform: none;
    }
  }

  .streamfab-nav-box {
    .nav-item-sub {
      // left: -212px;
    }
  }

  .unifab-nav-box {
    &.nav-item {
      position: relative;
    }

    .nav-item-sub {
      // transform: translate(-35%, 0);
    }
  }

  .more-nav-box {
    &.nav-item {
      position: relative;
    }

    .nav-item-sub {
      // transform: translate(-50%, 0);
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

  // 菜单面板
  .nav-item-sub {
    // position: absolute;
    // top: 70px;
    // left: 0;
    // z-index: 101;
    background: #fff;
    border-radius: 5px;
    // max-width: 1146px;
    // min-width: 280px;
    // visibility: hidden;
    // box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
    // transform: translate(-30%, 0);
    // 添加动画造成首页切换不流畅，去掉
    // transition: all 0.2s linear;
    cursor: auto;
    opacity: 1;
    // padding: 15px 0;
    width: auto;

    // hover 显示面板
    &.show-sub-panel {
      visibility: visible;
    }

    .sub-list {
      min-width: 288px;
      padding-bottom: 20px;
      &:last-child {
        padding-bottom: 0;
      }
    }

    .sub-list-item {
      width: 100%;
      line-height: 40px;
      height: 40px;
      padding-bottom: 0;
      display: flex;
      align-items: center;

      a {
        &:hover {
          text-decoration: underline;
        }
      }

      .more-link {
        color: @primary-text-color;
        text-decoration: underline;
        line-height: 1.5;
      }
    }
  }

  .sub-left {
    width: 328px;
    padding-right: 48px;
    border-right: 2px solid #f4f8f9;

    p,
    .nav-name {
      font-size: 18px;
      line-height: 1;
      text-align: center;
      padding: 0 10px;
      white-space: normal;
    }

    .nav-desc {
      font-size: 14px;
      text-align: center;
      line-height: 35px;
    }

    .nav-item-desc {
      font-size: 14px;
      color: #3b5159;
      line-height: 20px;
      white-space: normal;
      padding: 10px 30px;
      text-align: center;
    }
  }

  .nav-item .sub-right {
    width: 600px;
    align-content: flex-start;

    .sub-list {
      width: 50%;
    }
  }

  .nav-img-box {
    position: relative;
    padding-top: 15px;
    display: flex;
    align-items: center;
  }

  .box-img {
    margin: 0 auto;
    width: 191px;
    height: 191px;
    background-repeat: no-repeat;
    display: block;
    background-size: cover;
  }

  .special-bundle {
    padding-top: 5px;

    .box-img {
      width: 126px;
      height: 126px;
      margin: 0 auto;
      display: block;
      margin-bottom: 20px;
    }
  }

  .off-tag {
    position: absolute;
    top: -2%;
    left: 9.5%;
    line-height: 1;
    text-align: center;
    font-size: 24px;
    z-index: 1;
    transform: rotate(-28deg) scale(0.8);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before {
      font-size: 84px;
    }

    span,
    :deep(span) {
      @apply font-size-24;
      position: absolute;
      font-family: Figtree, Arial, sans-serif;
      color: #fff;
      // transform: translate(35%, 40%);
    }
  }

  .downloader_icon {
    transform: scale(0.5);
    position: absolute;
    top: -18%;
    left: -11%;
  }

  .nav-item-btn {
    text-align: center;
    padding: 20px 0 30px;

    div {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-width: 170px;
      height: 45px;
      border: 2px solid #06abf0;
      text-align: center;
      color: #06abf0;
      border-radius: 50px;
      font-size: 1rem;

      &:hover {
        color: #fff;
        background: @primary-text-color;
        border-color: @primary-text-color;
      }
    }
  }

  .sub-list {
    flex-direction: column;

    .sub-list-item {
      white-space: nowrap;
    }

    li {
      text-align: left;
      line-height: 1.5;
      padding-bottom: 12px;
      white-space: normal;
    }

    a {
      &:hover {
        color: @third-color;
      }
    }
  }
}
.NavBar-wrapper.theme-nav-musicfab .sub-list a:hover {
  color: @text-mf-nav-color;
}
.nav-os-switch {
  display: none;
  width: 96%;
  height: 25px;
  max-width: 246px;
  margin: 0 auto 20px;
  background: #f1f1f1;
  border-radius: 20px;
  line-height: 25px;
  text-wrap: nowrap;

  span {
    display: inline-block;
    width: 50%;
    font-size: 14px;
    text-align: center;
    border-radius: 20px;

    &.selected {
      color: #fff;
      background: @primary-text-color;
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

@media (max-width: 1200px) {
  .navbar-left,
  .navbar-right,
  .navbar-menu {
    gap: 20px;
  }

  .nav-os-switch {
    display: block;
  }

  .NavBar-wrapper .nav-item {
    .pro-title {
      min-height: 36px;
    }

    .special-bundle {
      .nav-img-box {
        padding: 23px 0 18px;
      }
    }
  }

  .NavBar-wrapper .special-bundle .box-img {
    width: 140px;
    height: 140px;
  }

  .new-min-nav-bottom {
    display: block;
  }

  .show-nav-list {
    display: flex;

    .new-min-nav-box {
      display: flex;
      flex-direction: column;
      min-height: 200px;
      /* hack 右侧高度不填充 */
      height: 100%;
    }

    // .pc-nav,
    .pc-nav-bottom {
      display: none;
    }
  }

  .sub-left .pro-box:not(.show-bundle) {
    display: none;
  }

  .show-nav-tab {
    .show-nav-list {
      padding: 0;
    }

    .sub-left {
      border-right: 0;
    }
  }

  .NavBar-wrapper {
    .nav-item-sub {
      .sub-list-item {
        padding-left: 24px;
        padding-right: 24px;

        &:hover {
          background: transparent;
        }
      }
    }

    .col-pro {
      padding: 10px 0;
      max-height: 480px;
      overflow: hidden;
      overflow-y: auto;
      margin-left: 48px;
      &:first-child {
        margin-left: 0;
      }

      .sub-group:not(.show-pro-list) {
        display: none;
      }
    }

    .nav-item {
      .nav-sub-title {
        display: none;
      }
    }
  }
}

@media (max-width: 1024px) {
  .musicfab-nav-box .nav-item-sub {
    // left: -100px;
  }

  .NavBar-wrapper {
    .member-box {
      a.btn {
        min-width: 7rem;
        height: 40px;
        margin-left: 0 !important;

        > i {
          display: none;
        }
      }
    }
  }

  .NavBar-wrapper {
    .nav-item {
      &.hide-1024 {
        display: none;
      }
    }
  }
}
</style>
