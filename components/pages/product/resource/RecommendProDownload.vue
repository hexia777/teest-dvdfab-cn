<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  desc: {
    type: String,
    default: '',
  },
  btnText: {
    type: String,
    default: '',
  },
  bgImg: {
    type: String,
    default: '',
  },
  downloadUrl: {
    type: String,
    default: '',
  },
  routeName: {
    type: String,
    default: '',
  },
  pid: {
    type: [String, Number],
    default: '',
  },
})

const isMac = computed(() => {
  return useOs().value === 'mac'
})
</script>

<template>
  <div :style="`background-image: url(${bgImg});`" class="recommend-pro-download">
    <!-- <div v-show="!useStore.common().mobile" class="pl24 pr24"> -->
    <div class="pl24 pr24 recommend-pro-cont">
      <div class="slidebar-title pb4 font-700" :class="isMac ? 'fonts24' : 'fonts32'" v-html="title"></div>
      <p class="slidebar-desc pb8" v-html="desc"></p>
      <MyButtonDownload
        :show-icon="false"
        :label="btnText"
        :href="downloadUrl"
        size="medium"
        theme="orange"
        :data-warden-ck-parm="
          base64Encode({
            event_value: routeName,
            event_label: 'sidebar2',
            pids: [pid],
          })
        "
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.recommend-pro-download {
  position: relative;
  width: 340px;
  height: 480px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .recommend-pro-cont {
    position: absolute;
    bottom: 24px;
    text-align: center;
    color: #fff;
  }
  .slidebar-title {
    color: #ffffff;
    text-stroke: 1px #fb4a92;
    -webkit-text-stroke: 1px #fb4a92;
    line-height: 1.2;
  }
  .fonts32 {
    font-size: 32px;
  }
  .fonts24 {
    font-size: 24px;
  }
  .slidebar-desc {
  }
}

@media (max-width: @screen-xl) {
  .recommend-pro-download {
    width: 100%;
    aspect-ratio: 17 / 24;
    .slidebar-title {
      font-size: 24px;
    }
  }
}
</style>
