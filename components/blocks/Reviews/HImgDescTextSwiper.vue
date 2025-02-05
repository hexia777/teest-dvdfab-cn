<script setup>
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  title: {
    type: String,
    default: '',
  },
  domId: {
    type: String,
    default: 'carousel',
  },
  layout: {
    type: String,
    default: 'responsive',
  },
  width: {
    type: [String, Number],
    default: 'auto',
  },
  height: {
    type: [String, Number],
    default: 'auto',
  },
  applyHeight: {
    type: Boolean,
    default: true,
  },
  delay: {
    type: String,
    default: '2000',
  },
  items: {
    type: Array,
    default: () => [],
  },
  info: {
    type: Object,
    default: () => ({}),
  },
  indicatorPosition: {
    type: String,
    default: 'none',
  },
  trigger: {
    type: String,
    default: 'hover',
  },
  autoPlayTime: {
    type: Number,
    default: 3000,
  },
  arrow: {
    type: String,
    default: 'always',
  },
  padding: {
    type: Boolean,
    default: true,
  },
  guideI: {
    type: Number,
    default: 0,
  },
  guideImac: {
    type: Number,
    default: 0,
  },
  iconLeft: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['changeTab'])

const state = reactive({
  currentIndex: 0,
  timer: null,
  isPre: false, // 代表上一个
  bodyWidth: 0,
  maxH: 0,
  setCarouselHeightNum: 0,
})

const selfChange = (index, pre = false) => {
  emit('changeTab', index)
  changeTab(index, pre)
}

const changeTab = (index, pre) => {
  state.isPre = false
  if (pre || index < state.currentIndex) {
    state.isPre = true
  }
  if (index < 0) {
    index = props.items.length - 1
  } else if (index > props.items.length - 1) {
    index = 0
  }
  state.currentIndex = index
}

const autoPlay = () => {
  selfChange(state.currentIndex + 1)
}

const go = () => {
  if (props.autoPlayTime > 0 && !state.timer) {
    state.timer = setInterval(() => {
      autoPlay()
    }, props.autoPlayTime)
  }
}

const stop = () => {
  clearInterval(state.timer)
  state.timer = null
}

// const carouselItemsHover = (index) => {
//   if (props.trigger === 'hover') {
//     selfChange(index)
//   }
// }

// const carouselItemsClick = (index) => {
//   if (props.trigger === 'click') {
//     selfChange(index)
//   }
// }

const isMobile = useStore.common().mobile

const arrowClick = (val) => {
  stop()
  if (val === 'right') {
    selfChange(state.currentIndex + 1)
  } else {
    selfChange(state.currentIndex - 1, true)
  }
  go()
}

const setCarouselHeight = () => {
  const carousel = document.querySelector(`#${props.domId}`)
  if (carousel) {
    const carouselItems = carousel.querySelectorAll('li')
    let maxH = 0
    for (let i = 0; i < carouselItems.length; i++) {
      if (carouselItems[i].clientHeight > maxH) {
        maxH = carouselItems[i].clientHeight
      }
    }
    if (
      maxH !== parseInt(carousel.style.height.replace('px', '')) &&
      maxH < 400 &&
      state.setCarouselHeightNum < 3
    ) {
      state.setCarouselHeightNum++
      setTimeout(() => {
        setCarouselHeight()
      }, 1000 * 5)
    }
    if (maxH === 0) {
      maxH = 378
    }
    if (carousel.id === 'guide-carousel-mac') {
      maxH = 650
    }
    if (carousel.id === 'guide-mac-max-height') {
      maxH = 801
    }
    state.maxH = maxH
    carousel.style.height = `${maxH}px`
  }
}

onMounted(() => {
  if (!isMobile) {
    if (props.autoPlayTime > 0) {
      nextTick(() => {
        state.timer = setInterval(() => {
          autoPlay()
        }, props.autoPlayTime)
      })
    }
    if (!props.applyHeight) {
      nextTick(() => {
        state.bodyWidth = document.body.clientWidth
        setCarouselHeight()
        window.addEventListener('resize', () => {
          if (document.body.clientWidth !== state.bodyWidth) {
            state.bodyWidth = document.body.clientWidth
            setCarouselHeight()
          }
        })
      })
    }
  }
})

onUnmounted(() => {
  stop()
  window.removeEventListener('resize', setCarouselHeight)
})

watch(
  () => props.guideI,
  (val) => {
    selfChange(val)
  },
)

watch(
  () => props.guideImac,
  (val) => {
    selfChange(val)
  },
)
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <h2 class="title text-center title2 mb90" v-html="title"></h2>
      <div class="carousel-wrap relative" :class="{ isMobile: isMobile }">
        <div v-if="!isMobile" class="bg-color bg-normal"></div>
        <div
          :id="domId"
          ref="carousel"
          class="carousel-content relative w100%"
          :class="{ pre: state.isPre, h358: !isMobile }"
        >
          <div class="content">
            <transition-group tag="ul" class="carousel" name="list">
              <li
                v-for="(item, index) in items"
                v-show="!state.maxH || index === state.currentIndex"
                :key="index"
                :class="{ padding: padding }"
                :style="state.maxH || index === state.currentIndex || isMobile ? '' : 'display: none;'"
                @mouseenter="stop"
                @mouseleave="go"
              >
                <div class="split-img border-primary">
                  <div class="img-box">
                    <my-img
                      v-if="getStrapiData(item.avatar)?.url"
                      :src="getStrapiData(item.avatar)?.url"
                      :width="getStrapiData(item.avatar)?.width"
                      :height="getStrapiData(item.avatar)?.height"
                      layout="responsive"
                      :alt="getStrapiData(item.avatar)?.name"
                      class="img-bg w100 h100"
                    />
                    <my-img
                      v-else
                      :src="'https://c5.dvdfab.cn/images/article/author/en/alice.png'"
                      :width="getStrapiData(item.avatar)?.width"
                      :height="getStrapiData(item.avatar)?.height"
                      layout="responsive"
                      :alt="getStrapiData(item.avatar)?.name"
                      class="img-bg w100 h100"
                    />
                  </div>
                  <div class="author-desc">
                    <div class="w100%">
                      <p class="tc" v-html="item.desc"></p>
                      <div class="text-right author-tit" v-html="item.rightDesc"></div>
                    </div>
                  </div>
                </div>
              </li>
            </transition-group>
          </div>
          <template v-if="arrow == 'always' && !isMobile">
            <div
              class="switch-btn-wrap bg-normal bg-hover-primary swiper_icon_left"
              @click="arrowClick('left')"
            >
              <i class="iconfont-sg icon-pre text-primary-color" :class="iconLeft"></i>
            </div>
            <div
              class="switch-btn-wrap bg-normal bg-hover-primary swiper_icon_right"
              @click="arrowClick('right')"
            >
              <i class="default iconfont-sg icon-next text-primary-color" :class="iconLeft"></i>
            </div>
          </template>
          <!-- <div class="carousel-items" v-if="indicatorPosition != 'none'">
        <template v-for="(item, index) in list.length">
          <slot
            v-if="$slots.indicator"
            name="indicator"
            :item="list[index]"
            :index="index"
            :currentIndex="state.currentIndex"
          ></slot>
          <span
            v-else
            :key="'carousel-items-' + index"
            :class="[list[index].class, { active: index === state.currentIndex }]"
            @mouseenter="stop"
            @mouseleave="go"
            @mouseover="carouselItemsHover(index)"
            @click="carouselItemsClick(index)"
            >{{ list[index].class }}
          </span>
        </template>
      </div> -->
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.carousel-wrap {
  &.isMobile {
    height: auto !important;
    .padding {
      padding: 0;
    }
    .split-img {
      margin: 0;
      border: none;
      flex-direction: column;
      .img-box {
        padding: 0;
        width: 100%;
        margin: 30px 0;
        img {
          margin: 0 auto;
        }
      }
      .author-desc {
        padding: 0;
        .tc {
          min-height: auto;
        }
        .author-tit {
          padding-top: 14px;
        }
      }
    }
    .carousel li {
      position: initial;
    }
  }
  .img-box {
    margin: 30px auto 60px;
    border-radius: 50%;
    line-height: 0;
  }
  .author-tit {
    padding-top: 25px;
    color: #8f8f8f;
    font-style: italic;
  }
  .bg-color {
    position: absolute;
    top: -50px;
    left: 0;
    width: 400px;
    max-width: 100%;
    height: 409px;
    border-radius: 30px 0 30px 0;
  }
}

.split-img {
  display: flex;
  min-height: 270px;
  border-width: 4px;
  border-style: solid;
  border-radius: 20px;
  background-color: @bg-white;
  margin-left: 100px;
  .img-box {
    width: 150px;
    display: flex;
    margin: 0;
    padding-left: 40px;
    padding-top: 45px;
  }
  .author-desc {
    flex: 1;
    display: flex;
    padding-left: 35px;
    padding-right: 20px;
    padding-top: 45px;
    text-align: left;
    .tc {
      min-height: 130px;
      text-align: left;
    }
  }
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.carousel {
  width: 100%;
  height: 100%;
  li {
    &.padding {
      padding: 0 20px;
    }
    position: absolute;
    width: 100%;
    img {
      // width: 100%;
      // height: 100%;
    }
  }
}
.swiper_icon_left {
  right: 130px;
}
.swiper_icon_right {
  right: 50px;
}
.swiper_icon_right {
  .right {
    transform: rotate(180deg);
  }
}
.carousel-items {
  position: absolute;
  z-index: 10;
  bottom: -30px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-size: 0;
  span {
    display: inline-block;
    height: 12px;
    width: 12px;
    margin: 0 12px;
    border-radius: 50%;
    background-color: #c0c4cc;
    cursor: pointer;
    &:hover {
      opacity: 0.64;
    }
  }
  .active {
    background-color: @primary-color;
  }
}

.list-enter-to {
  transition: all 1s ease;
  transform: translateX(0);
}

.list-leave-active {
  transition: all 1s ease;
  transform: translateX(-100%);
}

.list-enter {
  transform: translateX(100%);
}

.list-leave {
  transform: translateX(0);
}
.pre {
  .list-leave-active {
    transform: translateX(100%);
  }

  .list-enter {
    transform: translateX(-100%);
  }
}

.hover {
  display: none;
}
.switch-btn-wrap {
  position: absolute;
  bottom: 0;
  z-index: 3;
  width: 66px;
  height: 66px;
  text-align: center;
  line-height: 66px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    i {
      color: @text-white-color;
    }
  }
  i {
    font-size: 30px;
    font-weight: bold;
  }
}
@media (max-width: 1024px) {
  .carousel-content {
    height: auto;
    min-height: 400px;
    .carousel li {
      position: initial;
      padding-bottom: 135px;
    }
  }
  .split-img {
    margin-left: 0;
    flex-direction: column;
    .author-desc {
      padding: 20px;
    }
  }
}
@media (max-width: 768px) {
  .carousel-wrap {
    .author-tit {
      padding-top: 16px;
    }
    .img-box {
      margin: 1.875rem auto;
    }
  }
}
@media (max-width: 640px) {
  .carousel-wrap .img-box > i {
    width: 68px;
    height: 68px;
  }
}
</style>
