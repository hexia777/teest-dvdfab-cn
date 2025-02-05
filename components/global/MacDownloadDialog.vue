<script setup lang="ts">
import { macDownloadDlgInfo } from '~/config/downloadInfo'

const dlgInfo = macDownloadDlgInfo[useMacDownloadProductLine().value]
const $t = useI18n().value
</script>

<template>
  <div v-show="useMacDownloadModal().value" class="mac-download-dlg">
    <div class="dialog-box">
      <div class="dialog-title">
        <my-img
          width="130"
          height="34"
          :src="useAppConfig().cdn_domain + dlgInfo.logo"
          :alt="dlgInfo.keyword"
          class="special"
        />
        <div
          id="dvdfab-download-dlg-close"
          class="dialog-close"
          onclick="document.getElementById('dvdfab-download-dlg').style.display = 'none'"
          @click="useMacDownloadModal().value = false"
        ></div>
      </div>
      <div>
        <div
          class="dvdfab-version-desc"
          v-html="$t.common.mac_download_dlg_title?.replace('{keyword}', dlgInfo.keyword)"
        ></div>
        <div class="downloader-btn">
          <MyButtonDownload
            id="dlg-download-btn"
            :label="$t.common.mac_download_dlg_btn_1"
            :href="dlgInfo.mac_with_intel_chip"
            size="medium"
            theme="primary"
            :show-icon="false"
            data-btn-from="mac-download-dlg"
          />
          <MyButtonDownload
            id="dlg-download-btn-m1"
            :label="$t.common.mac_download_dlg_btn_2"
            :href="dlgInfo.mac_with_apple_chip"
            size="medium"
            theme="orange"
            :show-icon="false"
            data-btn-from="mac-download-dlg"
          />
        </div>
        <div class="dialog-desc">
          <div class="dlog-title" v-html="$t.common.mac_download_dlg_title_sub"></div>
          <div class="dlog-desc" v-html="$t.common.mac_download_dlg_desc"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.mac-download-dlg {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  .dialog-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 8px;
    width: 600px;
    min-height: 355px;
  }
  .dialog-title {
    background: #f4f4f4;
    padding: 8px 10px;
    border-radius: 8px 8px 0 0;
  }
  .dvdfab-version-desc {
    text-align: center;
    color: @base-text-color;
    margin: 24px 20px;
  }
  .dialog-close {
    width: 30px;
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
    }
  }
  .downloader-btn {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .dialog-desc {
    margin: 24px;
    border-top: 1px solid #f4f4f4;
    padding-top: 16px;
    line-height: 24px;
    color: #909090;
    .dlog-title {
      margin-bottom: 10px;
    }
  }
}
</style>
