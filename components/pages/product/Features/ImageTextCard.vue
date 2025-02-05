<script setup lang="ts">
const props = defineProps({
  h2Title: {
    // 是否有大标题
    type: String,
    default: '',
    required: true,
  },
  imgUrl: {
    type: String,
    default: '',
  },
  imgAlt: {
    type: String,
    default: '',
  },
  imgWidth: {
    type: Number,
    default: 525,
  },
  imgHeight: {
    type: Number,
    default: 350,
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  imgBorderRadius: {
    type: Number,
    default: 0,
  },
  // fontClass: {
  //   type: String,
  //   default: '',
  // },
  blockClass: {
    type: Object,
    default: () => {},
  },
})
</script>

<template>
  <section class="image-text-card">
    <div class="grid-content b-radius-sm h-full p30">
      <div class="b-radius-sm pb20 grid-content-img" :class="blockClass ? 'pl30 pr30' : ''">
        <my-img
          :class="`b-rd-${imgBorderRadius}`"
          :width="imgWidth"
          :height="imgHeight"
          class="max-w-full h-auto"
          :src="imgUrl"
          :alt="imgAlt"
        />
      </div>
      <div class="grid-content-text">
        <!-- 存在h2大标题则显示h3 , 不存在h2大标题则显示h2 -->
        <h3 v-if="title && h2Title" class="block-title pb12" v-html="title"></h3>
        <h2 v-else-if="title && !h2Title" class="block-title pb12" v-html="title"></h2>
        <div v-if="desc" :class="!title ? 'pt24' : ''" class="grid-content-desc" v-html="desc"></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.image-text-card {
  height: 100%;
}
.grid-content {
  background: #fff;
  &.no-bg {
    @apply pb0;

    .grid-content-img {
      background: none;
    }

    .grid-content-title {
      @apply pt20 pb12;
    }

    .grid-content-text {
      @apply p0;
    }
  }
}

.grid-content-title {
  line-height: @title-line-height;
  // font-size: @font-size-md;
}
</style>
