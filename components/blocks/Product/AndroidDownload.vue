<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => ({
      value: 'has-bg',
    }),
  },
  title: {
    type: String,
    default: '',
  },
  media: {
    type: Object,
    default: () => {},
  },
  mediaDesc: {
    type: String,
    default: '',
  },
  androidVersion: {
    type: String,
    default: '',
  },
  googlePayMedia: {
    type: String,
    default: '',
  },
  googleStoreLink: {
    type: String,
    default: '',
  },
  googleTips: {
    type: String,
    default: '',
  },
})
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const proInfo = useProInfo().value || {}
const clientInfo = getStrapiData(proInfo.client_info)
const secTitle = props.title + ` (V${clientInfo.version})`
const bottomInfo = {
  qrCode: {
    img: getStrapiData(props.media),
    desc: props.mediaDesc,
  },
  googlePay: {
    img: props.googlePayMedia,
    desc: props.googleTips,
    link: props.googleStoreLink,
    elkParams: {
      event: 'download',
      event_label: 'downloadpage',
      install_download_url: props.googleStoreLink,
    },
  },
  download: {
    label: commomJson.free_download,
    osVersion: props.androidVersion,
    safeText: commomJson.download_info,
    link: proInfo.downloadUrl[0].url,
    pid: proInfo.pid,
    elkParams: {},
  },
}
</script>

<template>
  <div class="block-box download-module" :class="[blockClass?.value]">
    <BaseContainer>
      <h2 class="mb60 text-center" v-html="secTitle"></h2>
    </BaseContainer>
    <PagesProductDownload type="module" :info="bottomInfo" />
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
    display: block;
    padding: 11px 55px;
    width: fit-content;
    height: fit-content;
    background: #000;
    border-radius: 33px;
    &:hover {
      background: #3b5159;
    }
    .google_text {
      background-position: 0 0;
      width: 11.063rem;
      height: 2.625rem;
      display: block;
      background: url(https://c1.dvdfab.cn/images/product/1x_m/en/streamfab_for_android/1x_m/icon.png?t=1675334177508)
        no-repeat;
      background-size: 11.063rem 5.375rem;
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
}

@media (max-width: @screen-md) {
}
@media (max-width: @screen-sm) {
}
</style>
