<script setup lang="ts">
defineOptions({ name: 'TitleTextMedia' })
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 大标题
  title: {
    type: String,
    default: '',
  },
  // 描述
  desc: {
    type: String,
    default: '',
  },
  // 视频信息
  videoInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

let clientData = reactive<any>({})
let viedosDom = reactive<any>(null)
const videoOffsetTop = ref<number>(0)
const videoOffsetHeight = ref<number>(0)

onMounted(() => {
  initVideoFunc()
})

// 初始化视频播放暂停
const initVideoFunc = () => {
  if (!props.videoInfo?.data?.attributes?.url) {
    return
  }
  clientData = getViewport() // 获取可视区的大小
  viedosDom = document.getElementById('videoEl') || ''
  videoOffsetTop.value = viedosDom.offsetTop
  videoOffsetHeight.value = viedosDom.offsetHeight
  viedosDom.style.borderRadius = '20px'
  playVideo()
  window.addEventListener('scroll', playVideo)
}

// 获取视口宽高
const getViewport = () => {
  if (document.compatMode === 'BackCompat') {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    }
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }
  }
}

// 视频dom出现在视口才播放
const playVideo = () => {
  const scrollTop: number =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  if (
    viedosDom &&
    viedosDom.src &&
    scrollTop >= videoOffsetTop.value - clientData.height + videoOffsetHeight.value &&
    scrollTop <= videoOffsetTop.value + videoOffsetHeight.value
  ) {
    viedosDom.play()
  } else if (viedosDom) {
    viedosDom.pause()
  }
}
const videoUrl = props.videoInfo?.data?.attributes?.url
</script>

<template>
  <div class="block-box" :class="[blockClass?.value]">
    <BaseContainer>
      <h2 class="font-s-40 mb-20 text-center title2" v-html="title"></h2>
      <p class="mb-40 text-center" v-html="desc"></p>
      <div v-if="videoUrl" id="mediaBox" class="features-video">
        <video id="videoEl" :width="680" :src="videoUrl" class="video-box" muted
loop>
          <source :src="videoUrl" type="video/*" v-html="videoInfo?.data?.attributes?.alternativeText" />
        </video>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.features-video {
  max-width: 680px;
  display: flex;
  justify-content: center;
  margin: auto;
  .video-box {
    object-fit: fill;
    height: 400px;

    @media screen and (max-width: 640px) {
      width: 100%;
      height: auto;
    }
  }
}
.features-box {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .features-title {
    position: relative;
    text-align: center;
  }
}
</style>
​
