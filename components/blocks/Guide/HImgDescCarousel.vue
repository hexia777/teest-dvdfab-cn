<script setup lang="ts">
defineOptions({ name: 'HImgDescCarousel' })
const props = defineProps({
  // h 标题
  title: {
    type: String,
    default: '',
  },
  // h 标题描述信息
  desc: {
    type: String,
    default: '',
  },
  blockClass: {
    type: String,
    default: 'no-bg',
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
})
const curObj = ref<any>(props.items[0] || {})
const windowWidth = ref<any>(null)
const activeIndex = ref<number>(0)
activeIndex.value = 0
const resizeHandle = () => {
  windowWidth.value = window.innerWidth
}
const onHover = (i: number) => {
  activeIndex.value = i || 0
  curObj.value = props.items[i] || {}
}
onMounted(() => {
  window.addEventListener('resize', resizeHandle)
  resizeHandle()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandle)
})
</script>

<template>
  <div class="block-box guide-new-con" :class="blockClass">
    <BaseContainer>
      <h2 class="title" v-html="title"></h2>
      <div class="content">
        <template v-if="windowWidth && windowWidth <= 1024">
          <div v-for="(item, index) in items" :key="index" class="tc">
            <my-img :src="item.media?.data?.attributes?.url" width="258" height="242" />
            <p class="right" v-html="item.desc"></p>
          </div>
        </template>
        <template v-if="windowWidth && windowWidth > 1024">
          <my-img :src="curObj.media?.data?.attributes?.url" width="258" height="242" />
          <p class="right" v-html="curObj.desc"></p>
        </template>
      </div>
      <ul class="ul-con">
        <li
          v-for="(item, i) in items"
          :key="i"
          :class="{ active: activeIndex === i }"
          @mouseover="onHover(i)"
          v-html="item.title"
        ></li>
      </ul>
    </BaseContainer>
  </div>
</template>
<style scoped lang="less">
.guide-new-con {
  .title {
    text-align: center;
    margin-bottom: 40px;
    padding: 0 10px;
  }
  .content {
    display: flex;
    align-items: center;
    min-height: 250px;
    img {
      width: 258px;
      margin-right: 30px;
    }
    :deep(.right) {
      a {
        color: @primary-color !important;
      }
    }
    @media screen and (max-width: 1024px) {
      padding: 20px;
      flex-wrap: wrap;
      justify-content: center;
      flex-direction: column;
      .right {
        margin-top: 30px;
        text-align: center;
      }
      img {
        margin-right: 0;
      }
    }
  }
  .tc {
    margin-bottom: 2rem;
    text-align: center;
  }
  .ul-con {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 1024px) {
      padding: 0 20px;
      display: none;
    }
    li {
      width: calc((100% - 60px) / 4);
      margin-right: 20px;
      border-radius: 10px;
      border: 1px solid rgba(0, 169, 240, 0.3);
      text-align: center;
      padding: 14px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      &:last-of-type {
        margin-right: 0;
      }
      &.active {
        border: 1px solid @primary-color;
        color: @primary-color;
        &::before {
          content: '';
          display: block;
          border-width: 10px;
          border-style: solid;
          border-color: transparent transparent @primary-color transparent;
          position: absolute;
          top: -20px;
        }
      }
    }
  }
}
</style>
