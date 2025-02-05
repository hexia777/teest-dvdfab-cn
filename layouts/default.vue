<script setup lang="ts">
import { getUrlType } from '~/config/elk/urlType'

const { need } = usePromotionData()
if (need) { // 如果页面需要展示优惠活动 Banner，则获取优惠活动数据
  await usePromotionRequest()
}

const commonStore = useStore.common()
const { isBannerShow, buyDialog, isHeaderBannerShow, isShowBuyDialog } = useLayout()
</script>

<template>
  <!-- data-has-headbanner pagecache有使用到-->
  <div
    :data-warden-g-parm="base64Encode(getUrlType())"
    class="layout-default"
    :data-has-subnav="useStore.common().pageProLine ? 'has-subnav' : ''"
    :data-has-headbanner="isBannerShow && isHeaderBannerShow ? 'has-headbanner' : ''"
    :data-glob-promotion-name="useStore.promotion().productLine || 'common'"
    :data-glob-promotion-cookie-suffix="useStore.promotion().cookieSuffix || 'default'"
  >
    <client-only>
      <!-- elk上报公共参数 -->
      <div
        :data-warden-g-parm="
          base64Encode({
            ...(commonStore.pageType ? { url_type: commonStore.pageType } : {}),
          })
        "
      ></div>
    </client-only>
    <NavBar />

    <slot></slot>
    <mac-download-dialog />
    <FooterBar />

    <BackTop />
    <PromotionFloatBanner v-if="isBannerShow" />

    <template v-if="isShowBuyDialog">
      <PagesDialogBuyNormal
        v-model="buyDialog.show"
        :pid="+buyDialog.pid"
        :pname="buyDialog.pname"
        :has-mac="buyDialog.hasMac"
      />
    </template>
  </div>
</template>

<style lang="less"></style>
