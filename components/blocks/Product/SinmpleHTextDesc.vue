<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'no-bg',
      }
    },
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 描述信息
  desc: {
    type: String,
    default: '',
  },
  // 底部描述信息
  bottomDesc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // 内容 list
  items: {
    type: Array<any>,
    default: () => [],
  },
})
</script>

<template>
  <div class="block-box" :class="[blockClass?.value]" :style="style">
    <BaseContainer>
      <div class="flex flex-col flex-items-center flex-justify-center">
        <h1 class="text-center mb20" v-html="props.title"></h1>
        <div class="mb-desc mb40 text-center" v-html="props.desc"></div>
        <div class="hdtl-content w100% max-w-650">
          <template v-for="(item, idx) in items" :key="'hdtl-item' + idx">
            <div class="hdtl-item">
              <div class="title5 mb10" v-html="item.title"></div>
              <ul class="hdtl-item-list" v-html="item.desc"></ul>
            </div>
          </template>
        </div>
        <p class="mb-desc mt40 text-center" v-html="props.bottomDesc"></p>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.hdtl-content {
  .hdtl-item {
    & + .hdtl-item {
      margin-top: 24px;
    }
    :deep(.hdtl-item-list) {
      li {
        list-style-type: disc;
        span {
          border-radius: 4px;
          border: 1px solid @secondary-color;
          color: @secondary-color;
          padding: 0 8px;
          margin-left: 12px;
        }
        & + li {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
