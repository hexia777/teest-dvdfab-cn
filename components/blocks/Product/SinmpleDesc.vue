<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
      }
    },
  },
  desc: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="block-box no-pd" :class="blockClass.value">
    <div class="desc-box w100% bg-black-0.03">
      <BaseContainer>
        <div v-html="desc"></div>
      </BaseContainer>
    </div>
  </div>
</template>

<style scoped lang="less">
.desc-box {
  padding: @gap-md 0;
}
.ctl-item {
  & + .ctl-item {
    margin-top: 16px;
  }
}
</style>
