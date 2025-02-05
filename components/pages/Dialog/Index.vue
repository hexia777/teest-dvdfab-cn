<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  clickOverlayCanClose: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:modelValue'])

const closeDialog = () => {
  if (props.clickOverlayCanClose) {
    emits('update:modelValue', false)
  }
}
</script>

<template>
  <div class="vd-overlay" @click="closeDialog">
    <div class="vd-overlay-dialog">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.vd-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.vd-overlay-dialog {
  background: #f4f4f4;
  border-radius: 12px 12px 0px 0px;
  width: 90%;
  max-width: 800px;
  padding: 40px;
  border-radius: @b-radius-sm;
  position: relative;
}
</style>
