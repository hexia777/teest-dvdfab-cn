<script setup lang="ts">
defineOptions({ name: 'HomeBanner' })
const props = defineProps({
  blockData: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="home-banner bg-red text-center relative">
    按钮测试:
    <a :href="blockData.url" class="btn">{{ blockData.title }}</a>
  </div>
</template>

<style scoped lang="less"></style>
