<script setup lang="ts">
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'musicfab',
  },
  textTheme: {
    type: String,
    default: 'dark',
  },
  // 产品信息
  proInfo: {
    type: Object,
    default: () => {},
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // banner 按钮组信息
  btnList: {
    type: Array,
    default: () => [],
  },
  priceGiftInfo: {
    type: Object,
    default: () => {},
  },
})

// computed
const osText: ComputedRef = computed(() => {
  return useOs().value
})
</script>
<template>
  <PagesProductTopBanner v-bind="{ ...props, ...$attrs }">
    <template #middle>
      <div class="flex mb40">
        <PagesProductGiftBox v-bind="priceGiftInfo" />
      </div>
    </template>
  </PagesProductTopBanner>
</template>
<style lang="less" scoped>
.gift-info {
  border: 1px solid @border-gray1;
  border-radius: @b-radius-sm;
  padding: 10px 20px 10px 24px;
  position: relative;
}
.gift-icon {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: @b-radius-lg;
  background-color: @secondary-color;
  left: -13px;
}

::v-deep {
  .ptb-desc {
    font-weight: bold;
    span {
      display: inline-block;
    }
    p {
      position: relative;
      padding-left: 20px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @base-text-color;
        position: absolute;
        left: 0;
        top: 12px;
      }
    }
  }
}
</style>
