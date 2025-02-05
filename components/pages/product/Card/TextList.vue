<script setup lang="ts">
defineProps({
  cardClass: {
    type: String,
    default: 'gray-color',
  },
  items: {
    type: Array,
    default: () => {},
  },
})
</script>

<template>
  <div class="card-text-list" :class="cardClass">
    <div v-for="(txt, idx) in items" :key="'card-txt' + idx" class="ctl-item" v-html="txt"></div>
  </div>
</template>

<style scoped lang="less">
.ctl-item {
  & + .ctl-item {
    margin-top: 16px;
  }
}
</style>
