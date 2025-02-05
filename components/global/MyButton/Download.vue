<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '', // 下载链接
  },
  osVersion: {
    type: String,
    default: '', // Windows 11/10/8.1/8/7
  },
  icon: {
    type: String,
    default: '', // 自定义
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  transition: {
    type: Boolean,
    default: true, // 是否显示hover动画
  },
  label: {
    type: String,
    default: '', // Try for Free
  },
  theme: {
    type: String,
    default: 'primary', // primary(默认蓝色) border white orange
  },
  size: {
    type: String,
    default: 'large', // large:278*66, medium:220*48, small:180*48,  normal:170*40, mini:pl15 pr15
  },
  os: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    default: '',
  },
  elkParams: {
    type: Object,
    default: () => ({
      event: 'buy_now',
      pids: [712],
      // products: this.$getProducts('v2', proInfo.pid, {
      //   elkParams: { price: proInfo.price },
      // }),
    }),
  },
})

const openDownloadPage = (event: any) => {
  useOpenDownloadPage(event)
}

const version = computed(() => {
  if (props.osVersion) {
    return props.osVersion
  }
})
</script>

<template>
  <MyButton
    data-my-btn-type="download"
    class="flex-col"
    :class="{
      [`download-button--${theme}`]: theme,
      transition: !transition,
      [`${theme}`]: theme,
    }"
    :href="href"
    :theme="theme"
    :size="size"
    @click="openDownloadPage"
  >
    <slot>
      <span class="my-btn flex-center">
        <i v-if="showIcon || icon" :class="icon ? icon : 'icon-' + os" class="iconfont-sg v-mid pr-10"></i>
        <span class="relative font-700" v-html="label"></span>
      </span>
      <span v-if="osVersion" class="os-version !m0 pt5" v-html="version"></span>
    </slot>
  </MyButton>
</template>

<style scoped lang="less">
.os-version {
  font-weight: normal;
}
.download-button--primary {
  .os-version {
    color: #fff;
  }
}
.download-button--white {
  background: #fff;
  color: @primary-color;
  &:hover {
    background: @primary-color;
    color: #fff;
    .os-version {
      color: #fff;
    }
  }
  &::before {
    transform: none;
  }
}
.download-button--border {
  &:hover {
    background: @primary-color;
    color: #fff;
    .os-version {
      color: #fff;
    }
  }
}
.os-version {
  font-size: @font-size-xs;
  color: #909090;
}
.my-button {
  &:hover {
    .os-version {
      color: #fff;
    }
  }
}
.my-button.small {
  .iconfont-single {
    @apply font-size-22;
  }
}
</style>
