<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg',
      }
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
})
const cardItemConfig = {
  imgPosition: 'top',
  size: 'md',
}

const newItems = computed(() => {
  return props.items.map((item: any) => {
    const imgData = getStrapiData(item.media)
    return {
      ...item,
      imgData: {
        loading: '',
        src: imgData.url,
        alt: imgData.alternativeText || item.title,
        width: '100%',
        height: 213,
      },
      imgPosition: item.imgPosition || cardItemConfig.imgPosition,
      size: item.size || cardItemConfig.size,
    }
  })
})
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <h2 class="text-center mb40" v-html="title"></h2>
      <div class="card-list flex flex-wrap gap30">
        <template v-for="(item, idx) in newItems" :key="'pcard' + idx">
          <PagesProductCardImgTitleText class="card-item" v-bind="{ ...item }" />
        </template>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.card-list {
  .card-item {
    width: calc(100% / 3 - 20px);
  }
}

@media (max-width: 1024px) {
  .card-list {
    .card-item {
      width: calc(100% / 2 - 15px);
    }
  }
}
@media (max-width: 640px) {
  .card-list {
    .card-item {
      width: 100%;
    }
    :deep(.card-item) {
      &.itt-card-box img {
        width: 100%;
        max-width: 320px;
        height: auto;
      }
    }
  }
}
</style>
