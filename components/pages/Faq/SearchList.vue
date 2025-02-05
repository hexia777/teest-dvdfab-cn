<script lang="ts" setup>
const props = defineProps({
  items: {
    type: Array as any,
    default: () => [],
  },
})
</script>

<template>
  <!-- 列表部分 -->
  <div class="section-center block-box">
    <BaseContainer>
      <a
        v-for="(item, index) in items"
        :key="index"
        class="section-production-item"
        :href="'/faq/' + item.route_name + '.htm'"
      >
        <!-- <i :class="item.icon"></i> -->
        <my-img
          :src="item.iconData.media?.data?.attributes?.url"
          :width="item.iconData.media?.data?.attributes?.width"
          :height="item.iconData.media?.data?.attributes?.height"
          :alt="item.iconData?.mediaAlt"
          loading="lazy"
        />
        <span class="font-700 section-production-text" v-html="item.category_name"></span>
      </a>
    </BaseContainer>
  </div>
</template>
<style lang="less" scoped>
// 分类
.section-center .container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
}

.section-production-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc((100% - 3.75rem) / 3);
  height: 168px;
  background: #f1fafd;
  border-radius: 20px;
  cursor: pointer;
  padding: 20px;
  i {
    flex-shrink: 0;
  }

  .section-production-text {
    font-size: 24px;
    margin-left: 16px;
    color: @base-text-color;
  }
  &:hover {
    background: #ffffff;
    box-shadow: 0 0 50px 0 #c2edff;
    .section-production-text {
      color: @primary-color;
    }
  }
  &:nth-last-of-type(3n + 2) {
    margin-right: 0;
  }
  @media screen and(max-width:1024px) {
    width: calc((100% - 1.875rem) / 2);
  }
  @media screen and(max-width:600px) {
    width: 100%;
  }
}

.pb-80 {
  padding-bottom: 80px;
}
.anchor {
  position: absolute;
  top: -100px;
}
.anchor:target {
  padding-top: 5.875rem;
  margin-top: -5.875rem;
}
</style>
