<script setup lang="ts">
const props = defineProps({
  // 主题
  type: {
    type: String,
    default: 'normal', // normal other middle dvdfab streamfab musicfab
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
  // 标题是否跳转
  titleIsLink: {
    type: Boolean,
    default: true,
  },
  // 标题跳转路径
  titleLink: {
    type: String,
    default: '',
  },
  // banner 描述信息
  desc: {
    type: String,
    default: '',
  },
  // banner 按钮组信息
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  // 是否展示系统切换按钮
  showSwitchOs: {
    type: Boolean,
    default: false,
  },
  bgImg: {
    type: String,
    default: '',
  },
  imgInfo: {
    type: Object,
    default: () => {},
  },
  boxImgElkParams: {
    type: Object,
    default: () => {},
  },
  titleElkParams: {
    type: Object,
    default: () => {},
  },
})

// 接受子组件的方法, 抛出去
const emits = defineEmits(['tabClick'])
const isMobile = useStore.common().mobile
const tabClick = (os: string) => {
  emits('tabClick', os)
}
if (!useStore.common().mobile) {
  const link = [
    {
      src: props.bgImg,
      rel: 'preload',
      as: 'image',
      fetchpriority: 'high',
    },
  ]

  if (props.imgInfo && Object.keys(props.imgInfo).length) {
    link.push({
      src: props.imgInfo.url,
      rel: 'preload',
      as: 'image',
      fetchpriority: 'high',
    })
  }
  usePageOtherHead({
    link,
  })
}
</script>
<!-- #fff url(https://c1.dvdfab.cn/images/article/1x_m/banner_new.jpg) no-repeat 50% -->
<template>
  <div
    class="art-top-banner"
    :class="[`ptb-theme-${type}`]"
    :style="
      bgImg && !isMobile
        ? { background: ` #fff url(${props.bgImg}) no-repeat 50%`, backgroundSize: 'cover' }
        : {}
    "
  >
    <BaseContainer>
      <div class="ptb-top flex flex-items-center gap 40">
        <a
          v-if="imgInfo && Object.keys(imgInfo).length"
          v-track:click="{
            event: 'click',
            ...boxImgElkParams,
          }"
          :href="proInfo.url"
          class="ptb-image flex-center"
        >
          <MyImg
            class="my-img"
            :class="imgInfo.class"
            :src="imgInfo.url"
            :width="imgInfo.width"
            :height="imgInfo.height"
            :alt="imgInfo.alt"
            loading=""
          />
        </a>
        <div class="ptb-content">
          <div class="title3 ptb-title mb12" :class="[props.desc ? 'mb12' : 'mb30']">
            <span v-if="!titleIsLink" v-html="props.title"></span>
            <a
              v-else
              v-track:click="{
                event: 'click',
                ...titleElkParams,
              }"
              :href="titleLink"
              v-html="props.title"
            ></a>
          </div>
          <slot name="middle" :data="$attrs"></slot>
          <div v-if="props.desc" class="ptb-desc mb30" v-html="props.desc"></div>

          <BaseSwitchOs v-if="showSwitchOs" class="mb16" @tab-click="tabClick" />
          <div class="btn-group flex">
            <div v-for="(btn, idx) in props.btnList" :key="'btn-item' + idx" class="btn-item">
              <component
                :is="btn.component"
                v-if="btn.component === 'MyButtonDownload'"
                v-bind="{ ...btn.info }"
              />
              <component :is="btn.component" v-else v-track:click="btn.click" v-bind="{ ...btn.info }" />
              <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
                <i :class="btn.tipIconClass"></i>
                <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部的 slot -->
      <slot name="bottom" :data="$attrs"></slot>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.art-top-banner {
  min-height: 300px;
  background: linear-gradient(180deg, #0788fa, #c55afe);
  background-size: cover;
  background-position: center;
  color: @text-white-color;
  padding: 20px 0;
  .ptb-title {
    a,
    span {
      color: @text-white-color;
    }
  }
  .ptb-top {
    gap: 30px;
  }
  .btn-group {
    gap: 20px;
  }
  .ptb-right {
    position: relative;
  }
  .tip-text {
    color: @text-white-color;
  }
  :deep(.ptb-desc) {
    a {
      color: #fde800;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
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
@media (max-width: 1024px) {
  .art-top-banner {
    background: linear-gradient(180deg, #0788fa, #c55afe) !important;
  }
  .ptb-image {
    img {
      width: 205px;
      height: 205px;
    }
  }
}
@media (max-width: 900px) {
  .art-top-banner {
    min-height: unset;
  }
  .ptb-image {
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
