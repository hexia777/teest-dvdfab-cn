<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
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

const theme = useRoute().name === 'dvdfab365' ? 'fill' : 'normal'
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 class="text-center mb40" v-html="title"></h2>
      <div class="card-list flex flex-wrap gap30">
        <template v-for="(item, idx) in items" :key="'pcard' + idx">
          <PagesProductCardIconTitleText class="card-item" v-bind="{ theme, ...item }" />
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
  }
}
</style>
