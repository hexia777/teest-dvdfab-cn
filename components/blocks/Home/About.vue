<script setup lang="ts">
defineOptions({ name: 'HomeAbout' })
interface Item {
  value: string
}
interface LineItem {
  title: string
  desc: string
}
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 大标题
  title: {
    type: String,
    default: 'About DVDFab',
  },
  desc: {
    type: String,
    default: '',
  },
  // 数据list
  items: {
    type: Array<Item>,
    default: () => {
      return []
    },
  },
  // 时间轴list
  lineList: {
    type: Array<LineItem>,
    default: () => {
      return []
    },
  },
})
</script>

<template>
  <div class="block-box" :class="[blockClass?.value]">
    <BaseContainer class="outer-box">
      <h2 class="title font-s-40 mb-40 text-center" v-html="title"></h2>
      <p v-if="desc" class="content-desc text-center mb-40" v-html="desc"></p>
      <div class="about-box tc flex flex-justify-center wow fadeInDown">
        <div v-for="(item, i) in items" :key="'about' + i" class="about-item" v-html="item.value"></div>
      </div>
      <div class="line-box-content">
        <div id="lineBox" class="line-box">
          <div
            v-for="(item, index) in lineList"
            :key="'line' + index"
            class="line-item"
            :class="index % 2 == 0 && index !== lineList.length - 1 ? 'tl' : 'tr text-right'"
          >
            <template v-if="index % 2 == 0 && index !== lineList.length - 1">
              <div class="wrapper wow fadeInDown pos-relative">
                <div class="spot-box top">
                  <div class="spot"></div>
                </div>
                <div class="line-text">
                  <i :class="'tc icon_line'">{{ item.title }}</i>
                  <div class="desc top" v-html="item.desc"></div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="wrapper wow fadeInDown">
                <div class="line-text">
                  <div class="desc bottom" v-html="item.desc"></div>
                  <i :class="'tc icon_line'">{{ item.title }}</i>
                </div>
                <div class="spot-box bottom">
                  <div class="spot"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="about-bg-box">
        <div class="about_bg wow fadeInDown"></div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.wow {
  visibility: visible;
}
.outer-box {
  @apply pos-relative pb-180;
  @media (max-width: 1300px) {
    padding-bottom: 0;
    .title,
    .content-desc {
      margin-bottom: 20px;
    }
  }
  @media (max-width: 768px) {
    .title,
    .content-desc {
      margin-bottom: 10px;
    }
  }
}
.about-box {
  width: 65%;
  margin: auto;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
  .about-item {
    width: 33.33%;
    height: 179px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-size: contain !important;

    &:nth-child(1n) {
      background: img_url('/cn/index/about_1.png') no-repeat center;
    }
    &:nth-child(2n) {
      background: img_url('/cn/index/about_2.png') no-repeat center;
    }
    &:nth-child(3n) {
      background: img_url('/cn/index/about_3.png') no-repeat center;
    }
  }
  :deep(.about-item) {
    div {
      font-size: 36px;
      white-space: nowrap;
      font-weight: 600;
    }
    &:nth-child(1n) {
      div {
        color: #00cfef;
      }
    }
    &:nth-child(2n) {
      div {
        color: #379fef;
      }
    }
    &:nth-child(3n) {
      div {
        color: #8155f6;
      }
    }
  }

  @media (max-width: 1200px) {
    width: 70%;
  }
  @media (max-width: 1024px) {
    .about-item {
      scale: 0.9;
    }
  }
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 640px) {
    width: 100%;
    .about-item {
      height: 130px;
      scale: 0.8;
    }
  }
  @media (max-width: 460px) {
    :deep(.about-item) {
      div {
        font-size: 26px;
      }
    }
  }
}

// 时间轴
.line-box-content {
  padding-top: 200px;
  .line-box {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    min-height: 311px;
    width: 1584px;
    background: img_url('/cn/index/icon_line.png') no-repeat center;
    @media screen and (max-width: 1600px) {
      width: 100%;
    }
  }
  .line-item {
    position: absolute;
    max-width: 300px;
    i {
      color: #fff;
      font-style: initial;
      font-weight: bold;
      line-height: 20px;
    }
    .spot-box {
      .spot {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        position: relative;
        display: inline-block;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff;
        }
      }
      &.top {
        margin-bottom: 20px;
      }
      &.bottom {
        margin-top: 20px;
        font-size: 0;
      }
    }
    .desc {
      font-size: 18px;
      line-height: 1.3;
      &.top {
        margin-top: 10px;
      }
      &.bottom {
        margin-bottom: 10px;
      }
    }
    :deep(.desc) {
      a {
        color: #00b1ff;
        cursor: pointer;
      }
    }
    .icon_line {
      border-radius: 0 10px 0 10px;
      padding: 2px 6px;
      font-size: 14px;
      display: inline-block;
      max-width: 72px;
      text-align: center;
    }
    &:first-child {
      left: 184px;
      top: 280px;
      .spot,
      .icon_line {
        background: #00cfef;
      }
    }
    &:nth-child(2) {
      right: 1187px;
      bottom: 105px;
      .spot,
      .icon_line {
        background: #1db9ec;
      }
    }
    &:nth-child(3) {
      left: 569px;
      top: 201px;
      .spot,
      .icon_line {
        background: #379fef;
      }
    }
    &:nth-child(4) {
      right: 789px;
      bottom: 142px;
      .spot,
      .icon_line {
        background: #4e9bff;
      }
    }
    &:nth-child(5) {
      left: 969px;
      top: 85px;
      .spot,
      .icon_line {
        background: #4772ff;
      }
    }
    &:nth-child(6) {
      right: 373px;
      bottom: 178px;
      .spot,
      .icon_line {
        background: #6d6aff;
      }
    }
    &:nth-child(7) {
      right: 204px;
      bottom: 286px;
      .spot,
      .icon_line {
        background: #8354ff;
      }
    }
    @media screen and (max-width: 1600px) {
      &:first-child {
        left: 0;
      }
      &:nth-child(2) {
        right: 1012px;
        bottom: 108px;
      }
      &:nth-child(3) {
        left: 325px;
        top: 227px;
      }
      &:nth-child(4) {
        right: 679px;
        bottom: 169px;
      }
      &:nth-child(5) {
        left: 702px;
        top: 158px;
      }
      &:nth-child(6) {
        right: 245px;
        bottom: 203px;
      }
      &:nth-child(7) {
        right: 0;
      }
    }
  }

  @media (max-width: 1300px) {
    padding-top: 0;
    .line-box {
      transform: translateX(-35%);
      background: none;
      left: 0;
      transform: none;
      width: auto;
      height: auto;
      display: inline-flex;
      flex-direction: column-reverse;
      &::before {
        content: '';
        height: 100%;
        width: 3px;
        background: img_url('/cn/index/icon_line_3x.png') no-repeat center;
        position: absolute;
        left: 0;
        top: 1px;
        background-size: cover;
      }
    }
    .line-item {
      position: initial;
      text-align: left;
      margin-bottom: 1rem;
      .spot-box {
        position: absolute;
        left: -0.4rem;
        top: 0;
        .spot {
          width: 1rem;
          height: 1rem;
          &::before {
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      }
      .spot-box.top {
        margin-bottom: 0;
      }
      .spot-box.bottom {
        margin-top: 0;
      }
      .line-text {
        overflow: hidden;
        padding-left: 1.2rem;
        i {
          margin-bottom: 0.5rem;
        }
        .desc.bottom {
          margin-bottom: 0;
        }
        .desc.top {
          margin-top: 0;
        }
        .icon_line {
          display: block;
        }
      }
      &.tr {
        .line-text {
          display: flex;
          flex-direction: column;
          i {
            order: 1;
          }
          .desc.bottom {
            order: 2;
          }
        }
      }
      &:first-child {
        padding-bottom: 1rem;
      }
    }
  }
}

// bg
.about-bg-box {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  .about_bg {
    background: img_url('/cn/index/icon_about_bg.png') no-repeat center;
    height: 667px;
    width: 870px;
  }
  @media (max-width: 1300px) {
    bottom: 80px;
  }
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
