<script setup lang="ts">
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'dvdfab', // normal other dvdfab streamfab musicfab middle
  },
  textTheme: {
    type: String,
    default: 'dark', // dark light
  },
  // 产品信息
  proInfo: {
    type: Object,
    default: () => {},
  },
  // banner 标题
  title: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // 自定样式
  style: {
    type: Object,
    default: () => {},
  },
  // banner 按钮组信息
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  // 更新 tips 文案
  updateText: {
    type: String,
    default: '',
  },
  rightImgInfo: {
    type: Object,
    default: () => {},
  },
})

// 接受子组件的方法, 抛出去
const emits = defineEmits(['tabClick'])

const tabClick = (os: string) => {
  emits('tabClick', os)
}
</script>

<template>
  <div class="pro-top-banner" :class="[`ptb-theme-${type}`, `ptb-text-${textTheme}`]" :style="style">
    <BaseContainer>
      <div class="ptb-top flex flex-items-center">
        <div class="ptb-left">
          <h1 class="ptb-title mb20" v-html="props.title"></h1>
          <div class="ptb-desc mb40 font-s-20" v-html="props.desc"></div>
          <slot name="middle" :data="$attrs"></slot>
          <BaseSwitchOs class="mb18" @tab-click="tabClick" />
          <div class="btn-group flex">
            <div v-for="(btn, idx) in props.btnList" :key="'btn-item' + idx" class="btn-item">
              <component :is="btn.component" v-bind="{ ...btn.info }" />
              <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
                <i :class="btn.tipIconClass"></i>
                <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
              </div>
            </div>
          </div>
          <div v-if="props.updateText" class="font-s-14 gray-color mt40" v-html="props.updateText"></div>
        </div>
        <div v-if="rightImgInfo && Object.keys(rightImgInfo).length" class="ptb-right">
          <MyImg
            class="my-img"
            :class="rightImgInfo.class"
            :src="rightImgInfo.url"
            :width="rightImgInfo.width"
            :height="rightImgInfo.height"
            :alt="rightImgInfo.alt"
          />
          <span v-if="rightImgInfo.showTip" class="img-desc font-s-18 font-bold">{{
            props.proInfo.name
          }}</span>
          <slot name="img-extra"></slot>
        </div>
      </div>
      <!-- 底部的 slot -->
      <slot name="bottom" :data="$attrs"></slot>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.pro-top-banner {
  padding: @gap-lg 0;
  .ptb-top {
    gap: 30px;
  }
  .btn-group {
    gap: 20px;
  }
  .ptb-right {
    position: relative;
    transition: 0.2s;
  }
  .tip-text {
    color: @text-gray-color;
  }
}
.ptb-theme-streamfab {
  position: relative;
  padding: 0;
  .ptb-top {
    align-items: flex-start;
  }
  .ptb-left {
    padding-top: @gap-lg;
  }
  .my-img {
    position: relative;
    top: 0;
  }
}
// 居中布局
.ptb-theme-middle {
  text-align: center;
  .ptb-top {
    justify-content: center;
  }
  .btn-group {
    justify-content: center;
  }
}

.img-desc {
  background: linear-gradient(270deg, #00a38a, #26c656);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  left: 10%;
  top: 41%;
}

.ptb-text-light {
  color: @text-white-color;
  .tip-text {
    color: @text-white-color;
  }
}

.float-up-down {
  position: relative;
  animation: float-up-down 5s ease-in-out infinite;
}
@keyframes float-up-down {
  0% {
    top: 0px;
  }
  50% {
    top: 20px;
  }
  100% {
    top: 0px;
  }
}

@media (max-width: 1200px) {
  .ptb-right {
    img {
      width: 360px;
      height: auto;
    }
  }
}
@media (max-width: 1024px) {
  .pro-top-banner {
    min-height: unset;
  }
  .ptb-right {
    display: none;
  }
}
@media (max-width: 640px) {
  .btn-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
