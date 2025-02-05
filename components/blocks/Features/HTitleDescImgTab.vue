<script setup lang="ts">
const props = defineProps({
  // h 标题
  title: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
})
const activeIndex = ref<number>(0)
const onHover = (index: number) => {
  activeIndex.value = index
}
const mobile = useStore.common().mobile
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <!-- 主标题 -->
      <h2 v-if="title" class="mb-40 text-center primary" v-html="title"></h2>
      <!-- tab导航 -->
      <div v-if="items && items?.length" class="tab-box">
        <ul v-if="!mobile" class="tab-nav-list mb40">
          <li
            v-for="(item, index) in items"
            :key="'nav' + index"
            class="tab-nav-item"
            :class="{ active: activeIndex === index }"
            @mouseover="onHover(index)"
          >
            <span v-if="item.nav" class="feature-card-tab-item" v-html="item.nav"></span>
          </li>
        </ul>
        <!-- tab内容 -->
        <section>
          <div
            v-for="(item, index) in items"
            v-show="activeIndex === index || mobile"
            :key="index"
            :class="{ active: activeIndex === index }"
          >
            <div v-show="mobile" class="feature-card-tab-item-mobile" v-html="item.nav"></div>
            <pages-product-features
              :has-h2-title="title"
              :img-title="item.title"
              :img-desc="item.desc"
              :width="item.media?.data?.attributes?.width"
              :height="item.media?.data?.attributes?.height"
              :img-alt="item?.mediaAlt"
              :img-url="item.media?.data?.attributes?.url"
              :style="{
                fontSize: 24,
              }"
            />
          </div>
        </section>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.block-features {
  @apply flex-center;
  .features-title {
    position: relative;
    text-align: center;
  }
}
// tab导航
.tab-nav-list {
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    background-color: @primary-color;
  }

  .tab-nav-item {
    min-width: 280px;
    margin-right: 10px;
    padding: 8px 10px;
    cursor: pointer;
    background: #f4f4f4;
    border-radius: 10px 10px 0 0;
    text-align: center;

    &.active,
    &:hover {
      color: #fff;
      background: @primary-color;
    }

    .feature-card-tab-item {
      @apply font-size-18;
      text-align: center;
    }
  }
}

@media (max-width: @screen-xxl) {
  .tab-nav-list {
    flex-wrap: wrap;
    justify-content: flex-start;

    &::after {
      bottom: 10px;
    }

    .tab-nav-item {
      margin-bottom: 10px;
    }
  }
}
@media (max-width: @screen-xl) {
  .tab-content-item {
    flex-wrap: wrap;

    .tab-content-box {
      flex: auto;
      text-align: center;
    }

    .tab-img-box {
      margin: 10px auto;
    }
  }
  .tab-box {
    text-align: center;
  }
  .feature-card-tab-item-mobile {
    font-weight: 700;
    text-align: center;
    font-size: 18px;
    color: @primary-color;
  }
  :deep(.features-index) {
    padding-top: 30px;
    padding-bottom: 10px;
  }
}

// 兼容移动端
@media (max-width: @screen-md) {
  .tab-nav-list {
    display: none;
  }
  // 整体布局
  .tab-hover-card-wrapper {
    padding-top: 50px;
    padding-bottom: 60px;
  }

  // 标题
  .feature-card-sub-title {
    line-height: 1.5;
    margin-bottom: 30px;
  }

  // tab内容
  .tab-content-item {
    min-height: auto;

    .tab-content-box {
      .tab-title {
        margin-top: 0;
        line-height: 1.2;
        font-size: 18px;
      }
    }
  }
}

@media (max-width: @screen-sm) {
  .tab-hover-card-wrapper {
    padding: 1rem 5% 1rem;
  }
  .feature-card-sub-title {
    margin-bottom: 0px;
  }
  .mobile-tab-nav-title {
    display: none;
  }
  .tab-content-item {
    padding-top: 1.2rem;
    .tab-img-box {
      width: 100%;
      padding: 0 5% !important;
    }
    .tab-content-box {
      .tab-title,
      .tab-text {
        text-align: left;
      }
    }
  }
}
</style>
