<script setup lang="ts">
const Promotion = resolveComponent('PromotionHeaderBanner')
// const NewProductRelease = resolveComponent('HeaderBannerNewProductRelease')
</script>

<template>
  <!-- :is="pageData.headReleaseTitle ? NewProductRelease : Promotion" -->
  <component :is="Promotion" data-style="83d943e0-848f-415a-b93b-6195087f1e6c" />
</template>

<style scoped lang="less"></style>
