<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    default: () => ({}),
  },
})

const items = props.blockData?.items || []
</script>

<template>
  <div>
    <ul class="technologies">
      <li v-for="(item, index) in items" :key="index" class="item mb22 pl30 pr30 pb22 pt22">
        <div class="item-title min-h40" v-html="item.title"></div>
        <div v-html="item.desc"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.technologies {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.item {
  width: 32.33%;
  margin-left: 1%;
  margin-top: 0;
  box-sizing: border-box;
  color: @base-text-color;
  background-color: @bg-white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);

  .item-title {
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    :deep(a) {
      color: #333;
    }
    &:hover {
      :deep(a) {
        color: @primary-color !important;
      }
    }
  }
}

@media (max-width: 1200px) {
  .item {
    width: 49%;
  }
}

@media (max-width: 768px) {
  .item {
    width: 100%;
  }
}
</style>
