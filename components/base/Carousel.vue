<script setup>
const props = defineProps({
  id: {
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
  listProp: {
    type: Array,
    default: () => [],
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
})

const emit = defineEmits(['changeTab'])

const state = reactive({
  currentIndex: 0,
  timer: null,
  isPre: false,
  bodyWidth: 0,
  maxH: 0,
  setCarouselHeightNum: 0,
  list: props.listProp,
})

const { currentIndex, isPre, maxH, list } = toRefs(state)

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
    index = list.value.length - 1
  } else if (index > list.value.length - 1) {
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

const carouselItemsHover = (index) => {
  if (props.trigger === 'hover') {
    selfChange(index)
  }
}

const carouselItemsClick = (index) => {
  if (props.trigger === 'click') {
    selfChange(index)
  }
}

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
  const carousel = document.querySelector('#' + props.id)
  if (carousel) {
    const carouselItems = carousel.querySelectorAll('li')
    let maxH = 0
    for (let i = 0; i < carouselItems.length; i++) {
      if (carouselItems[i].clientHeight > maxH) {
        maxH = carouselItems[i].clientHeight
      }
    }
    if (
      String(maxH) !== carousel.style.height.replace('px', '') &&
      maxH < 400 &&
      state.setCarouselHeightNum < 3
    ) {
      state.setCarouselHeightNum++
      setTimeout(() => {
        setCarouselHeight()
      }, 5000)
    }
    if (parseInt(maxH, 10) === 0) {
      maxH = 378
    }
    if (carousel.id === 'guide-carousel-mac') {
      maxH = 650
    }
    if (carousel.id === 'guide-mac-max-height') {
      maxH = 801
    }
    state.maxH = maxH
    carousel.style.height = maxH + 'px'
  }
}

onMounted(() => {
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
watchEffect(() => {
  if (!props.applyHeight) {
    setCarouselHeight()
  }
})

onBeforeUnmount(() => {
  stop() // 清除定时器
})

// 暴露方法
defineExpose({
  stop,
  go,
  carouselItemsHover,
  carouselItemsClick,
})
</script>

<template>
  <div :id="id" class="carousel-wrap" :class="{ pre: isPre }">
    <div class="content">
      <transition-group tag="ul" class="carousel" name="list">
        <li
          v-for="(item, index) in list"
          v-show="!maxH || index === currentIndex"
          :key="index"
          :class="{ padding: padding }"
          :style="maxH || index === currentIndex ? '' : 'display: none;'"
          @mouseenter="stop"
          @mouseleave="go"
        >
          <slot name="item" :item="{ index, ...item }"></slot>
        </li>
      </transition-group>
    </div>
    <template v-if="arrow == 'always'">
      <div class="icon_cursor swiper_icon_left" @click="arrowClick('left')">
        <i class="swiper_pre default"></i>
        <i class="swiper_next_hover hover"></i>
      </div>
      <div class="icon_cursor swiper_icon_right" @click="arrowClick('right')">
        <i class="swiper_pre default"></i>
        <i class="swiper_next_hover hover"></i>
      </div>
    </template>
    <div v-if="indicatorPosition != 'none'" class="carousel-items">
      <template v-for="(item, index) in list.length">
        <slot name="indicator" :item="list[index]" :index="index" :current-index="currentIndex">
          <span
            :key="'carousel-items-' + index"
            :class="[list[index].class, { active: index === currentIndex }]"
            @mouseenter="stop"
            @mouseleave="go"
            @mouseover="carouselItemsHover(index)"
            @click="carouselItemsClick(index)"
          >
            {{ list[index].class }}
          </span>
        </slot>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.carousel-wrap {
  position: relative;
  height: 450px;
  width: 100%;
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
      padding: 0 10%;
    }

    position: absolute;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
    }
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

.icon_cursor {
  position: absolute;
  top: 30%;
  z-index: 3;
}

.swiper_icon_left {
  left: 0;

  .swiper_pre {
    transform: rotate(0deg);
  }

  .hover {
    transform: rotate(180deg);
  }
}

.swiper_icon_right {
  right: 0;

  .swiper_pre {
    transform: rotate(180deg);
  }

  .hover {
    transform: rotate(0deg);
  }
}

@media (max-width: 640px) {
  .swiper_icon_right .swiper_pre,
  .swiper_icon_left .swiper_pre {
    scale: 0.7;
  }
}
</style>
