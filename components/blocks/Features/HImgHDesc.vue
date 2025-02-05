<script setup lang="ts">
defineOptions({ name: 'HImgHDesc' })
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
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
})
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 v-if="title" class="mb-40 text-center" v-html="title"></h2>
      <p v-if="desc" class="mb-40 text-center" v-html="desc"></p>
      <template v-if="items?.length">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="{ reverse: item.reverse }"
          class="block-features flex justify-between mb80"
        >
          <pages-product-features
            :has-h2-title="title"
            :img-title="item.title"
            :img-desc="item.desc"
            :width="item.media?.data?.attributes?.width"
            :height="item.media?.data?.attributes?.height"
            :img-alt="item?.mediaAlt"
            :img-url="item.media?.data?.attributes?.url"
            :reverse="item.reverse"
          />
        </div>
      </template>
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
    @apply pl40 pr0;
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
