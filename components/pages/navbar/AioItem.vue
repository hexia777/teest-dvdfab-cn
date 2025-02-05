<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  imgUrl: {
    type: String,
    default: '',
  },
  off: {
    type: String,
    default: '',
  },
  imgW: {
    type: String,
    default: '220',
  },
  imgH: {
    type: String,
    default: '220',
  },
  mediaAlt: {
    type: String,
    default: '',
  },
  productLine: {
    type: String,
    default: '',
  },
  btnInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
  elkParams: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="aio-item bg-normal">
    <a
      v-track:click="{
        ...elkParams,
        event_value: title.toLowerCase().replace(/\s+/g, '_'),
      }"
      :href="link"
    >
      <div class="tit">
        <span class="font-700 pro-name" v-html="title"></span>
        <span class="off" v-html="off"></span>
      </div>
      <div class="desc" v-html="desc"></div>
      <my-img class="img" :src="imgUrl" :width="imgW" :height="imgH" :alt="mediaAlt" />
      <div class="btn-box">
        <MyButton v-bind="{ ...btnInfo }" />
      </div>
    </a>
  </div>
</template>

<style scoped lang="less">
.aio-item {
  border-radius: 8px;
  padding: 16px;
  min-width: 298px;
  .tit {
    @apply pb4;
  }
  .img {
    margin: auto;
  }
  .desc {
    color: #909090;
    font-size: 14px;
  }
  .off {
    padding: 2px 4px;
    background: #ff3b30;
    border-radius: 3px 3px 3px 0px;
    font-size: 10px;
    color: #fff000;
    margin-left: 4px;
    display: inline-block;
    vertical-align: middle;
  }
  .btn-box {
    @apply flex-center pt8;
  }
}
</style>
<style lang="less">
.aio-item {
  &:hover {
    .btn.border {
      background: @primary-color;
      color: #ffff !important;
    }
  }
}
</style>
