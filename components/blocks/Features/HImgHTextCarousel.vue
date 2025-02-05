<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  items: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const autoPlayTime = ref(3000)
const activeIndex = ref(0)
const timer = ref<any>(null)
const featureList: any = props.items || []

// const featureList = computed<any[]>(() => {
//   if (props.featuresArr.length > 0) {
//     return props.featuresArr
//   }
//   return []
// })

const bgImg = 'https://c6.dvdfab.cn/images/product_common/en/download_bg.png'

onMounted(() => {
  if (autoPlayTime.value > 0) {
    nextTick(() => {
      timer.value = setInterval(() => {
        autoPlay()
      }, autoPlayTime.value)
    })
  }
  window.addEventListener('resize', resizeHandle)
  resizeHandle()
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
  window.removeEventListener('resize', resizeHandle)
})

const resizeHandle = () => {
  if (window.innerWidth < 1024) {
    stop()
  }
}

const onMouseover = (index: number) => {
  activeIndex.value = index
  stop()
}
const go = () => {
  if (autoPlayTime.value > 0 && !timer) {
    ;(timer as any).value = setInterval(() => {
      autoPlay()
    }, autoPlayTime.value)
  }
}
const stop = () => {
  clearInterval(timer.value)
  timer.value = null
}
const autoPlay = () => {
  changeTab(activeIndex.value + 1)
}
const changeTab = (index: number) => {
  if (index < 0) {
    index = featureList.length - 1
  } else if (index > featureList.length - 1) {
    index = 0
  }
  activeIndex.value = index
}
</script>

<template>
  <div class="block-box no-bg">
    <BaseContainer>
      <h2 class="fw-bold text-center mb40" v-html="title"></h2>
      <!-- <div v-lazy:background-image="bgImg" class="con"> -->
      <div :style="{ backgroundImage: `url(${bgImg})` }" class="con">
        <div class="left">
          <template v-for="(item, index) in featureList" :key="'feature-2-' + index">
            <div v-show="activeIndex == index" class="img-box">
              <my-img
                :src="item?.media?.data?.attributes?.url"
                :width="item?.media?.data?.attributes?.width"
                :height="item?.media?.data?.attributes?.height"
                :alt="item?.media?.data?.attributes?.alt"
              />
            </div>
          </template>
        </div>
        <div class="right">
          <template v-for="(item, index) in featureList" :key="'block-2-' + index">
            <div class="item-block">
              <div class="item" :class="{ active: index == activeIndex }" @mouseover="onMouseover(index)">
                <div class="icon-box">
                  <i class="iconfont-sg" :class="[item.icon || '']"></i>
                </div>
                <h3 class="sub-title" v-html="item.title"></h3>
                <div class="desc" v-html="item.desc"></div>
              </div>
              <div :key="'feature-2-' + index" class="img-box">
                <my-img
                  :src="item?.media?.data?.attributes?.url"
                  :width="item?.media?.data?.attributes?.width"
                  :height="item?.media?.data?.attributes?.height"
                  :alt="item?.media?.data?.attributes?.alt"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.bg {
  position: absolute;
  top: 0;
  transform: translateX(-50%) translateY(8%);
  width: 800px;
  height: 800px;
  opacity: 0.8;
  padding: 68px;
  border-radius: 50%;
  background: rgba(0, 169, 240, 0.08);
  .bg1,
  .bg2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .bg1 {
    background: rgba(0, 169, 240, 0.08);
    padding: 68px;
  }
  .bg2 {
    background: @primary-color;
  }
}
.con {
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 30px;
  background: #d6f3ff no-repeat;
  background-size: contain;
  border-radius: 30px 0px 30px 0px;
}
.title {
  margin-bottom: 35px;
}
.left {
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 20px;
}
.right {
  width: 45.6%; // 490px
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .img-box {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
.img-box {
  position: relative;
  // padding-top: 66.66%;
  width: 100%;
  overflow: hidden;
  img {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    height: auto;
  }
}
.item-block {
  padding-top: 10px;
  margin-bottom: 20px;
  margin-left: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  .item {
    position: relative;
    padding: 20px 20px 20px 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    color: @base-text-color;
    .sub-title {
      font-size: @font-size-md;
      line-height: 32px;
      margin-bottom: 10px;
    }
    .icon-box {
      position: absolute;
      top: -10px;
      left: 0;
      transform: translateX(-50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      text-align: center;
      line-height: 60px;
      background: @bg-white;
      i {
        font-size: 60px;
        color: @primary-color;
      }
    }
    &.active {
      color: @text-white-color;
      background: @primary-color;
      .icon-box {
        background: #3cc5ff;
        i {
          color: @text-white-color;
        }
      }
    }
  }

  .img-box {
    display: none;
  }
}

@media (max-width: 1024px) {
  .con {
    padding-left: 50px;
  }
  .left {
    display: none;
  }
  .right {
    width: 100%;
  }
  .item-block {
    .item {
      .icon-box {
        // left: 0;
      }
    }
    .img-box {
      display: block;
    }
  }
}
@media (max-width: 640px) {
  .title {
    margin-bottom: 0.5rem;
  }
  padding-top: 0px;
  .item-block {
    padding: 0.625rem 0;
    .item {
      background: @bg-white;
      padding: 1rem 0 1.5rem 0;
      .icon-box {
        display: none;
      }
      h3 {
        margin-bottom: 1rem;
        // font-weight: 700;
      }
    }
    .item.active {
      color: @base-text-color;
      background: @bg-white;
    }
  }
  .con {
    padding: 1.25rem 0;
  }

  .con {
    background-image: none !important;
    background: @bg-white !important;
  }
}
</style>
