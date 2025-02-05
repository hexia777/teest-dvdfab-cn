<script setup lang="ts">
defineOptions({ name: 'SwitchOs' })
const emits = defineEmits(['tabClick'])
const props = defineProps({
  theme: {
    type: String,
    default: 'light', // light | blue
  },
  winLabel: {
    type: String,
    default: 'Windows',
  },
  macLabel: {
    type: String,
    default: 'Mac',
  },
  macLink: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '252px',
  },
  os: {
    type: String,
    default: 'win',
  },
  // 是否全局更新
  isUpdateAll: {
    type: Boolean,
    default: true,
  },
})
const osList = reactive<
  Array<{
    value: string
    icon: string
    label: string
    link: string
    active: boolean
  }>
>([
  {
    value: 'win',
    icon: 'icon-win',
    label: props.winLabel,
    link: '',
    active: useOs().value === 'win' || props.macLink,
  },
  {
    value: 'mac',
    icon: 'icon-mac',
    label: props.macLabel,
    link: props.macLink,
    active: useOs().value === 'mac' && !props.macLink,
  },
])

// 切换操作系统
const switchOs = (os: string, link: string) => {
  if (link) {
    return
  }
  osList.forEach((item) => {
    item.active = item.value === os
  })
  if (props.isUpdateAll) {
    useStore.common().client = os
    useOs().value = os
  }
  emits('tabClick', os)
}
if (props.os && !props.isUpdateAll) {
  switchOs(props.os)
}
</script>

<template>
  <div
    class="flex-inline items-center b-rd-20 cursor-pointer os-switch"
    :class="props.theme ? props.theme : 'light'"
    :style="{ 'min-width': props.width }"
  >
    <div
      v-for="item in osList"
      :key="item.value"
      v-track-label="getComponentsName(item.value)"
      class="pl17 pr17 pt2 pb2 b-rd-20 flex-center w-50% os-switch-item"
      :class="{ active: item.active }"
      @click="switchOs(item.value, item.link)"
    >
      <template v-if="item.link">
        <a :href="item.link" class="os-switch-a w100% h100%">
          <i class="iconfont-sg" :class="item.icon"></i>
          <span class="ml5 os-switch-item-text pt-1">{{ item.label }}</span>
        </a>
        <div>
          <i class="iconfont-sg" :class="item.icon"></i>
          <span class="ml5 os-switch-item-text pt-1">{{ item.label }}</span>
        </div>
      </template>
      <template v-else>
        <i class="iconfont-sg" :class="item.icon"></i>
        <span class="ml5 os-switch-item-text pt-1">{{ item.label }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.os-switch {
  &.light {
    background: rgba(5, 0, 9, 0.2);
    color: #fff;
    .os-switch-item {
      position: relative;
      &.active {
        background: rgba(5, 0, 9, 0.5);
        color: #fff;
      }
      &:not(.active) {
        opacity: 0.8;
      }
      &:hover {
        opacity: 1;
      }
    }
  }

  &.blue {
    border: 1px solid @primary-color;
    color: @primary-color;
    .os-switch-item {
      position: relative;
      color: @primary-color;
      &.active {
        background: @primary-color;
        color: #fff;
      }
      &:not(.active) {
        opacity: 0.6;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  .os-switch-a {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    display: block;
    height: fit-content;
    text-align: center;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
