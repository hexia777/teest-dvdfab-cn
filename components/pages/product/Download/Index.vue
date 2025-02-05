<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'module', // module, banner
  },
  info: {
    type: Object,
    default: () => {
      return {
        qrCode: {},
        googlePay: {},
        download: {},
      }
    },
  },
})
const isMobile = useStore.common().mobile
const moduleClass = ref('')
watchEffect(() => {
  moduleClass.value = props.type === 'module' ? '' : 'banner-style'
})
</script>

<template>
  <div class="download-module flex-center" :class="moduleClass">
    <BaseContainer>
      <div class="download-btn-list flex">
        <div v-if="!isMobile" class="vr-code-con">
          <div class="vr-code-con">
            <MyImg
              :src="info.qrCode?.img?.url"
              :loading="props.type === 'module' ? 'lazy' : ''"
              :width="100"
              :height="100"
              :alt="info.qrCode?.desc"
            />
          </div>
          <div class="tips mt8">{{ info.qrCode?.desc }}</div>
        </div>
        <span v-if="!isMobile" class="line"></span>
        <div class="max-w-350 flex-center dicrection-clomns fix-top">
          <a
            v-track:click="info.googlePay?.elkParams || {}"
            :e-click="JSON.stringify(info.googlePay?.elkParams)"
            :href="info.googlePay?.link"
            target="_blank"
            class="google-play"
          >
            <MyImg
              :src="info.googlePay?.img"
              :loading="props.type === 'module' ? 'lazy' : ''"
              :width="166"
              :height="39"
              :alt="''"
            />
          </a>
          <span v-if="info.googlePay.desc" class="tips deep-link-white" v-html="info.googlePay.desc"></span>
        </div>
        <span class="line"></span>
        <div class="fix-top">
          <MyButtonDownload
            :data-vars-dpid="info.download.pid"
            :href="info.download.link"
            :label="info.download.label"
            :icon="'icon-android-filled'"
            :os-version="info.download.osVersion"
            :theme="props.type === 'module' ? 'border' : 'white'"
          />
          <span v-if="info.download.safeText" class="tips text-center" v-html="info.download.safeText"></span>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.download-module {
  background: linear-gradient(135deg, #fdf8f3 0%, #f6fbef 100%);
  &.banner-style {
    background: rgba(0, 0, 0, 0.1);
    padding: 32px 0;
    .line {
      background: rgba(255, 255, 255, 0.5);
    }
    .tips {
      color: #fff;
    }
  }
  .fix-top {
    padding-top: 11px;
    align-self: flex-start;
  }
  .download-btn-list {
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    > div {
      max-width: 350px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
  .line {
    width: 1px;
    height: 80px;
    background: rgba(0, 0, 0, 0.1);
  }
  .tips {
    font-size: @font-size-xs;
    color: @text-gray-color;
    line-height: 20px;
  }
  .vr-code-con {
    text-align: center;
  }
  .vr-code-txt {
    display: block;
    width: 128px;
    text-align: center;
    font-size: 12px;
    padding: 10px 0;
  }
  .google-play {
    display: flex;
    padding: 11px 55px;
    align-items: center;
    width: 278px;
    height: 66px;
    background: #000;
    border-radius: 33px;
    &:hover {
      background: #3b5159;
    }
  }
  .free-down {
    display: block;
    width: 278px;
    height: 66px;
    line-height: 66px;
    border-radius: 33px;
    background-color: #fff;
    color: rgba(0, 169, 240, 1);
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding-top: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    .hover {
      display: none;
    }
    &:hover {
      background-color: rgba(0, 169, 240, 1);
      color: #fff;
      .hover {
        display: block;
      }
      .default {
        display: none;
      }
    }
    .row-1 {
      height: 24px;
      line-height: 24px;
      > i {
        position: relative;
        top: 4px;
      }
    }
  }
  .free-txt1 {
    height: 24px;
    line-height: 24px;
    font-size: 18px;
  }
  .free-txt2 {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    font-weight: normal;
  }
  .icon-30 {
    width: 35px;
    height: 35px;
    scale: 0.7;
  }
  .icon-p100 {
    width: 38px;
    height: 38px;
    scale: 0.8;
  }
}
@media (max-width: @screen-xl) {
  .download-module {
    .fix-top {
      padding-top: 0;
      align-self: center;
    }
    .download-btn-list {
      flex-direction: column;
      gap: @gap-md;
      .line {
        height: 1px;
        width: 100%;
      }
    }
  }
}

@media (max-width: @screen-md) {
}
@media (max-width: @screen-sm) {
  .download-module .google-play {
    width: 100%;
    max-width: 240px;
    height: 55px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
