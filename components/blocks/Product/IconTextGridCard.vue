<script setup lang="ts">
defineOptions({ name: 'IconTextGridCard' })
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => ({
      id: '0',
      value: 'block-box no-bg',
    }),
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div id="test" :class="[props?.blockClass?.value]">
    <BaseContainer>
      <ul
        v-if="props.items && props.items.length"
        class="grid-box flex text-center items-center justify-between b-radius-sm pb-30 pt-30"
      >
        <li v-for="(item, index) in props.items" :key="index" class="grid-item">
          <MyImg
            :src="getStrapiData(item?.media)?.url"
            :width="getStrapiData(item?.media)?.width"
            :height="getStrapiData(item?.media)?.height"
            layout="responsive"
            :alt="item.mediaAlt || ''"
            class="grid-icon overflow-hidden block w78 h78 mb-20 margin-0-auto b-radius-lg"
          />
          <p v-if="item.title" class="max-w-210 margin-0-auto gray-color" v-html="item.title"></p>
        </li>
      </ul>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.grid-box {
  box-shadow: 0px 0px 50px 0px #c2edff;
}
.grid-item {
  position: relative;
  flex: 1;

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 100%;
    right: 0;
    top: 0;
    background-color: #f4f8f9;
  }
}

// 移动端兼容
@media (max-width: @screen-lg) {
  .grid-box {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }

  .grid-item {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    &::after {
      width: 0;
    }

    .grid-icon {
      @apply mb-0;
      @apply mr-20;
    }
  }
}

@media (max-width: @screen-sm) {
  .grid-item {
    @apply w-full px-20;

    p {
      @apply flex-1 text-left;
    }
  }
}
</style>
