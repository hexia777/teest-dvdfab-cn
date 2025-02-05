<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => ({
      value: 'no-bg',
    }),
  },
})
</script>
<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer class="pos-relative">
      <BaseMyIframe :src="src" />
    </BaseContainer>
  </div>
</template>
<style lang="less" scoped></style>
