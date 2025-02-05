<script setup lang="ts">
defineOptions({ name: 'TrustpilotSwiper' })
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 主题
  backGroundColor: {
    type: String,
    default: '',
  },
  // 边框
  borderColor: {
    type: String,
    default: '',
  },
  // 大标题
  title: {
    type: String,
    default: '',
  },
  // items
  items: {
    type: Array as PropType<any[]>,
    required: true,
    default: () => [],
  },
})

const charToColor = () => {
  const r = Math.floor(Math.random() * 238)
  const g = Math.floor(Math.random() * 238)
  const b = Math.floor(Math.random() * 238)
  return `rgb(${r},${g},${b})`
}

const borderClass = 'border-primary'
const themeClass = 'bg-primary'
const pageDotClass = 'border-bg-primary'

let timer: any = null
const currentIndex = ref(0)
const swipper = (index?: number) => {
  // 手动切换
  if (index !== undefined) {
    clearTimeout(timer)
    currentIndex.value = index || 0
  } else if (currentIndex.value >= props.items.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value = currentIndex.value + 1
  }
}

const list = props.items.map((item) => {
  const newItem = { ...item }
  newItem.bgColor = !newItem.bgColor ? charToColor() : newItem.bgColor
  return newItem
})

const stop = () => {
  clearInterval(timer)
}

const start = () => {
  if (useStore.common().mobile) {
    return
  }
  timer = setInterval(() => {
    swipper()
  }, 5000)
}

onMounted(() => {
  start()
})

onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <div class="block-box" :class="[blockClass?.value]">
    <BaseContainer>
      <h2 class="font-s-40 mb-40 text-center" v-html="title"></h2>
      <div v-if="list && list.length" class="outer-container">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="content-box hidden"
          :class="[{ show: currentIndex === index }, borderColor ? '' : borderClass]"
          :style="{ borderColor: borderColor }"
          @mouseenter="stop"
          @mouseleave="start"
        >
          <div class="flex flex-items-center justify-between mb-40">
            <div class="name-container">
              <span
                class="avatar font-s-32 mr-16 b-radius-lg"
                :style="{
                  backgroundColor: item.bgColor,
                }"
                v-html="item.name ? item.name[0] : ''"
              ></span>
              <span class="name font-size-20" v-html="item.name"></span>
            </div>
            <div class="img-rate">
              <i v-for="i in item.rateNum || 5" :key="i" class="iconfont-sg icon-star-rect font-size-32"></i>
            </div>
          </div>

          <h4 class="title font-size-18 mb-16 font-semibold" v-html="item.title"></h4>
          <p class="desc" v-html="item.desc"></p>
          <div class="mt-24 text-right">
            <span class="gray-color" v-html="item.bottomDesc"></span>
          </div>
        </div>
      </div>
      <div class="incator-box ma-auto mt-40 text-center">
        <span
          v-for="(item, index) in props.items"
          :key="index"
          :style="{ backgroundColor: currentIndex === index ? backGroundColor : borderColor }"
          :class="[
            { active: currentIndex === index },
            !backGroundColor ? (currentIndex === index ? themeClass : pageDotClass) : '',
          ]"
          @mouseenter="swipper(index)"
          @mouseleave="start"
        ></span>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.show {
  display: block;
}
.content-box {
  padding: 25px 40px;
  border-radius: 20px;
  border-width: 4px;
  border-style: solid;
}
.name-container {
  .avatar {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 16px;
    color: #fff;
  }
}
.img-rate {
  i {
    color: #00b67a;
    margin-left: 4px;
  }
}
.incator-box {
  span {
    margin: 0 10px;
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 50%;
    &.active {
      width: 40px;
      border-radius: 8px;
      margin: 0 8px;
    }
  }
}

@media screen and(max-width:768px) {
  .content-box {
    display: block !important;
    margin-bottom: 20px;
    padding: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .incator-box {
    display: none;
  }
}
@media screen and(max-width:600px) {
  .img-rate {
    display: none;
  }
}
</style>
