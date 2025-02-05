<script setup lang="ts">
const props = defineProps({
  proLine: {
    type: String,
    default: '',
  },
})

const { getPromotionDataCache, resouceData, getBannerEventData } = usePromotion()
getPromotionDataCache()

const bgImg = computed(() => `url(${resouceData.value.img?.url}) no-repeat center center`)

const bgWidth = computed(() => `${resouceData.value.img?.width}px`)
const bgHeight = computed(() => `${resouceData.value.img?.height}px`)

onUnmounted(() => {
  window.removeEventListener('scroll', () => {})
})
</script>

<template>
  <div v-if="resouceData.show" class="text-center resource-banner">
    <a
      v-track:exposure="getBannerEventData('show', 'article_siderbar')"
      v-track:hover="getBannerEventData('hover', 'article_siderbar')"
      v-track:click="getBannerEventData('click', 'article_siderbar', 'open')"
      class="flex h-full resource-banner-content"
      :href="`${resouceData.toUrl}`"
      :target="resouceData.linkTarget ? resouceData.linkTarget : '_self'"
    >
      <div v-if="resouceData?.title" class="flex flex-col items-center justify-center w-full">
        <div v-html="resouceData?.title"></div>
      </div>
    </a>
  </div>
</template>

<style scoped lang="less">
.resource-banner {
  width: v-bind(bgWidth);
  position: relative;
  height: v-bind(bgHeight);
  background: v-bind(bgImg);
  display: flex;
  align-items: center;
  background-size: contain;
  margin: 0 auto;
  a {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    //   width: 100%;
    //   // font-size: v-bind('resouceData.titleStyle.fontSize');
    //   padding-top: v-bind('resouceData.titleStyle.paddingTop');
    //   font-weight: v-bind('resouceData.titleStyle.fontWeight');
    //   color: v-bind('themeData.themeColor');
    // }
    // :deep(a) {
    //   b,
    //   span {
    //     color: v-bind('resouceData.titleStyle.spanColor');
    //   }
  }
}
</style>
