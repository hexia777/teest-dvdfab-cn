<script setup lang="ts">
const props = defineProps({
  proName: {
    type: String,
    default: '',
  },
  proDesc: {
    type: String,
    default: ``,
  },
  downloadWinUrl: {
    type: String,
    default: ``,
  },
  downloadMacUrl: {
    type: String,
    default: ``,
  },
  macPid: {
    type: [String, Number],
    default: ``,
  },
  winPid: {
    type: [String, Number],
    default: ``,
  },
  type: {
    type: String,
    default: 'resource',
  },
  productLine: {
    type: String,
    default: 'dvdfab12',
  },
})

const title = useI18n().value.article.inquiry_title
const desc = useI18n().value.article.inquiry_desc
const btn1Text = useI18n().value.article.inquiry_download_win
const btn2Text = useI18n().value.article.inquiry_download_mac
const proImg = 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_dvdfab12.png'

const inquiryIconUrls: any = {
  streamfab: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_downloader.png',
  unifab: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_unifab.png',
  player: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_playerfab.png',
  toolkit: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_toolkit.png',
  passkey: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_passkey.png',
  video_cruise: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_videocruise.png',
  photo_enhancer_ai: 'https://c.dvdfab.cn/images/photo_enhancer_ai/logo.png',
  media_recover: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_mediarecover.png',
  dvdfab12: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_dvdfab12.png',
  recordfab: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_recordfab.png',
  video_enhancer_ai: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_video_enhancer.png',
  video_converter_pro: 'https://c.dvdfab.cn/assets/images/download/1x_m/icon/icon_concerter_pro.png',
}
const inquiryProductLineIcon = computed(() => {
  return inquiryIconUrls[props.productLine] || inquiryIconUrls.dvdfab12
})

const emits = defineEmits(['update', 'closeDialog'])
// const setCookie = () => {
//   emits('update', '', false)
// }

const closeDialog = () => {
  emits('closeDialog')
  // this.inquiry = false
}
</script>
<template>
  <div class="resource-inquiry tc">
    <div id="resource-inquiry-dlg" class="inq-box tl">
      <div class="inq-top">
        <div>
          <my-img width="36" height="36" :src="proImg" alt="" class="special" />
          <span v-if="title" class="pl8 font-700" v-html="title"></span>
        </div>
        <div id="dvdfab12-download-dlg-close" class="dialog-close" @click="closeDialog"></div>
      </div>
      <!-- <div type="submit" class="cou-clo-btn pc" @click="setCookie"></div> -->
      <div class="inq-btm">
        <p v-if="desc" class="tc" v-html="desc"></p>
        <div class="btm-con-top clearfix">
          <div class="pro_icon tc fl">
            <!-- <i :class="inquiryProductLineIcon"></i> -->
            <my-img width="96" height="96" :src="inquiryProductLineIcon" alt="" class="special" />
          </div>
          <div class="pro_info fl">
            <p class="btm-tit font-s-24" v-html="proName"></p>
            <p class="bottom-desc" v-html="proDesc"></p>
          </div>
        </div>
      </div>
      <div class="btm-btn">
        <template v-if="downloadWinUrl">
          <MyButtonDownload
            id="dlg-download-btn-win"
            :data-warden-ck-parm="
              base64Encode({
                event_value: props.type,
                event_label: `productpage_dlg`,
                pids: [winPid],
              })
            "
            :label="btn1Text"
            :href="downloadWinUrl"
            size="medium"
            os="win"
          />
        </template>
        <template v-if="downloadMacUrl">
          <MyButtonDownload
            id="dlg-download-btn-mac"
            :data-warden-ck-parm="
              base64Encode({
                event_value: props.type,
                event_label: `productpage_dlg`,
                pids: [macPid],
              })
            "
            :label="btn2Text"
            :href="downloadMacUrl"
            size="medium"
            theme="orange"
            os="mac"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.resource-inquiry {
  // display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;

  .dialog-close {
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    &::before {
      content: '';
      display: inline-block;
      width: 15px;
      height: 2px;
      background: #a7a7a7;
      transform: rotate(45deg);
      position: absolute;
      top: 20px;
      right: 20px;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 15px;
      height: 2px;
      background: #a7a7a7;
      transform: rotate(-45deg);
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .inq-box {
    position: relative;
    width: 597px;
    background-color: #fff;
    box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.2);
    margin: 10% auto 0;
    border-radius: 10px;
    z-index: 96;
  }
  .cou-clo-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    width: 27px;
    height: 27px;
    cursor: pointer;
    border: none;
    font-size: 0;
    // background: url('@{imgPath}/promotion/2020_movie_themes/coupon_close.png') no-repeat center;
  }
  .inq-top {
    background-color: #f4f4f4;
    padding: 6px 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    > span {
      display: inline-block;
      margin-left: 10px;
      font-weight: bold;
    }
  }
  .inq-btm {
    > p {
      padding: 24px;
      font-weight: bold;
      font-size: @font-size-md;
      color: #ff6c00;
      text-align: center;
      font-size: 24px;
      line-height: 32px;
    }
  }
  .btm-con-top {
    padding: 0 24px 24px 24px;
    display: flex;
  }
  .pro_icon {
    padding: 24px;
    padding-top: 0;
  }
  .pro_info {
    width: 70%;
    .btm-tit {
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: bold;
    }
  }
  .btm-btn {
    background: #fbf8ed;
    border-radius: 0 0 12px 12px;
    padding: 20px 0;
    display: flex;
    gap: 16px;
    justify-content: center;
    :deep(.iconfont-sg) {
      font-size: 20px;
    }
  }
}
</style>
