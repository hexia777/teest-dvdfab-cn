<script setup lang="ts">
defineOptions({ name: 'HomeLink' })
const props = defineProps({
  blockData: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="home-banner bg-blue text-center relative">
    超链接测试:
    <a :href="blockData.href">{{ blockData.label }}</a>
  </div>
</template>

<style scoped lang="less"></style>
