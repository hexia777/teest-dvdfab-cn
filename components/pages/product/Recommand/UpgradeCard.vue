<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  imgData: {
    type: Object,
    default: () => {
      return {
        src: '',
        width: '',
        height: '',
        lazy: false,
        alt: '',
      }
    },
  },
  style: {
    type: Object,
    default: () => {
      return {
        backgroundColor: '#F4FCFF',
      }
    },
  },
  size: {
    type: String,
    default: '', // md sm xs
  },
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  // 按钮布局样式
  btnListClass: {
    type: String,
    default: '',
  },
  // 阴影位置
  shandow: {
    type: String,
    default: '', // '' up down
  },

  // 升级补全价格信息
  priceGiftInfo: {
    type: Object,
    default: () => {},
  },
})
const shandowMap: any = {
  up: 'up-shandow',
  down: 'down-shandow',
}
</script>

<template>
  <div
    class="itt-card-box b-radius-sm flex flex-items-center flex-justify-between"
    :style="style"
    :class="[size ? 'card-' + size : '', shandowMap[props.shandow] || '']"
  >
    <div class="itt-image mr40">
      <MyImg
        class="my-img"
        :class="imgData.class"
        :src="imgData.url"
        :width="imgData.width"
        :height="imgData.height"
        :alt="imgData.alt"
      />
    </div>
    <div class="iit-contents flex flex-col flex-items-start">
      <div class="title4 mb20" v-html="title"></div>
      <div class="iit-desc" v-html="desc"></div>
      <PagesProductGiftBox class="mt20" v-bind="priceGiftInfo" />
      <div class="itt-bottom mt20" :class="btnListClass">
        <div v-for="(btn, idx) in btnList" :key="'btn-item' + idx" class="btn-item">
          <component :is="btn.component" v-bind="{ ...btn.info }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.itt-card-box {
  padding: @gap-md;
  background-color: @bg-white;
  &.card-md {
    padding: @gap-30;
  }
  &.card-sm {
    padding: @gap-base;
  }
  &.card-xs {
    padding: @gap-xs;
  }
}
:deep(.iit-contents) {
  .product-info-right {
    gap: 12px;
  }
}

@media (max-width: 900px) {
  .itt-card-box {
    flex-direction: column;
  }
  .itt-image {
    margin-bottom: @gap-md;
    img {
      width: 205px;
      height: 205px;
    }
  }
}

@media (max-width: 640px) {
  .itt-image {
    margin-bottom: @gap-base;
    img {
      width: 185px;
      height: 185px;
    }
  }
}
@media (max-width: 414px) {
  :deep(.iit-contents) {
    .product-info-right {
      max-width: 100%;
    }
  }
}
</style>
