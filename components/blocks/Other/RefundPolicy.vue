<script setup>
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg' }
    },
  },
  title: {
    type: String,
    default: '',
  },
  media: {
    type: Object,
    default: () => {},
  },
  desc: {
    type: String,
    default: '',
  },
})
const imageData = getStrapiData(props.media) || {}
</script>

<template>
  <div class="refund-policy block-box" :class="blockClass.value">
    <BaseContainer>
      <div class="content-wrap flex gap30">
        <div class="img-box">
          <MyImg
            :src="imageData?.url || ''"
            width="312"
            height="254"
            layout="responsive"
            :alt="imageData?.alternativeText || ''"
            class="lazy-loading-status img"
          />
        </div>
        <div class="content flex flex-col flex-justify-center">
          <h2 class="pb20" v-html="title"></h2>
          <p class="desc" v-html="desc"></p>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<style scoped lang="less">
.refund-policy {
  .title2 {
    font-size: @font-size-xxl;
    font-weight: 700;
  }
  :deep(.desc) {
    font-size: @font-size;
    line-height: @base-line-height;
    color: @base-text-color;
    a {
      color: @primary-text-color;
    }
  }
}
@media (max-width: 768px) {
  .content-wrap {
    flex-direction: column;
    .content h2 {
      text-align: center;
    }
  }
  .img-box {
    text-align: center;
    img {
      max-width: 273px;
      width: 70%;
      height: auto;
    }
  }
}
</style>
