<script setup lang="ts">
import { useBatchFetch } from '@/composables/workers/useBatchWorker'
defineOptions({ name: 'NavBar' })
const { $trace } = useNuxtApp() as any
const { userTagsData } = getUserTags()
const { subNavData } = useNavBar()
const { apiWorker } = useApi()
const promotionStyleBg = computed(() => {
  if (subNavData.value && subNavData.value.promotion) {
    return subNavData.value.promotion?.labelStyle?.background || '#dc8e30'
  } else {
    return '#dc8e30'
  }
})

// 获取用户画像数据
const fetchUserTagsData = async () => {
  const res = await userTagsData()
  if (res?.data?.value?.cscode === 200 && res?.data?.value?.data) {
    return res.data.value.data
  } else {
    return {}
  }
}

const window_width = ref(useStore.common().mobile ? 0 : 1200)
const handleResize = () => {
  window_width.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

onMounted(() => {
  handleResize()

  // 客户端请求用户画像, 防止 pagecache 缓存
  nextTick(() => {
    useBatchFetch()
      .execute([
        apiWorker.getUserFullTags({
          email: useEmail(),
        }),
      ])
      .then((resList) => {
        const res: any = resList[0]
        if (res.cscode === 200 && res.data) {
          useStore.common().setUserTagsRes(res.data)
          const email = useEmail()
          $trace.traceCustomEvent({
            event: 'show',
            email,
            event_label: 'user_tag',
          })
        }
      })
      .catch((err) => {
        console.error('getUserFullTags error:', err)
      })
    // const { data } = await useAsyncData('userTagsData', fetchUserTagsData)
    // if (data.value) {
    //   // console.log('userTagsData======', data)
    //   useStore.common().setUserTagsRes(data.value)
    // }
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="mobile-nav-container">
    <nav-bar-mobile :window-width="window_width" />
  </div>
  <div class="pc-nav-container">
    <nav-bar-pc :window-width="window_width" />
  </div>
</template>
<style lang="less">
@import '@/assets/style/sprite/nav_1x_m.less';
// 过渡动画
.moveL-enter-active,
.moveL-leave-active {
  transition: all 0.25s linear;
  transform: translateX(0%);
}

.moveL-enter-from,
.moveL-leave-from {
  transform: translateX(-100%);
}

.moveL-leave-to {
  transform: translateX(-100%);
}
.promotion-menu-style {
  background: v-bind('promotionStyleBg');
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  &:hover {
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: v-bind('promotionStyleBg');
    }
  }
}
.promotion-menu-coupon {
  @apply ml8 inline-block font-size-14;
  padding: 4px 20px 4px 8px;
  background: #ff3b30;
  border-radius: 14px 14px 14px 0px;
  color: #fff000 !important;
  position: relative;
  font-weight: 700;
  .promotion-menu-coupon-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: -18px;
  }
}
.nav-tag-off,
.nav-tag-new,
.nav-tag-free,
.nav-tag-hot {
  background: #ff3b30;
  border-radius: 4px 4px 4px 0px;
  font-weight: 400;
  font-size: 12px;
  color: #fff000;
  margin-left: 6px;
  padding: 2px 4px;
  height: 20px;
  line-height: 18px;
}
.nav-tag-new {
  background: linear-gradient(270deg, #005af0 0%, #00a9f0 100%);
  color: #fff;
}
.nav-tag-free {
  background: linear-gradient(270deg, #1db300 0%, #5fe945 100%);
  color: #fff;
}
.nav-tag-hot {
  background: linear-gradient(90deg, #ffb134 0%, #ff5d00 100%);
  color: #fff;
}

@media screen and (max-width: 1200px) {
  .mobile-nav-container {
    display: block;
  }
  .pc-nav-container {
    display: none;
  }
}
@media screen and (min-width: 1200px) {
  .mobile-nav-container {
    display: none;
  }
  .pc-nav-container {
    display: block;
  }
}
</style>
