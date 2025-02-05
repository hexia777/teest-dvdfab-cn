<script setup lang="ts">
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'streamfab',
  },
  textTheme: {
    type: String,
    default: 'dark',
  },
  // 产品信息
  proInfo: {
    type: Object,
    default: () => {},
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // banner 按钮组信息
  btnList: {
    type: Array,
    default: () => [],
  },
  // 可播放视频的链接
  videoSrc: {
    type: String,
    default: '',
  },
  priceGiftInfo: {
    type: Object,
    default: () => {},
  },
})

// computed
const osText: ComputedRef = computed(() => {
  return useOs().value
})

const showVideo = ref<boolean>(false)

const playVideo = () => {
  showVideo.value = true
}
const closeMask = () => {
  showVideo.value = false
}
</script>
<template>
  <PagesProductTopBanner v-bind="{ ...props, ...$attrs }">
    <template #middle>
      <div class="flex mb40">
        <PagesProductGiftBox v-bind="priceGiftInfo" />
      </div>
    </template>
    <template #img-extra>
      <div v-if="videoSrc" class="video-box flex-center b-rd-100%" @click="playVideo">
        <i class="iconfont-sg icon-circle-play font-size-48"></i>
      </div>
      <div v-show="showVideo" class="mask_video" @click="closeMask">
        <div class="mask_video_ai tc">
          <div style="padding-top: 64.28%">
            <iframe
              v-if="videoSrc"
              :src="videoSrc"
              width="1000"
              height="700"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
              class="iframe_mask"
              title="vimeo"
              :lazy="false"
            ></iframe>
          </div>
        </div>
      </div>
    </template>
  </PagesProductTopBanner>
</template>
<!-- 弹窗 -->
<style lang="less" scoped>
.video-box {
  width: 94px;
  height: 94px;
  color: @primary-color;
  border: 8px solid @bg-sf-color;
  background-color: #b9e4fc;
  cursor: pointer;
  transition: background-color 0.1s;
  position: absolute;
  right: 0;
  &:hover {
    background-color: #92d6fa;
  }
}
.mask_video {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 111;
  left: 0;
  top: 0;
  .mask_video_ai {
    width: 98%;
    max-width: 700px;
    position: absolute;
    top: 36%;
    left: 44%;
    transform: translateX(-50%) translateY(-50%);
  }
  iframe {
    width: 900px;
    height: 700px;
  }
}
</style>
