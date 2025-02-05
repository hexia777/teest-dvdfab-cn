<script setup lang="ts">
defineOptions({ name: 'InputOut' })
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => {},
  },
  topLine: {
    type: Boolean,
    default: true,
  },
  // 盒子图信息
  boxImage: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 左边文案信息
  leftData: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 右边文案信息
  rightData: {
    type: Object,
    default: () => {
      return {}
    },
  },
  product: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const boxImg = computed(() => {
  const datas =
    props.product.filter((item: any) => {
      return item.system === useOs().value
    })[0] ||
    props.product[0] ||
    {}

  // 产品盒子图
  const proBoxImg =
    datas.imgs?.filter((item: any) => {
      return item.label === 'product'
    }) || []

  // 基础盒子图-aio产品会带gift
  const basicBoxImg =
    datas.imgs?.filter((item: any) => {
      return item.label === 'basic'
    }) || []

  return proBoxImg.length > 0 ? proBoxImg : basicBoxImg
})
</script>

<template>
  <div class="block-box" :class="blockClass && blockClass.value ? 'blockClass.value' : 'no-bg'">
    <BaseContainer class="pos-relative">
      <div v-if="topLine" class="top-line"></div>
    </BaseContainer>

    <BaseContainer class="outer-container flex flex-justify-center">
      <template v-if="leftData">
        <!-- 左边描述 -->
        <div class="content mr-60">
          <div class="title font-s-24"><span v-html="leftData.title"></span></div>
          <p class="flex desc" v-html="leftData.desc"></p>
        </div>
        <!-- 左边图标 -->
        <div class="icon-box flex">
          <my-img width="42" height="80" :src="useImgPath().value + '/cn/common/arrow_right_to.png'" />
        </div>
      </template>

      <!-- 中间图片 -->
      <div class="box flex flex-items-center">
        <my-img :width="300" :height="300" :src="boxImg?.[0]?.url" class="ml-40 mr-40 h-auto" />
      </div>

      <template v-if="rightData">
        <!-- 右边图标 -->
        <div class="icon-box flex">
          <my-img width="42" height="80" :src="useImgPath().value + '/cn/common/arrow_right_to.png'" />
        </div>

        <!-- 右边描述 -->
        <div class="content ml-60">
          <div class="title font-s-24"><span v-html="rightData.title"></span></div>
          <p class="flex desc" v-html="rightData.desc"></p>
        </div>
      </template>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.top-line {
  width: 100%;
  margin-top: -40px;
  padding-bottom: 40px;
  border-top: 1px solid #eee;
}
.box {
  margin-top: 40px;
}
.icon-box {
  @apply w42;
  @apply flex-items-center;
  @apply flex-justify-center;
  margin-top: 40px;
}

.content {
  @apply flex;
  @apply flex-col;
  width: 416px;
  .title {
    @apply font-semibold;
    height: 40px;
  }
  .desc {
    flex: 1;
    @apply flex-items-center;
  }
}
@media screen and(max-width:1024px) {
  .outer-container {
    @apply flex-col;
    @apply flex-items-center;
  }
  .icon-box {
    @apply hidden;
  }
  .content {
    max-width: 100%;
    @apply ml0;
    @apply mr0;
    @apply mb20;
  }
}
@media screen and(max-width:768px) {
  .box {
    max-width: 300px;
    width: 70%;
    margin-top: 0;
    img {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
​
