<script setup lang="ts">
const props = defineProps({
  theme: {
    type: String,
    default: 'normal', // normal opacity
  },
  iconPositon: {
    type: String,
    default: 'left', // left right top
  },
  icon: {
    type: String,
    default: '',
  },
  // icon 的样式
  iconStyle: {
    type: Object,
    default: () => {
      return {
        color: '#00a9f0',
        backgroundColor: '#f0f9ff',
        fontSize: '50px',
        width: '70px',
        height: '70px',
      }
    },
  },
  // 是否有 hover 效果
  hasHover: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  // 阴影位置
  shandow: {
    type: String,
    default: '', // '' up down
  },
})
const shandowMap: any = {
  up: 'up-shandow',
  down: 'down-shandow',
}
const iconBgColor = props.theme === 'fill' ? '#ffffff' : '#f0f9ff'
</script>

<template>
  <div
    class="itt-card-box flex flex-items-center"
    :class="[
      shandowMap[props.shandow] || '',
      'iit-theme-' + theme,
      'iit-posi-' + iconPositon,
      hasHover ? 'hover' : '',
    ]"
  >
    <div
      class="icon-box flex-none flex-center b-radius-lg mr20"
      :style="{ ...iconStyle, backgroundColor: iconBgColor }"
    >
      <i class="iconfont-sg" :class="icon" :style="{ fontSize: iconStyle.fontSize }"></i>
    </div>
    <div class="">
      <div class="title4 mb10 mt10" v-html="title"></div>
      <div v-html="desc"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.itt-card-box {
  background-color: @bg-white;
  border-radius: @b-radius-sm;
  padding: 20px;
  position: relative;
  border: 1px solid @bg-white;
  transition: border 0.2s;

  &.iit-theme-opacity {
    background-color: @bg-op-white;
    border-color: @bg-op-white;
  }
  &.iit-theme-fill {
    background-color: #f1fafd;
    border-color: @bg-op-white;
  }
  &.hover {
    cursor: pointer;
    &:hover {
      border-color: @primary-color;
    }
  }
  .icon-box {
    align-self: center;
  }
}
// icon 在上方
.iit-posi-top {
  &.itt-card-box {
    padding: 40px 20px 20px;
  }
  .icon-box {
    background-color: @primary-color;
    position: absolute;
    top: -30px;
    left: 20px;
  }
}
</style>
