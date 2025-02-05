<script setup lang="ts">
const props = defineProps(['error'])
console.log('error: ', props.error)
await usePromotionRequest()
useLayout()
</script>

<template>
  <div
    class="page-error-page"
    data-has-headbanner="has-headbanner"
    :data-glob-promotion-name="useStore.promotion().productLine || 'common'"
    :data-glob-promotion-cookie-suffix="useStore.promotion().cookieSuffix || 'default'"
    :data-warden-g-parm="
      base64Encode({
        xargs_http_code: error?.statusCode,
        fail_info: {
          detail: error ? JSON.stringify(error) : '',
        },
      })
    "
    data-padding-top="8c5ccfa2-eb4e-495b-a508-845178d44595"
  >
    <NavBar />
    <PagesErrorError404 v-if="error?.statusCode === 404" />
    <PagesErrorServerError v-else />
    <FooterBar />
  </div>
</template>

<style lang="less" scoped></style>
