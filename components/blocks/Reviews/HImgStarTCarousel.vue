<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg bg-normal' }
    },
  },
  items: {
    type: Array,
    default: () => [],
  },
  bottomLink: {
    type: Object,
    default: () => {
      return {
        label: '',
        url: '',
      }
    },
  },
})

const feedBacksList = computed(() => {
  if (props.items && props.items.length) {
    return props.items
  }

  const list = []
  return list
})

const refCarousel = ref(null)

const isMobile = useStore.common().mobile

const stop = () => {
  refCarousel.value.stop()
}

const go = () => {
  refCarousel.value.go()
}

const carouselItemsHover = (index) => {
  refCarousel.value.carouselItemsHover(index)
}

const carouselItemsClick = (index) => {
  refCarousel.value.carouselItemsClick(index)
}
</script>

<template>
  <div v-if="feedBacksList.length > 0" class="feedbacks-new block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 class="main-title title2 pb40 text-center" v-html="title"></h2>
      <template v-if="isMobile">
        <template v-for="(item, index) in feedBacksList" :key="index + 'mobile_author'">
          <div class="feedbacks-down-new feedbacks-down-m">
            <div class="text-center">
              <a v-if="item.url" :href="item.url" rel="nofollow" target="_blank">
                <MyImg
                  :src="getStrapiData(item.media)?.url"
                  layout="responsive"
                  :alt="getStrapiData(item.media)?.name"
                  class="lazy-loading-status img"
                />
              </a>
              <MyImg
                v-else
                :src="getStrapiData(item.media)?.url"
                layout="responsive"
                :alt="getStrapiData(item.media)?.name"
                class="lazy-loading-status img"
              />
            </div>
            <div class="img-box text-center">
              <i
                v-for="i in 5"
                :key="i"
                :class="{ active: i <= item.value }"
                class="iconfont-sg icon-star"
              ></i>
            </div>
            <p class="author-desc text-center" v-html="item.desc"></p>
          </div>
        </template>
      </template>
      <div v-else class="feedbacks-down-new pb40">
        <BaseCarousel
          ref="refCarousel"
          :dom-id="'feedbacks-carousel'"
          :list-prop="feedBacksList"
          layout="responsive"
          width="780"
          height="220"
          delay="3000"
          arrow="never"
          indicator-position="outside"
          style="height: 250px"
        >
          <template #item="{ item }">
            <div class="bg bg-flex">
              <div class="f-lf">
                <a v-if="item.url" :href="item.url" rel="nofollow" target="_blank">
                  <MyImg
                    :src="getStrapiData(item.media)?.url"
                    layout="responsive"
                    item-type="no_block"
                    :alt="getStrapiData(item.media)?.name"
                    class="lazy-loading-status img"
                  />
                </a>
                <MyImg
                  v-else
                  :src="getStrapiData(item.media)?.url"
                  layout="responsive"
                  :alt="getStrapiData(item.media)?.name"
                  class="lazy-loading-status img"
                />
                <div class="img-box">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="{ active: i <= item.value }"
                    class="iconfont-sg icon-star"
                  ></i>
                </div>
              </div>
              <div class="f-rt">
                <p v-html="item.desc"></p>
              </div>
            </div>
          </template>
          <template #indicator="indicatorProps">
            <span
              class="name-item"
              :class="{ active: indicatorProps.index === indicatorProps.currentIndex }"
              @mouseenter="stop"
              @mouseleave="go"
              @mouseover="carouselItemsHover(indicatorProps.index)"
              @click="carouselItemsClick(indicatorProps.index)"
            >
              {{ indicatorProps.item.title }}
            </span>
          </template>
        </BaseCarousel>
      </div>
      <div v-if="bottomLink.url" class="more-btn-wrap pt40 flex-center">
        <a :href="bottomLink.url" v-html="bottomLink.label"></a>
      </div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.author-desc {
  padding: 10px 5px;
  padding-bottom: 30px;
}
.feedbacks-new {
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  &.mobile {
    .img-box,
    .author-desc {
      text-align: center;
    }
  }
  .bg-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    .bg-white-opacity(0.9);
    padding: 20px 0;
  }
  .f-lf {
    position: relative;
    text-align: center;
    padding-top: 25px;
    padding-right: 30px;
    padding-bottom: 25px;
    border-right: 1px solid @border-gray1;
  }
  .img-box {
    padding-top: 6px;
    .iconfont-sg.icon-star {
      font-size: @font-size-md;
      margin-right: 12px;
      &.active {
        color: #ffbf13;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .f-rt {
    flex: 1;
    padding-left: 30px;
    p {
      font-size: @font-size-sm;
      color: @base-text-color;
      line-height: @base-line-height;
    }
  }
}

:deep(.feedbacks-down-new) {
  margin: 0 auto;
  .bg {
    padding: 20px 30px;
    border-radius: @b-radius-sm;
  }
  .author-tit {
    padding-top: 50px;
    font-size: @font-size-md;
    font-weight: bold;
    line-height: 26px;
  }
  .carousel-items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    bottom: -40px;
    span {
      display: inline-block;
      cursor: pointer;
      width: 198px;
      height: 48px;
      line-height: 48px;
      margin: 0;
      border-radius: @b-radius-md;
      color: @base-text-color;
      .bg-white-opacity(0.5);
      font-size: @font-size-sm;
      font-weight: bold;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
    .active {
      position: relative;
      border-radius: @b-radius-md;
      color: @primary-text-color;
      background: @bg-white;
      &:after {
        content: '';
        position: absolute;
        top: -10px;
        margin-left: -10px;
        left: 50%;
        border: 0 solid transparent;
        border-bottom-color: @primary-color;
        width: 0;
        height: 0;
        border-left: 10px solid transparent; /* 左边框 */
        border-right: 10px solid transparent; /* 右边框 */
        border-bottom: 10px solid @primary-color; /* 这是三角形的宽度 */
      }
    }
  }
}
.more-btn-wrap {
  a {
    font-size: @font-size-sm;
    color: @link-text-color;
    line-height: @base-line-height;
    &:hover {
      text-decoration: underline;
      color: @btn-primary-color-h;
    }
  }
}
@media (max-width: 1024px) {
  :deep(.feedbacks-down-new) .carousel-wrap {
    min-height: 250px !important;
    height: auto !important;
    .carousel li {
      position: relative;
    }
    .bg-flex {
      padding: 20px;
      flex-direction: column;
      .f-lf,
      .f-rt {
        padding: 0;
      }
      .f-lf {
        border-right: none;
      }
    }
    .carousel-items {
      position: relative;
      .name-item {
        margin: 0;
      }
    }
  }
}
@media (max-width: 660px) {
  .feedbacks-new .main-title {
    padding-bottom: 20px !important;
  }
}
</style>
