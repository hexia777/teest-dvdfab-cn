<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: '' }
    },
  },
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array<any>,
    default: () => [],
  },
  cardDataTitle: {
    type: String,
    default: '',
  },
  cardDataDesc: {
    type: String,
    default: '',
  },
  cardDataReverse: {
    type: Boolean,
    default: false,
  },
  cardDataImg: {
    type: Object,
    default: () => ({}),
  },
  mediaAlt: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="block-box triangle" :class="blockClass.value">
    <BaseContainer>
      <pages-product-features
        :title="title"
        :has-h2-title="title"
        :img-url="cardDataImg?.data?.attributes?.url"
        :img-alt="mediaAlt || title"
        :img-title="cardDataTitle"
        :img-desc="cardDataDesc"
        :reverse="cardDataReverse"
        :style="{
          paddingTitClass: 'triangle-title',
          bgColor: '#fff',
        }"
      />
    </BaseContainer>
    <BlocksFeaturesHImgTitleDescGrid
      :h2-title="title"
      :items="items"
      :block-class="{ value: cardDataTitle ? '' : 'pt-0' }"
    />
  </div>
</template>

<style scoped lang="less">
.triangle {
  padding-bottom: 0;
  .block-box {
    @apply pt30;
  }
  :deep(.triangle-title .block-title) {
    @apply pb20;
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

@media (max-width: @screen-xl) {
  :deep(.block-features) {
    padding: 30px;
  }
}
</style>
