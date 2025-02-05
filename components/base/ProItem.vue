<script setup lang="ts">
const props = defineProps({
  // title: product.shortName,
  name: {
    type: String,
    default: '',
  },
  // desc: product.desc,
  desc: {
    type: String,
    default: '',
  },
  /**
   * media: {
    loading: '',
    img: proImg.url,
    url: product.slug ? '/' + product.slug : '',
    alt: product.name,
    with: 150,
    height: 150,
  }
   */
  media: {
    type: Object,
    default: () => {},
  },
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  blockClass: {
    type: Object,
    default: () => ({
      value: 'no-bg',
    }),
  },
  style: {
    type: Object,
    default: () => ({
      flexClass: '',
      fontClass: 'font-s-24',
    }),
  },
})
</script>

<template>
  <div class="block-pro pl14 pr14 flex flex-col justify-between" :class="blockClass.value">
    <div class="top">
      <div class="pro-img mb20 text-center">
        <a v-if="media.url" :href="media.url" class="font-s-0">
          <my-img
            v-if="media.img"
            :width="media.width"
            :height="media.height"
            :src="media.img"
            :alt="media.alt"
            :loading="media.loading || 'lazy'"
          />
        </a>
        <my-img v-else :width="media.width" :height="media.height" :src="media.img" :alt="media.alt" />
      </div>
      <div class="pro-text">
        <div class="pro-name font-700 pb12 text-center" :class="style.fontClass">
          <a v-if="media.url" :href="media.url" class="font-s-0" v-html="props.name"> </a>
          <span v-else v-html="props.name"></span>
        </div>
        <p class="pro-desc text-center" v-html="props.desc"></p>
      </div>
    </div>
    <div class="pro-btn-group pt30 flex-center" :class="style.flexClass">
      <div v-for="(btn, idx) in btnList" :key="'btn-item' + idx" class="btn-item">
        <component :is="btn.component" v-if="btn.click" v-track:click="btn.click" v-bind="{ ...btn.info }" />
        <component :is="btn.component" v-else v-bind="{ ...btn.info }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
//按钮状态与通用组件样式保持一致
.pro-name {
  a {
    color: @base-text-color;
  }
  &:hover {
    a {
      color: @primary-color;
    }
  }
}
.pro-btn-group {
  @apply flex gap-12;
}
</style>
