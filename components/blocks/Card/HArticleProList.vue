<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array<any>,
    default: () => [],
    required: true,
  },
})
</script>

<template>
  <div class="p20 pt0 article-recomend-list">
    <!-- 主标题 -->
    <p v-if="title" class="font-s-18 pt18 pb18 mb-40 title font-700" v-html="title"></p>
    <!-- pro列表 -->
    <section v-if="items && items.length" class="pro-box flex flex-wrap">
      <div v-for="(item, index) in items" :key="index" class="pro-li">
        <base-pro-item
          v-bind="item"
          :style="{
            flexClass: 'flex-col',
            fontClass: 'font-s-18',
          }"
        />
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.article-recomend-list {
  background-color: #fff;
  .title {
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 28px;
      background: @primary-color;
      box-shadow: -3px 0px 5px 0px rgba(0, 169, 240, 0.3);
      position: absolute;
      left: -20px;
    }
  }
  .pro-box {
    gap: @gap-base;

    .pro-li {
      @apply flex flex-1;
      width: calc((100% - 2 * @gap-base) / 3);
    }
  }
}

// 移动端兼容
@media screen and (max-width: @screen-xxl) {
  .article-recomend-list {
    .pro-box {
      flex-direction: column;
      .pro-li {
        width: 100%;
        flex: 1;
      }
    }
  }
}

// 移动端兼容
@media screen and (max-width: @screen-xl) {
  .article-recomend-list {
    .pro-box {
      .pro-li {
        justify-content: center;
      }
    }
  }
}
</style>
