<script setup lang="ts">
const props = defineProps({
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
  <div class="recommended-pros">
    <PagesProductResourceArticleWithBgTitle :title="title" />
    <section v-if="items && items.length" class="recommended-box pt0 pb16 pl10 pr10">
      <div v-for="(item, index) in items" :key="index" class="recommended-li pt16 pb16">
        <PagesProductResourceBaseRecommendedPro
          :pro-img="item.proImg"
          :pro-img-url="item.proImgUrl"
          :name="item.name"
          :desc="item.desc"
          :price="item.price"
          :old-price="item.oldPrice"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.recommended-pros {
  background-color: #fff;
  .recommended-li {
    border-bottom: 1px solid @border-gray;
    line-height: @base-line-height;
    .name {
      @apply inline-block text-ellipsis whitespace-nowrap font-700 pb4 w-full overflow-hidden;
      list-style-position: inside;
      width: 100%;
    }
    .desc {
      color: @text-gray-color;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .new-price {
    color: @secondary-color;
  }
  .old-price {
    color: @text-gray-color;
    text-decoration: line-through;
  }
}
</style>
