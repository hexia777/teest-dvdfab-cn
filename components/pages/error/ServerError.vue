<script setup lang="ts">
const imagePath = useImgPath().value + '/500/img.png'
const commonJson = useI18n().value.common
const currentYear = String(new Date().getFullYear())
</script>

<template>
  <div class="status-500">
    <BaseContainer>
      <div class="img tc">
        <img :src="imagePath" alt="" width="268" height="192" />
      </div>
      <h2 class="quicksand-bold tc">Get Ready... Something Really Cool Is Coming Soon</h2>
      <p>Our website now is in maintenance mode, we will come back very soon.</p>
      <p>
        If you have any questions, please feel free to contact us via
        <a href="mailto:service@dvdfab.cn">service@dvdfab.cn</a>
      </p>
      <div class="ft-500" v-html="commonJson?.copyright.replace('{copyright_year}', currentYear)"></div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.status-500 {
  padding: 100px 0;
  .container {
    max-width: 560px;
  }
  h2 {
    font-size: @font-size-md;
    color: #f8750b;
    padding: 50px 10px;
  }
  p {
    padding: 10px 0;
  }
  .share {
    a {
      vertical-align: middle;
    }
  }
  .ft-500 {
    margin-top: 200px;
    padding-top: 10px;
    text-align: center;
    border-top: 1px solid @border-gray;
    color: #8e8e8e;
  }
  p {
    a {
      color: @link-text-color;
    }
  }
}
</style>
