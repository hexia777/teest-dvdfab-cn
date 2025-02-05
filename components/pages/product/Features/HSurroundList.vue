<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: String,
    default: 'block-box has-bg bg-normal',
  },
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
  leftList: {
    type: Array<any>,
    default: () => [],
  },
  rightList: {
    type: Array<any>,
    default: () => [],
  },
  descData: {
    type: Object,
    default: () => {
      return {
        position: 'bottom', // top bottom
        bgClass: '', // bottom 时使用
        cardClass: '',
        text: '',
      }
    },
  },
})
// descData 展示位置的枚举值
enum DescTextPosition {
  top = 'top',
  bottom = 'bottom',
}

const iconCardConfig = {
  iconPositon: 'top',
  theme: 'opacity',
  iconStyle: {
    color: '#ffffff',
    backgroundColor: '@primary-color',
    fontSize: '22px',
    width: '60px',
    height: '60px',
  },
  hasHover: true,
}
</script>

<template>
  <div class="w100%">
    <div :class="blockClass">
      <BaseContainer>
        <h2 class="text-center mb40" v-html="title"></h2>
        <PagesProductCardTextList
          v-if="descData.position == DescTextPosition.top"
          class="text-center"
          :list="[descData.text]"
        />
        <div v-else class="mobile-desc text-center mb12" v-html="descData.text"></div>
        <div class="surround-list flex flex-items-start flex-justify-between pt30">
          <!-- 左侧 -->
          <div class="surround-items">
            <template v-for="(item, idx) in leftList" :key="'left-item' + idx">
              <PagesProductCardIconTitleText class="surround-item" v-bind="{ ...item, ...iconCardConfig }" />
            </template>
          </div>
          <!-- 中间 -->
          <div class="surround-center">
            <MyImg v-bind="imgData" />
          </div>
          <!-- 右侧 -->
          <div class="surround-items">
            <template v-for="(item, idx) in rightList" :key="'left-item' + idx">
              <PagesProductCardIconTitleText class="surround-item" v-bind="{ ...item, ...iconCardConfig }" />
            </template>
          </div>
        </div>
      </BaseContainer>
    </div>
    <div v-if="descData.position == DescTextPosition.bottom" class="bg-normal">
      <div class="desc-list pt20 pb20" :class="descData.bgClass">
        <BaseContainer>
          <PagesProductCardTextList class="text-center" :card-class="'text-color'" :list="[descData.text]" />
        </BaseContainer>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.surround-center {
  width: 100%;
  max-width: 600px;
  align-self: center;
  img {
    width: 100%;
  }
}
.surround-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.surround-item {
  & + .surround-item {
    margin-top: 50px;
  }
}
.mobile-desc {
  display: none;
}

@media (max-width: 768px) {
  .desc-list {
    display: none;
  }
  .mobile-desc {
    display: block;
  }

  .surround-list {
    flex-direction: column;
    align-items: center;
    padding-top: 0;
  }
  .surround-center {
    order: 1;
  }
  .surround-items {
    order: 2;
    margin-top: 50px;
  }
}
</style>
