<script setup lang="ts">
const {
  getPromotionDataCache,
  floatData,
  isFloatBannerShow,
  twoScreentwoShowFloatBanner,
  getBannerEventData,
} = usePromotion()
getPromotionDataCache()

const visible = ref<boolean>(false)

const handleClose = () => {
  // useCookie(`close_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`, {
  //   maxAge: 60 * 60 * 24 * 7,
  // }).value = 'close'
  clientSetCookie(
    `close_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`,
    'close',
    7,
  )
  // session周期内 活动关闭,其他float_banner 活动不再显示
  clientSetCookie('close_float_banner_session', 'close', 7)

  // useCookie(`close_float_banner_session`).value = 'close'
  visible.value = false
}

const goPromotion = () => {
  const popCookieName = `pop_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`
  clientSetCookie(popCookieName, 'click', 7)
  // useCookie(`pop_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`, {
  //   maxAge: 60 * 60 * 24 * 7,
  // }).value = 'click'
  const closeCookieName = `close_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`
  clientSetCookie(closeCookieName, 'close', 1)
  // useCookie(`close_${useStore.promotion().productLine}_${useStore.promotion().cookieSuffix}`, {
  //   maxAge: 60 * 60 * 24 * 1,
  // }).value = 'close'
}
const getVisible = () => {
  visible.value = isFloatBannerShow.value
}
const bgImg = computed(() => `url(${floatData.value.img?.url}) no-repeat center center`)

const bgWidth = computed(() => `${floatData.value.img?.width}px`)
const bgHeight = computed(() => `${floatData.value.img?.height}px`)

if (!twoScreentwoShowFloatBanner.value) {
  getVisible()
}

onMounted(() => {
  if (twoScreentwoShowFloatBanner.value) {
    if (window.scrollY > 150) {
      getVisible()
    }
    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > 150) {
        getVisible()
      } else {
        visible.value = false
      }
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {})
})
</script>

<template>
  <div v-if="floatData.show" data-style="6e452cea-3936-49cd-80ba-876e867ea2e0">
    <header v-if="visible" class="fixed left-30 bottom-54 z-1000 text-center float-banner">
      <i
        v-track:click="getBannerEventData('click', 'floater', 'close')"
        v-track-label="'float_banner_close'"
        class="cursor-pointer absolute close-icon iconfont-sg icon-close-fill"
        @click="handleClose"
      ></i>
      <a
        v-track:exposure="getBannerEventData('show', 'floater')"
        v-track:hover="getBannerEventData('hover', 'floater')"
        v-track:click="getBannerEventData('click', 'floater', 'open')"
        class="flex h-full float-banner-content"
        :href="`${floatData.toUrl}`"
        :target="floatData.linkTarget ? floatData.linkTarget : '_self'"
        @click="goPromotion"
      >
        <div v-if="floatData?.title" class="flex flex-col items-center w-full">
          <div v-html="floatData?.title"></div>
        </div>
        <div
          v-if="floatData.btnShow"
          class="button flex items-center justify-center"
          v-html="floatData.btnText"
        ></div>
      </a>
    </header>
  </div>
</template>

<style scoped lang="less">
.float-banner {
  width: v-bind(bgWidth);
  height: v-bind(bgHeight);
  background: v-bind(bgImg);
  display: flex;
  align-items: center;
  background-size: contain;

  .close-icon {
    font-size: v-bind('floatData.closeIconStyle?.fontSize');
    top: v-bind('floatData.closeIconStyle.top');
    right: v-bind('floatData.closeIconStyle.right');
    color: v-bind('floatData.closeIconStyle?.color');
    line-height: 1;
    &:hover {
      color: v-bind('floatData.closeIconStyle.hoverColor');
    }
  }
  a {
    width: 100%;
    font-size: v-bind('floatData.titleStyle?.fontSize');
    padding-top: v-bind('floatData.titleStyle?.paddingTop');
    font-weight: v-bind('floatData.titleStyle?.fontWeight');
    color: v-bind('floatData.titleStyle?.color');
  }
  :deep(a) {
    b,
    span {
      color: v-bind('floatData.titleStyle?.spanColor');
    }
  }
  .button {
    position: absolute;
    bottom: v-bind('floatData?.btnStyle?.bottom');
    left: v-bind('floatData?.btnStyle?.left');
    height: v-bind('floatData?.btnStyle?.height');
    padding: 0 10px;
    min-width: v-bind('floatData?.btnStyle?.minWidth');
    background: v-bind('floatData?.btnStyle?.bgColor');
    border: v-bind('floatData?.btnStyle?.border');
    border-radius: 50px;
    color: v-bind('floatData?.btnStyle?.color');
    font-size: v-bind('floatData?.btnStyle?.fontSize');
    box-shadow: v-bind('floatData?.btnStyle?.boxShadow');

    &:hover {
      background: v-bind('floatData?.btnStyle?.hoverBgColor');
    }
  }
}
</style>
