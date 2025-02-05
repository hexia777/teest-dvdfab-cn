<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: String,
    default: 'block-box has-bg bg-normal',
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
    type: Array<any>,
    default: () => [],
  },
})
</script>

<template>
  <div class="mid-banner text-center" :class="[blockClass, `text-${textTheme}`]" :style="style">
    <BaseContainer>
      <div class="mb-content flex flex-col flex-items-center flex-justify-center">
        <h1 class="mb-title" :class="props.desc ? 'mb20' : 'mb60'" v-html="props.title"></h1>
        <p v-if="props.desc" class="mb-desc mb40 font-s-20" v-html="props.desc"></p>
        <slot name="middle" :data="$attrs"></slot>
        <div class="btn-group flex flex-justify-center">
          <div v-for="(btn, idx) in props.btnList" :key="'btn-item' + idx" class="btn-item">
            <component :is="btn.component" v-bind="{ ...btn.info }" />
            <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
              <i :class="btn.tipIconClass"></i>
              <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.tip-text {
  color: @text-gray-color;
}
.btn-group {
  gap: 30px;
}
.text-light {
  color: @text-white-color;
  .tip-text {
    color: @text-white-color;
  }
}
</style>
