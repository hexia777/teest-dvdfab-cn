<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '您可以使用 RecordFab 錄製哪些內容',
  },
  list: {
    type: Array as any,
    default: () => [
      {
        title: '串流影片',
        desc: '從任何串流服務輕鬆錄製您最喜愛的電影和節目。',
        imgPath: 'https://c2.dvdfab.cn/images/recordfab/features/878_1.png',
      },
    ],
  },
  blockClass: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const activeFeatureIndex = ref<number>(1)
const activeFeatureItem = computed(() => {
  return props.list.find((item: { index: number }) => item.index === activeFeatureIndex.value) || {}
})
</script>
<template>
  <div class="surround-feature-container block-box" :class="blockClass.value">
    <BaseContainer>
      <h2 class="title font-40">{{ title }}</h2>
      <div class="view container">
        <div v-for="(item, index) in list" :key="index" class="feature-item">
          <div>
            <div class="m-title">{{ item.title }}</div>
            <div class="m-desc" v-html="item.desc"></div>
          </div>

          <my-img lazy :src="item.imgPath" :alt="item.alt" height="300" width="70%" />
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<style scoped lang="less">
.surround-feature-container {
  .surround-wrapper {
    margin: 0 auto;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 98px;
    background: #f4f6ff;
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    padding: 32px 16px 16px;
    &:last-child {
      gap: 0;
    }
    &:nth-of-type(4n) {
      gap: 0;
    }
    &.active {
      background-color: @primary-color;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
    }
  }

  .title {
    font-weight: bold;
    color: #333333;
    text-align: center;
    margin-bottom: 50px;
  }
}

.view {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  .feature-item {
    width: calc((100% - 30px) / 4);
    .m-title {
      margin-bottom: 1.25rem;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.4;
    }

    .m-desc {
      line-height: 1.625;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 400;
    }
    img {
      width: 100%;
      height: auto;
    }
  }
}

@media (max-width: 1200px) {
  .surround-feature-container {
    height: auto !important;

    .surround-wrapper {
      display: none;
    }
  }
}

@media (max-width: 640px) {
  .surround-feature-container {
    padding: 40px 0px;
    margin-bottom: 0px;
  }
  .view .feature-item {
    gap: 10px;
    width: 100%;
  }
  .view .feature-item {
    .m-title,
    .m-desc {
      text-align: left;
    }
    img {
      width: auto;
    }
  }
}
</style>
