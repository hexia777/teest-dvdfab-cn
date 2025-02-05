<script setup lang="ts">
defineOptions({ name: 'HImgTitleTextStep' })
const $t = useI18n().value
const props: any = defineProps({
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
  // 链接
  manualData: {
    type: Object,
    default: () => {},
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
})
const macData: any = useAttrs().macData || props
const proInfo = useProInfo().value || {}
const blockData: any = reactive({
  title: '',
  desc: '',
  manualData: '',
  items: '',
})

const timer = ref<any>({})
const guideActive = ref<number>(0)
const blockActive = ref<number>(0)
const go = () => {
  if (!timer.value) {
    timer.value = setInterval(() => {
      autoPlay()
    }, 3000)
  }
}
const stop = () => {
  clearInterval(timer.value)
  timer.value = null
}

const autoPlay = () => {
  changeTab(guideActive.value + 1)
}
const changeTab = (index: number) => {
  if (index < 0) {
    index = props.items?.length - 1
  } else if (index > props.items?.length - 1) {
    index = 0
  }
  guideActive.value = index
}

const renderData = (os: string) => {
  if (os === 'mac') {
    for (const key in blockData) {
      blockData[key] = macData && key in macData ? macData[key] : props[key]
    }
  } else {
    for (const key in blockData) {
      blockData[key] = props[key]
    }
  }
}

renderData(useOs().value)

watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal)
  },
)
const mobile = useStore.common().mobile
</script>

<template>
  <div class="block-box" :class="[blockClass.value, proInfo.system]">
    <BaseContainer>
      <div class="tit">
        <h2
          class="block-title text-center"
          :class="{ pb40: !desc && !blockData.manualData?.url }"
          v-html="blockData.title"
        ></h2>
        <p
          v-if="desc"
          class="block-desc text-center pt20"
          :class="{ pb40: !blockData.manualData?.url }"
          v-html="blockData.desc"
        ></p>
      </div>
      <transition-group tag="ul" name="list" class="transition-ul">
        <li v-show="blockActive == 0" key="divId0" class="list-item">
          <div v-if="blockData.manualData?.url" class="tc block-tips mt20 pb40">
            <a :href="blockData.manualData?.url" target="_blank" v-html="blockData.manualData?.label"></a>
          </div>
          <div class="solutions-content" @mouseenter="stop" @mouseleave="go">
            <div class="left">
              <div v-for="(item, index) in blockData.items" :key="index">
                <div v-show="index == guideActive" class="img-box box">
                  <my-img
                    :src="item.media?.data?.attributes?.url"
                    :width="item.media?.data?.attributes?.width"
                    :height="item.media?.data?.attributes?.height"
                    :alt="item?.mediaAlt"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div class="right">
              <div class="content-box pt20 pb20 border-primary">
                <div v-for="(item, index) in blockData.items" :key="'solutions_list' + index">
                  <div
                    class="content-item mb32"
                    :class="{ active: index == guideActive || mobile }"
                    @mouseenter="guideActive = index"
                  >
                    <div class="title step" v-html="$t.common['step_1'].replace('1', index + 1 + '')"></div>
                    <div v-if="item.title" class="font-700 font-s-18" v-html="item.title"></div>
                    <div
                      v-show="(index == guideActive || mobile) && item.desc"
                      class="desc pt10 font-s-14"
                      v-html="item.desc"
                    ></div>
                    <div class="img-box">
                      <my-img
                        :src="item.media?.data?.attributes?.url"
                        :width="item.media?.data?.attributes?.width"
                        :height="item.media?.data?.attributes?.height"
                        :alt="item?.mediaAlt"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </BaseContainer>
  </div>
</template>
<style lang="less" scoped>
@theme-color: #b4e9ff;
@highlight-color: @primary-color;
.transition-ul {
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  li {
    width: 100%;
    display: inline-block;
  }
  :deep(a:hover) {
    text-decoration: underline;
  }
}
.solutions-content .img-box {
  max-width: 722px;
  img {
    max-width: 100%;
    height: auto;
  }
}
.theme-musicfab {
  @musicfab-theme-color: #b8e7db;
  @musicfab-highlight-color: #00bda1;
  .solutions-content .img-box {
    border: 0 none;
    border-color: transparent;
  }
  .solutions-content .right .content-box {
    border-color: @musicfab-theme-color;
  }
  .solutions-content .right .step::before {
    background: @musicfab-theme-color;
  }
  .solutions-content .right .active .step::before {
    background: @musicfab-highlight-color;
  }
  .solutions-content .right .active.content-item {
    background: @musicfab-highlight-color;
  }
  .block-tips a {
    color: @musicfab-highlight-color;
  }
}
.theme-recordfab {
  .solutions-content .img-box {
    border: 0 none;
    border-color: transparent;
  }
}
#guide.anchor:target {
  position: relative;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s;
}
.list-enter, .list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(50%);
}
.block {
  padding: (80px) 0;
  background: #fff;
  color: @base-text-color;
}
.guide-img {
  padding: 0 (85px);
  .img_box {
    margin: 0 auto;
    max-width: (780px);
    width: 100%;
    & > div {
      position: relative;
      width: 100%;
      padding-top: 689 / 1050 * 100%;
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 100%;
      max-height: 100%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
}

.desc {
  :deep(a) {
    color: #fff;
    text-decoration: underline;
    &:hover {
      opacity: 0.7;
    }
  }
}

.block-tips {
  color: @highlight-color;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
  span {
    cursor: pointer;
  }
  a {
    color: @highlight-color;
  }
}
.solutions-content {
  display: flex;
  .right {
    // width: 478/1200 * 100%;
    width: 39.83%;
    .content-box {
      margin-left: (30px);
      padding-left: (12px);
      border-left-width: 1px;
      border-left-style: solid;
      height: 100%;
      position: relative;
    }
    .content-item {
      margin-bottom: (32px);
      cursor: pointer;
      position: relative;
      text-align: left;
      white-space: initial;
      &:last-child {
        // margin-bottom: 0;
      }
      .desc {
        display: none;
      }
    }
    .img-box {
      display: none;
      margin-top: (20px);
    }
    .step {
      &::before {
        content: '';
        width: (8px);
        height: (8px);
        background-color: @border-primary-color;
        border-radius: 50%;
        position: absolute;
        left: -12px;
        transform: translateX(-50%);
        top: 8px;
      }
    }
    .active {
      .step {
        font-weight: bold;
        &::before {
          top: (22px);
          width: (12px);
          height: (12px);
          background: @primary-color;
          border-radius: 50%;
        }
      }
      &.content-item {
        color: #fff;
        background: @primary-color;
        border-radius: (10px);
        @apply p20 pb12;
      }
      .desc {
        display: block;
      }
    }
  }
  .left {
    flex: 1;
    display: flex;
    padding: 38px 0;
    align-items: center;
    .box {
      width: 100%;
    }
  }
  .img-box {
    position: relative;
    width: 100%;
    border: (4px) solid @theme-color;
    border-radius: (20px);
    overflow: hidden;
  }
}
.android {
  .solutions-content {
    .img-box {
      border: none;
    }
  }
}
.iframe-box {
  margin-top: (30px);
  margin-left: auto;
  margin-right: auto;
  position: relative;
  width: 100%;
  min-height: 550px;
  max-width: (980px);
  @media (max-width: 980px) {
    min-height: 56vw;
  }
  //padding-top: 550/980 * 100%;
}
:deep(.swiper-pagination-bullet) {
  @apply mr30 cursor-pointer !w-full !h-full !op-100 !b-rd-8 p24 text-left;
  background: none;

  h4 {
    @apply pt24 pb16;
    line-height: @base-line-height;
  }

  .num {
    @apply b-rd-14 pt5 pb5 pl20 pr20 font-size-14;
    color: @fifth-color;
    background: #f9f0ff;
  }
}

:deep(.swiper-pagination-bullet-active) {
  background: @primary-color;
}

@media (max-width: 1024px) {
  .solutions-content {
    flex-direction: column;
    .left {
      display: none;
    }
    .right {
      width: 100%;
      .img-box {
        max-width: (722px);
        margin-left: auto;
        margin-right: auto;
      }
      .content-box {
        padding: 0;
        margin-left: 0;
        border-left: 0;
      }
      .content-item {
        & + .content-item {
          margin-top: (30px);
        }
        text-align: center;
        .step {
          &::before {
            display: none;
          }
        }
        .desc {
          display: block;
        }
        .img-box {
          display: block;
        }
      }
      .active.content-item {
        color: initial;
        background: transparent;
        border-radius: 0;
        padding: 0;
      }
    }
  }

  .theme-musicfab {
    @musicfab-theme-color: transparent;
    @musicfab-highlight-color: transparent;
    .solutions-content .img-box {
      border-color: @musicfab-theme-color;
    }
    .solutions-content .right .active .step::before {
      background: @musicfab-highlight-color;
    }
    .solutions-content .right .active.content-item {
      background: @musicfab-highlight-color;
    }
    .block-tips a {
      color: @musicfab-highlight-color;
    }
  }
  .img-box {
    img {
      @apply w100\% hauto;
    }
  }
}
@media (max-width: 640px) {
  .guide-wrap {
    padding-bottom: (40px);
  }
  .solutions-content .right .content-item {
    text-align: left;
    margin-bottom: 28px;
    .img-box {
      margin-top: 12px;
    }
    .desc {
      padding-top: 8px;
    }
  }
}
</style>
