<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  h2Title: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array<any>,
    default: () => [],
  },
})
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 v-if="title" class="pb40 text-center" v-html="title"></h2>
      <el-row v-if="items?.length" class="text-center compare-card-grid" :gutter="24">
        <el-col
          v-for="(item, index) in items"
          :key="index"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="items?.length === 3 ? 8 : 12"
          :xl="items?.length === 3 ? 8 : 12"
          class="!pl15 !pr15 my-col"
        >
          <pages-product-features-image-text-card
            :h2-title="h2Title || title"
            :img-url="item.media?.data?.attributes?.url"
            :img-alt="item?.mediaAlt"
            :title="item.title"
            :desc="item.desc"
            :font-class="{
              'font-s-32': items?.length % 2 === 0,
              'font-s-24': items?.length === 3,
            }"
          />
        </el-col>
      </el-row>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
@media (max-width: @screen-xl) {
  .my-col {
    @apply mb30;
    &:last-child {
      @apply mb0;
    }
  }
}
</style>
