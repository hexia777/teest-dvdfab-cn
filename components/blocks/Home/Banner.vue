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
  <div class="home-banner bg-blue text-center relative">
    <BaseContainer> this is a Block content</BaseContainer>
  </div>
</template>

<style scoped lang="less"></style>
