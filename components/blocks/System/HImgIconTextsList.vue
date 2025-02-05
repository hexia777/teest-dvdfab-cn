<script setup lang="ts">
defineOptions({ name: 'HImgIconTextsList' })
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => ({
      value: 'no-bg',
    }),
  },
  // 大标题
  title: {
    type: String,
    default: '',
  },
  // list
  product: {
    type: Object,
    default: () => {
      return {}
    },
  },
  items: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const macData = useAttrs().macData || props

const cardData = computed(() => {
  const datas =
    props.product.filter((item: any) => {
      return item.system === useOs().value
    })[0] ||
    props.product[0] ||
    {}

  // systemRequirement 需要从items中获取
  const data: any = useOs().value === 'mac' ? macData || props : props
  const systemRequirement =
    data.items && data.items.length
      ? data.items
      : datas.client_info?.data?.attributes?.systemRequirement || []

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
  return {
    systemRequirement,
    boxImg: proBoxImg.length > 0 ? proBoxImg : basicBoxImg,
  }
})
</script>

<template>
  <div class="block-box" :class="[blockClass?.value]">
    <BaseContainer class="outer-container">
      <h2 class="font-s-40 mb-98 text-center" v-html="title"></h2>
      <div class="inner-container flex bg-normal">
        <div v-if="cardData.boxImg?.[0]?.url" class="img-box flex">
          <my-img :width="300" :height="300" :src="cardData.boxImg?.[0]?.url" class="pos-absolute h-auto" />
        </div>
        <ul v-if="cardData.systemRequirement.length">
          <li v-for="(item, index) in cardData.systemRequirement" :key="index">
            <i class="iconfont-sg icon-star"></i>
            <span v-if="item.value" class="ml-5" v-html="item.value"></span>
          </li>
        </ul>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.outer-container {
  padding-bottom: 38px;
}
.inner-container {
  @apply pt-20;
  @apply pb-20;
  @apply pl-80;
  @apply pr-80;
  @apply flex-items-center;
  @apply b-rd-180;
  .img-box {
    @apply w300;
    @apply pos-relative;
    @apply mr-60;
    @apply flex-items-center;
    @apply flex-justify-center;
  }
  @media screen and(max-width:1024px) {
    .img-box {
      @apply w250;
    }
    @apply pl-50;
    @apply pr-50;
  }
  @media screen and(max-width:768px) {
    @apply b-rd-12;
    @apply flex-col;
    .img-box {
      margin-right: 0;
      img {
        width: 100%;
        @apply pos-relative;
      }
    }
  }
}
@media (max-width: 768px) {
  h2 {
    margin-bottom: 40px;
  }
}
</style>
