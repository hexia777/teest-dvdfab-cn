<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: 'normal', // large:278*66, medium:220*48, small:180*48,  normal:170*40, mini:pl15 pr15
  },
  theme: {
    type: String,
    default: 'primary', // primary、orange、border、border-orange
  },
  label: {
    type: String,
    default: 'Read More >', // Read More >
  },
  href: {
    type: String,
    default: '', //
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isSelf: {
    type: Boolean,
    default: true,
  },
  tag: {
    type: String,
    default: 'a',
  },
  target: {
    type: String,
    default: '_self',
  },
  icon: {
    type: String,
    default: '', // 自定义
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
})

const bindAttrs = computed(() => {
  const attrs: any = {}
  if (props.tag === 'a') {
    attrs.href = props.href
    attrs.target = props.target ? props.target : '_self'
  }
  return attrs
})
</script>

<template>
  <component
    :is="tag"
    class="btn my-button v-mid"
    :class="[
      {
        [size]: size,
        disabled: disabled,
      },
      isSelf ? theme : '',
    ]"
    v-bind="bindAttrs"
  >
    <slot>
      <span class="my-btn flex-center">
        <i v-if="showIcon || icon" :class="icon" class="iconfont-sg v-mid pr-10"></i>
        <span class="relative font-700" v-html="label"></span>
      </span>
    </slot>
  </component>
</template>

<style scoped lang="less"></style>
