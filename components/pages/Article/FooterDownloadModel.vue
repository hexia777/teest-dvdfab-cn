<script lang="ts" setup>
const props = defineProps({
  baseBannerContent: {
    type: String,
    default: '',
  },
  downloadUrl: { type: String, default: '' },
  pid: { type: [String, Number], default: '' },
  type: {
    type: String,
    default: 'resource',
  },
})

const isMobile = useStore.common().mobile
const client = useOs().value
const freeDownload = useI18n().value.common.free_download

const openFlag = ref(true)
const closeD = ref(false)
const showTopic = ref(false)
const footerDownloadStarttime = useCookie('footer_download_starttime')

onMounted(() => {
  if (!isMobile) {
    window.addEventListener('scroll', pageScrollSpec)
  }
  openFlag.value = true
  // 获取cookies
  if (footerDownloadStarttime.value) {
    const currentTime = new Date().valueOf()
    openFlag.value = (currentTime - Number(footerDownloadStarttime.value)) / 7 > 86400000
  }
})

onBeforeUnmount(() => {
  if (!isMobile) {
    window.removeEventListener('scroll', pageScrollSpec)
  }
})

const pageScrollSpec = () => {
  // 滚动条卷去高度
  // if (!document.querySelector('.fixed-down')) {
  //   return
  // }

  const scrollH = document.body.scrollTop || document.documentElement.scrollTop

  const bannerH =
    (document.querySelector('.art-top-banner')
      ? document.querySelector('.art-top-banner')?.clientHeight
      : document.querySelector('.b-iframe-box')?.clientHeight) || 0

  // const bannerH = 200
  if (scrollH >= bannerH && !closeD.value) {
    showTopic.value = true
  } else {
    showTopic.value = false
  }
}
const close = () => {
  if (!document.querySelector('.fixed-down')) {
    return
  }
  // 设置cookies，七天内不再弹窗
  footerDownloadStarttime.value = String(new Date().valueOf())
  showTopic.value = false
  closeD.value = true
}
</script>
<template>
  <div v-if="openFlag && showTopic" id="article-bottom-down" class="fixed-down tc">
    <p class="mr16" v-html="baseBannerContent"></p>

    <MyButtonDownload
      class="btn-download"
      :label="freeDownload"
      :href="downloadUrl"
      size="normal"
      icon="icon-download font-size-20 font-normal"
      theme="yellow"
      :data-warden-ck-parm="
        base64Encode({
          event_value: props.type,
          event_label: `page_basebanner`,
          pids: [pid],
        })
      "
    />

    <i
      v-track:click="{
        event: 'click',
        xargs_event_category: 'close_resourcepage_basebanner',
      }"
      class="iconfont-sg icon-close-line"
      data-vars-event="close_resourcepage_basebanner"
      @click="close"
    ></i>
  </div>
</template>
<style lang="less">
.fixed-down {
  height: 50px;
  background-image: linear-gradient(to right, #ff53b0 0%, #ff4c4c 100%);
  // border: 1px solid rgba(121, 121, 121, 1);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  // display: none;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 20px;
    display: inline-block;
    color: #fff;
    line-height: 50px;
    white-space: nowrap;
    span {
      color: #ff0;
    }
  }
  .btn-download {
    color: #909;
    background: linear-gradient(90deg, #ffd905, #ffe56d);
    transition: none;
    span {
      color: rgb(255, 77, 98);
    }

    &:hover {
      box-shadow: none;
      background: #fc0;
    }
  }
  .icon-c-download {
    color: rgb(255, 77, 98);
    font-size: 20px;
  }
  .icon-close-line {
    color: #fff;
    font-size: 30px;
    position: absolute;
    right: 10px;
    top: 5px;
  }
}

.lang-de {
  .fixed-down {
    a {
      width: 236px;
    }
  }
}
@media (max-width: 1024px) {
  .fixed-down {
    p {
      font-size: @font-size-sm;
    }
  }
}

@media (max-width: 768px) {
  .fixed-down {
    display: none;
  }
}
</style>
