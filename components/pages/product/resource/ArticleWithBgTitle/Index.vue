<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Hot Products',
    required: true,
  },
})
</script>

<template>
  <div class="with-bg-title">
    <h2 class="title font-s-18 pt16 pb16 ml20 mr20 relative">
      {{ props.title }}
    </h2>
  </div>
</template>

<style scoped lang="less">
.with-bg-title {
  .title {
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid @border-gray;
    &:before {
      content: '';
      position: absolute;
      left: -20px;
      top: 50%;
      width: 4px;
      height: 54%;
      transform: translateY(-50%);
      background: @primary-color;
      border-radius: 2px;
      box-shadow: -3px 0px 5px 0px rgba(0, 169, 240, 0.3);
    }
  }
}
</style>
