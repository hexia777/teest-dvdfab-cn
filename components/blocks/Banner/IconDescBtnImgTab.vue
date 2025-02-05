<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const index = ref('a')
const headerFixed = ref(false)
const initCartoon = ref(false)
const timer = ref<any>(null)
const browseTime = ref(0)
const clearTimeSet = ref<any>(null)
const isMobile = useStore.common().mobile

const dvdfab = {
  desc: props.items[0].desc,
  descSub: props.items[0].descSub,
  bannerUrl: props.items[0]?.banner?.data?.attributes?.url,
  bannerWidth: props.items[0]?.banner?.data?.attributes?.width,
  bannerHeight: props.items[0]?.banner?.data?.attributes?.height,
  bannerAlt: props.items[0]?.banner?.data?.attributes?.alternativeText,
  btnHref: props.items[0].btnHref,
  btnLabel: props.items[0].btnLabel,
}

const streamfab = {
  desc: props.items[1].desc,
  descSub: props.items[1].descSub,
  bannerUrl: props.items[1]?.banner?.data?.attributes?.url,
  bannerWidth: props.items[1]?.banner?.data?.attributes?.width,
  bannerHeight: props.items[1]?.banner?.data?.attributes?.height,
  bannerAlt: props.items[1]?.banner?.data?.attributes?.alternativeText,
  btnHref: props.items[1].btnHref,
  btnLabel: props.items[1].btnLabel,
  mobileBtnLabel: props.items[1].mobileBtnLabel || 'Download For Android',
  mobileBtnHref: props.items[1].mobileBtnHref,
}

useHead({
  link: [
    // $preloadImg(
    //   imgPath + '/promotion/index/img_streamfab_' + locale + '.png',
    // ),
    // $preloadImg(imgPath + '/promotion/index/streamfab_bg.jpg'),
  ],
})

onMounted(() => {
  setTime()
  window.addEventListener('scroll', handleScroll)
  // 防止cls的问题，延迟动画的生成
  setTimeout(() => {
    initCartoon.value = true
  }, 5000)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (clearTimeSet.value) {
    clearInterval(clearTimeSet.value)
  }
})

const handleScroll = () => {
  // 得到页面滚动的距离
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const header = document.getElementById('j_page_nav')
  if (header) {
    const offsetTop = header.offsetTop ? header.offsetTop : header.offsetHeight / 2
    // 判断页面滚动的距离是否大于吸顶元素的位置
    headerFixed.value = scrollTop > offsetTop * 2
  }
}
const tagClick = (i: 'a' | 'b', e: any) => {
  if (i === index.value) {
    return
  }
  index.value = i
  timer.value = setTimeout(() => {
    const { $trace } = useNuxtApp() as any
    $trace.traceCustomEvent({
      event: 'hover',
      event_label: 'index_banner_' + i,
    })
  }, 300)
}

const mouseLeave = () => {
  clearTimeout(timer.value)
}
const setTime = () => {
  clearTimeSet.value = setInterval(() => {
    browseTime.value++
  }, 1000)
}
const timeClick = () => {
  const { $trace } = useNuxtApp() as any
  $trace.traceCustomEvent({
    event: 'click',
    event_label: 'index_banner_' + index.value,
    ext_params_num_param1: browseTime,
  })

  setTimeout(() => {
    if (index.value === 'a') {
      window.location.href = dvdfab.btnHref
    } else {
      window.location.href = streamfab.btnHref
    }
  }, 200)
}
</script>

<template>
  <div>
    <div v-if="headerFixed" class="banner-top"></div>
    <div class="banner" :class="{ 'banner-new': index == 'b' }">
      <div class="tag-box tr">
        <div
          v-track:hover="{
            event: 'hover',
            event_label: 'index_banner_' + 'a',
          }"
          class="tag tag_1"
          :class="{
            selected: index === 'a',
            showanimation: initCartoon,
          }"
          @mouseover="tagClick('a', $event)"
          @mouseleave="mouseLeave"
        >
          <i class="tab_logo_dvdfab"></i>
          <i class="tab_logo_dvdfab_h"></i>
        </div>
        <div
          v-track:hover="{
            event: 'hover',
            event_label: 'index_banner_' + 'b',
          }"
          class="tag tag_2"
          :class="{
            selected: index === 'b',
            showanimation: initCartoon,
          }"
          @mouseover="tagClick('b', $event)"
          @mouseleave="mouseLeave"
        >
          <i class="tab_logo_streamfab"></i>
          <i class="tab_logo_streamfab_h"></i>
        </div>
      </div>
      <BaseContainer>
        <div
          v-track:click="{
            event: 'click',
            event_label: 'index_banner_' + index,
            ext_params_num_param1: browseTime,
          }"
          @click="timeClick"
        >
          <div class="banner-inner">
            <div class="index-banner" :class="{ 'banner-show': index == 'a' }">
              <div>
                <i class="logo_icon logo_dvdfab"></i>
                <p class="title-sub" v-html="dvdfab.desc"></p>
                <div class="desc">
                  <ul>
                    <li v-for="text in dvdfab.descSub" :key="text.id" v-html="text.value"></li>
                  </ul>
                </div>
                <div v-if="!isMobile" class="btn-box">
                  <my-button tag="div" :label="dvdfab.btnLabel" size="large" theme="primary" />
                </div>
              </div>
              <div class="imx-box">
                <my-img
                  class="banner-img"
                  style="max-width: 619px"
                  :width="dvdfab.bannerWidth"
                  :height="dvdfab.bannerHeight"
                  :src="dvdfab.bannerUrl"
                  :alt="dvdfab.bannerAlt"
                  :loading="index == 'a' ? '' : 'lazy'"
                />
              </div>
              <div v-if="isMobile" class="btn-box">
                <my-button :href="dvdfab.btnHref" :label="dvdfab.btnLabel" size="large" theme="primary" />
              </div>
            </div>
            <div class="index-banner" :class="{ 'banner-show': index == 'b' }">
              <div class="streamfab-box">
                <i class="logo_icon logo_streamfab"></i>
                <p class="title-sub" v-html="streamfab.desc"></p>
                <div class="desc">
                  <ul>
                    <li v-for="text in streamfab.descSub" :key="text.id" v-html="text.value"></li>
                  </ul>
                </div>
                <div v-if="!isMobile" class="btn-box">
                  <my-button tag="div" :label="streamfab.btnLabel" size="large" theme="primary" />
                </div>
              </div>
              <div class="imx-box">
                <my-img
                  class="banner-img"
                  style="max-width: 619px"
                  :width="streamfab.bannerWidth"
                  :height="streamfab.bannerHeight"
                  :src="streamfab.bannerUrl"
                  :alt="streamfab.bannerAlt"
                  :loading="index == 'b' ? '' : 'lazy'"
                />
              </div>
              <div v-if="isMobile" class="btn-box streamfab-mobile-btn">
                <my-button
                  :href="streamfab.btnHref"
                  :label="streamfab.btnLabel"
                  size="large"
                  theme="primary"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-show="isMobile && index == 'b' && streamfab.mobileBtnHref" class="streamfab-mobile-btn">
          <my-button
            v-track:click="{
              event: 'click',
              event_label: 'index_banner_b',
            }"
            :href="streamfab.mobileBtnHref + '?dl=true'"
            size="large"
            theme="android"
          >
            <span class="flex-center">
              <i class="iconfont-sg icon-android v-mid pr-8 c-white font-size-24"></i>
              <span v-html="streamfab.mobileBtnLabel"></span>
            </span>
          </my-button>
        </div>
      </BaseContainer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.icon_spot,
.logo_dvdfab,
.logo_streamfab,
.tab_logo_dvdfab,
.tab_logo_dvdfab_h,
.tab_logo_streamfab,
.tab_logo_streamfab_h {
  display: inline-block;
  background: img_url('/promotion/index/icon.png?t=1657796099755') no-repeat;
  background-size: 25rem 20.75rem;
}
.tab_logo_dvdfab,
.tab_logo_dvdfab_h,
.tab_logo_streamfab,
.tab_logo_streamfab_h {
  width: 9.813rem;
  height: 2.063rem;
}
.icon_spot {
  background-position: -20.875rem -7.813rem;
  width: 1.438rem;
  height: 1.438rem;
}
.logo_dvdfab {
  background-position: 0rem -7.813rem;
  width: 19.625rem;
  height: 6.313rem;
}
.logo_streamfab {
  background-position: 0rem 0rem;
  width: 25rem;
  height: 6.563rem;
}
.tab_logo_dvdfab {
  background-position: 0rem -15.375rem;
}
.tab_logo_dvdfab_h {
  background-position: -11.063rem -15.375rem;
}
.tab_logo_streamfab {
  background-position: 0rem -18.688rem;
}
.tab_logo_streamfab_h {
  background-position: -11.063rem -18.688rem;
}
.index-banner .desc {
  ul li {
    position: relative;
    padding-left: 30px;
    line-height: 20px;
    margin-bottom: 16px;
    &::before:extend(.icon_spot) {
      content: '';
      position: absolute;
      left: 0;
      top: -1px;
    }
  }
}
</style>
<style lang="less" scoped>
.banner-top {
  width: 100%;
  height: 82px;
}
.banner {
  position: relative;
  cursor: pointer;
  min-height: 790px;
  background: #fa6c62 img_url('/promotion/index/dvdfab_bg.jpg') no-repeat center;
  background-size: cover;
  color: #fff;
  width: 100%;
  transition: all 0.5s;
  padding-top: 40px;
  .container {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 80px 40px 90px;
  }
  .promotion-img {
    position: absolute;
    right: 17%;
    top: 10%;
  }
  .banner-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    height: 660px;
  }
  .index-banner {
    display: none;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    .imx-box {
      flex-shrink: 0;
      height: 490px;
      img {
        width: 100%;
        height: auto;
      }
      @media screen and (max-width: 1250px) {
        flex-shrink: unset;
      }
    }
  }
  .banner-show {
    display: flex;
  }
  .title-sub {
    margin: 30px 0 40px;
    line-height: 32px;
    font-size: 22px;
    text-align: left;
    width: 581px;
    @media (max-width: 640px) {
      width: auto;
    }
  }

  .tag-box {
    position: absolute;
    width: 100%;
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
    text-align: center;
    font-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 90;
    .tag {
      padding: 35px 0 15px;
      border: none;
      &:hover {
        color: @text-white-color !important;
        background: none;
      }
    }
    &:before {
      content: '';
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
      position: absolute;
      bottom: 0;
      z-index: -1;
    }
  }

  .tag {
    display: inline-block;
    position: relative;
    width: 318px;
    cursor: pointer;
  }
  .tag_1.showanimation::before {
    animation: go-right 0.4s ease 0.1s both;
  }
  .tag_2.showanimation::before {
    animation: go-left 0.4s ease 0.1s both;
  }
  @keyframes go-right {
    from {
      transform: translateX(91.5%);
    }
    to {
      transform: translateX(0.2%);
    }
  }
  @keyframes go-left {
    from {
      transform: translateX(-93%);
    }
    to {
      transform: translateX(0%);
    }
  }
  .tag_1 {
    .tab_logo_dvdfab_h {
      display: none;
    }
  }
  .tag_2 {
    .tab_logo_streamfab_h {
      display: none;
    }
  }
  .tag_1.selected {
    .tab_logo_dvdfab {
      display: none;
    }
    .tab_logo_dvdfab_h {
      display: inline-block;
    }
  }
  .tag_2.selected {
    .tab_logo_streamfab {
      display: none;
    }
    .tab_logo_streamfab_h {
      display: inline-block;
    }
  }
  .streamfab-box {
    // width: 100%;
  }
  .tag.selected::before {
    content: '';
    position: absolute;
    left: 0;
    z-index: -1;
    bottom: 0;
    border-bottom: 3px solid #fff;
    width: 100%;
  }

  .btn-box {
    margin-top: 50px;
    text-align: left;
  }
  .mt {
    margin: 65px 0 0;
  }

  .other-download {
    margin-left: 10px;
  }
  .text-link {
    text-decoration: underline;
  }
}
.banner-new {
  transition: all 0.5s;
  background: #ff6645 img_url('/promotion/index/streamfab_bg.jpg') no-repeat center;
  background-size: cover;
}

.streamfab-mobile-btn {
  text-align: center;
  margin-top: 16px;
  .my-button {
    width: 278px;
  }
  .android {
    background: #18b958;
  }
}

@media (max-width: 1024px) {
  .banner {
    min-height: 490px;
    padding: 40px 20px;
    align-items: center;
    position: relative;
    background: img_url('/promotion/index/dvdfab_logo_bg.png') no-repeat top center;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 100%;
      z-index: -1;
      background: linear-gradient(0deg, #fb736f 0%, #a711b2 35%, #5b5dd8 65%, #00d4de 100%);
    }
    .container {
      display: block;
      padding: 0;
    }
    .banner-inner {
      padding: 0;
      color: #fff;
      justify-content: center;
      height: auto;
    }
    .title-sub {
      font-size: 1.28rem;
      text-align: center;
      margin-top: 20px;
    }
    p {
      font-size: 18px;
    }
    .tag-box {
      position: relative;
      z-index: 3;
      left: 0;
      top: 0;
      transform: translate(0);
      background: rgba(0, 0, 0, 0.15);
      border-radius: 68px;
      &::before {
        display: none;
      }
    }
    .tag-box .tag {
      padding-top: 5px;
      width: 50%;
      i {
        transform: translateY(5px) scale(0.7);
      }
    }
    .tag.selected::before {
      height: 100%;
      border: 0;
      border-radius: 40px;
      background: linear-gradient(90deg, #f47900 0%, #ffb006 95%);
    }
    .tag_1 {
      .tab_logo_dvdfab {
        display: none;
      }
      .tab_logo_dvdfab_h {
        display: inline-block;
      }
    }
    .tag_2 {
      .tab_logo_streamfab {
        display: none;
      }
      .tab_logo_streamfab_h {
        display: inline-block;
      }
    }
    .index-banner {
      flex-direction: column;
      .logo_icon {
        display: block;
        margin: 40px auto 20px;
        transform: scale(0.7);
      }
      .logo_streamfab {
        transform: translateX(-4%) scale(0.8);
      }

      .imx-box {
        height: auto;
        img {
          max-width: 100%;
        }
      }
    }
  }
  .banner-new {
    background: img_url('/promotion/index/streamfab_logo_bg.png') no-repeat top center;
    &::before {
      background: linear-gradient(0deg, #ff472f 0%, #ff6b4a 35%, #ff825d 65%, #ffde43 100%);
    }
  }

  .banner .index-banner .logo_streamfab {
    transform: scale(0.7);
  }
}
@media (max-width: 640px) {
  .banner .tag-box .tag {
    padding: 0 0 10px;
  }
}

@media (max-width: 340px) {
  .banner {
    p {
      font-size: 1.5rem;
    }
  }
}
</style>
