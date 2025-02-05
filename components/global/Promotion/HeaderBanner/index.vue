<script setup lang="ts">
const { getPromotionDataCache, getBannerEventData, handleCloseHeaderBanner, headData, isHeaderBannerShow } =
  usePromotion()
getPromotionDataCache()

const isMobile = useStore.common().mobile
let title = headData.value.title
if (isMobile && headData.value.mobileTitle) {
  title = headData.value.mobileTitle
}
const bgImg = computed(() => `url(${headData.value.img?.url}) no-repeat center`)

const isShowHeadBanner = computed(() => isHeaderBannerShow.value)
</script>

<template>
  <aside
    v-if="headData.show && isShowHeadBanner"
    id="promotion-header-banner"
    class="relative text-center header-banner"
    :class="{ 'm-header-banner': isMobile }"
  >
    <i
      v-if="!isMobile"
      v-track:click="getBannerEventData('click', 'header', 'close')"
      v-track-label="'coupon_header_banner'"
      class="font-size-30 cursor-pointer absolute top-50% right-56 z-1 translate-y--50% iconfont-sg icon-close-line"
      @click="handleCloseHeaderBanner()"
    ></i>
    <a
      v-track:exposure="getBannerEventData('show', 'header', '')"
      v-track:hover="getBannerEventData('hover', 'header', '')"
      v-track:click="getBannerEventData('click', 'header', 'open')"
      class="promotion-title flex h-full"
      :href="`${headData.toUrl}`"
      :target="headData.linkTarget ? headData.linkTarget : '_self'"
    >
      <BaseContainer class="flex-1">
        <div class="flex items-center justify-center header-banner-inner">
          <div class="inline-block max-w-860" v-html="title"></div>
          <span v-if="!isMobile" class="min-w-190 pt6.5 pb6.5 b-rd-30 ml60 header-banner-btn">
            {{ headData.btnText }}
          </span>
        </div>
      </BaseContainer>
    </a>
  </aside>
</template>
<style lang="less">
// playerfab 产品头部 banner 样式
[data-glob-promotion-name='playerfab'] {
  .header-banner {
    &:not(.m-header-banner) a {
      span {
        font-size: 18px;
      }
    }
    .max-w-860 {
      width: 80%;
      padding-left: 250px;
    }
  }
  @media (max-width: 1024px) {
    .header-banner {
      .max-w-860 {
        width: 100%;
        padding-left: 0;
      }
    }
  }
}
</style>
<style scoped lang="less">
.header-banner {
  font-size: @font-size-28;
  background: v-bind('bgImg');
  background-color: v-bind('headData?.bgColor');

  .icon-close-line {
    color: v-bind('headData?.closeIconStyle?.color');
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 32px;
    width: 32px;
    height: 32px;
    background-color: v-bind('headData?.closeIconStyle?.backgroundColor');
    font-weight: 500;
    &:hover {
      color: v-bind('headData?.closeIconStyle?.hoverColor');
      background-color: v-bind('headData?.closeIconStyle?.hoverBackgroundColor');
    }
  }

  .header-banner-inner {
    height: @promotion-height;
  }

  a {
    color: v-bind('headData.titleStyle?.color');
    // font-weight: v-bind('themeData.fontWeight');
  }
  :deep(.promotion-title) {
    b,
    span {
      color: v-bind('headData.titleStyle?.spanColor');
    }
  }

  .promotion-title .header-banner-btn {
    font-size: v-bind('headData.btnStyle?.fontSize');
    border: v-bind('headData.btnStyle?.border');
    background: v-bind('headData.btnStyle?.background');
    color: v-bind('headData.btnStyle?.color');
  }
  &:not(.m-header-banner) {
    a {
      line-height: 1;
    }
  }
}

.m-header-banner {
  @apply font-size-21;
  background: none;
  background-color: v-bind('headData?.bgColor');
  .header-banner-inner {
    height: @promotion-height;
  }
}
@media (max-width: 1024px) {
  .header-banner {
    .icon-close-line,
    .header-banner-btn {
      display: none;
    }
  }
}
@media (max-width: 640px) {
  .m-header-banner.header-banner {
    @apply font-size-16;
  }
}
</style>
