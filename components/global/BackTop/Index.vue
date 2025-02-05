<script setup lang="ts">
const visible = ref<boolean>(false)
const selected = ref<boolean>(false)
const isHover = ref<boolean>(false)

const handleScroll = () => {
  visible.value = window.scrollY > 100
}

const backTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <!-- 移动端 -->
    <button
      v-if="visible && useStore.common().mobile"
      role="button"
      aria-label="button"
      :class="{ selected: selected }"
      class="con-back-top mobile"
      @click="backTop"
    >
      <i class="iconfont-sg icon-top-back back-top"></i>
    </button>
    <!-- pc 端 -->
    <button
      v-if="visible && !useStore.common().mobile"
      role="button"
      aria-label="button"
      :class="{ selected: selected }"
      class="con-back-top"
      @click="backTop"
    >
      <div
        :style="{ 'background-image': `url(${useImgPath().value}/common/1x_m/back_top_sprites.png)` }"
        class="back-top-in"
        :class="{ hover: isHover }"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
      ></div>
    </button>
  </div>
</template>

<style scoped lang="less">
.con-back-top {
  position: fixed;
  z-index: 98;
  right: 2.70833%;
  bottom: 12%;
  width: 70px;
  height: 140px;
  cursor: pointer;
  outline: none;
  border: 0;
  background: transparent;

  .back-top-in {
    position: relative;
    height: 100%;
    background-repeat: no-repeat;
    background-position: -96px -10px;

    &:active,
    &:hover {
      background-position: -10px -10px;
    }
  }

  &.mobile {
    @apply w45 h45 b-rd-50\% of-hidden;
    background-color: @primary-color;

    .back-top {
      @apply font-size-22 c-white;
    }
  }
}
</style>
