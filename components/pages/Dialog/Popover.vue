<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: Number,
    default: undefined,
  },
  content: {
    type: String,
    default: '',
  },
  itemObject: {
    type: Object,
    default: () => ({
      update_time: '2024-05-17',
      update_desc: 'UniFab Video Converter Pro 1.0.0.3 Changelog',
      changeList: [
        {
          value: 'Fix: Some known bugs.',
        },
        {
          value: 'Fix: Some known bugs.',
        },
      ],
      read_more_link: '/',
    }),
  },
})

const emits = defineEmits(['update:modelValue'])
const triggerRef = ref<HTMLElement>()
const popoverRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()

const commomJson = useI18n().value.common

// 计算浮窗位置
const updatePosition = () => {
  if (!triggerRef.value || !popoverRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  // 计算浮窗位置，使其位于按钮下方
  const left = triggerRect.left + triggerRect.width / 2
  // 设置位置
  popoverRef.value.style.left = `-${triggerRect.left}px`
  arrowRef.value.style.left = `${left - 12}px`
}

// 监听浮窗显示状态
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        updatePosition()
        // 添加窗口resize监听
        window.addEventListener('resize', updatePosition)
      })
    } else {
      window.removeEventListener('resize', updatePosition)
    }
  },
)

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
})

const closePopover = () => {
  emits('update:modelValue', false)
}

// 点击外部关闭
const handleClickOutside = (e: MouseEvent) => {
  if (!popoverRef.value?.contains(e.target as Node) && !triggerRef.value?.contains(e.target as Node)) {
    closePopover()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="popover-wrapper">
    <!-- 触发按钮插槽 -->
    <div ref="triggerRef" class="trigger-txt">
      <slot name="trigger"></slot>
      <!-- 弹出内容 -->
      <transition name="fade">
        <div v-if="modelValue" ref="popoverRef" class="popover-container">
          <!-- 三角箭头 -->
          <div ref="arrowRef" class="arrow"></div>
          <BaseContainer>
            <!-- 内容区域 -->
            <div class="popover-content" :style="{ maxWidth: maxWidth ? `${maxWidth}px` : '100%' }">
              <!-- 关闭按钮 -->
              <div class="close-icon flex-center" @click="closePopover">
                <i class="iconfont-sg icon-close-line"></i>
              </div>

              <slot>
                <template v-if="content">
                  <div v-html="content"></div>
                </template>
                <template v-else>
                  <div class="no-content">
                    <div class="tit title6" v-html="itemObject.update_time"></div>
                    <div class="desc mb16" v-html="itemObject.update_desc"></div>
                    <ul class="change-list dark mb16">
                      <li v-for="item in itemObject.changeList" :key="item.value" class="flex">
                        <i class="iconfont-sg icon-li-tag mr6 font-size-12 flex-none"></i>
                        <span v-html="item.value"></span>
                      </li>
                    </ul>
                    <a class="read-more primary-link" :href="itemObject.read_more_link">{{
                      commomJson.read_more
                    }}</a>
                  </div>
                </template>
              </slot>
            </div>
          </BaseContainer>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="less">
.popover-wrapper {
  position: relative;
  display: inline-block;
}
.trigger-txt {
  position: relative;
}
.popover-container {
  width: calc(100vw - 20px);
  left: 0;
  position: absolute;
  top: calc(100% + 20px);
  z-index: 1000;
}

.close-icon {
  position: absolute;
  right: 18px;
  top: 23px;
  width: 14px;
  height: 14px;
  color: #9da9ae;
  cursor: pointer;
  transition: color 0.2s;
  i {
    font-size: 20px;
  }
  &:hover {
    color: @primary-color;
  }
}

.arrow {
  position: absolute;
  top: -12px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #3cd49f;
  z-index: 2;
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    z-index: 1;
    border-bottom: 12px solid #fff;
    left: -11px;
    top: 1px;
  }
}

.popover-content {
  position: relative;
  z-index: 1;
  padding: 32px 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.12);
  border: 1px solid #3cd49f;
}
.change-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .icon-li-tag {
    line-height: 1.9;
  }
  &.dark {
    .icon-li-tag {
      color: @base-text-color;
    }
  }
  &.light {
    .icon-li-tag {
      color: @text-white-color;
    }
  }
  :deep(li) {
    a {
      color: @primary-color !important;
      &:hover {
        cursor: pointer;
        @apply underline;
      }
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .popover-content {
    padding: 5%;
  }
  .close-icon {
    top: 5%;
    right: 3%;
  }
}
</style>
