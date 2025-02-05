<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: String,
    default: 'block-box has-bg bg-normal',
  },
  title: {
    type: String,
    default: '',
  },
  list: {
    type: Array<any>,
    default: () => [],
  },
})
</script>

<template>
  <div :class="blockClass">
    <BaseContainer>
      <h2 class="text-center mb40" v-html="title"></h2>
      <div class="card-list flex flex-wrap gap30">
        <template v-for="(item, idx) in list" :key="'pcard' + idx">
          <PagesProductCardIconTitleText class="card-item" v-bind="{ ...item }" />
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
