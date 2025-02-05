<script setup lang="ts">
defineOptions({ name: 'HImgDesc' })
const props = defineProps({
  // 左图右文
  reverse: {
    type: Boolean,
    default: false,
  },
  // h 标题
  title: {
    type: String,
    default: '',
  },
  // 图片描述信息
  desc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // 图片信息
  media: {
    type: Object,
    default: () => {},
  },
  // 图片信息
  mediaAlt: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
})
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <pages-product-features
        :has-h2-title="title"
        :title="title"
        :img-desc="desc"
        :reverse="reverse"
        :width="media?.data?.attributes?.width"
        :height="media?.data?.attributes?.height"
        :img-alt="mediaAlt"
        :img-url="media?.data?.attributes?.url"
      />
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.features-box {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .features-title {
    position: relative;
    text-align: center;
  }
}
.reverse {
  @apply flex-row-reverse;
  .block-features-text {
    @apply pl0 pr40;
  }
  .block-title {
    @apply text-left;
  }
}
.block-features {
  &:last-child {
    @apply mb0;
  }
}
@media (max-width: @screen-xl) {
  .block-features {
    @apply flex-center-col flex-col-reverse;
    .block-title {
      @apply text-center;
    }
    .block-features-img {
      @apply w-full text-center justify-center;
    }
    .block-features-text {
      @apply w-full pl0 pb20 pr0;
    }
  }
}
</style>
