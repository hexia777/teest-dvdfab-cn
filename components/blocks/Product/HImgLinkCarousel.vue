<script setup lang="ts">
defineOptions({ name: 'HImgLinkCarousel' })

// 定义 attributes 的类型
interface Attributes {
  url: string
  width: number
  height: number
}

// 定义 item 的类型
interface Item {
  attributes: Attributes
}

const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => ({
      value: 'no-bg',
    }),
  },
  // 大标题
  title: {
    type: String,
    default: '',
  },
  // list
  items: {
    type: Object as () => { data: Item[] },
    required: true,
    default: () => {
      return {
        data: [],
      }
    },
  },
  // 底部链接信息
  link: {
    type: Object,
    default: () => {
      return {
        label: '',
        url: '',
      }
    },
  },
})

// 拆分数组为2组
const splitArray = (arr: Item[]) => {
  const group1: Item[] = []
  const group2: Item[] = []
  if (!Array.isArray(arr)) {
    return []
  }
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      group1.push(arr[i])
    } else {
      group2.push(arr[i])
    }
  }
  return [group1, group2]
}
const groupArr = splitArray(props.items.data)
const list = computed(() => {
  return {
    '1': groupArr[0] || [],
    '2': groupArr[1] || [],
  }
})
</script>

<template>
  <div class="block-box" :class="[blockClass.value]">
    <BaseContainer>
      <h2 class="font-s-40 mb-40 text-center" v-html="title"></h2>
      <div class="logo-wrap">
        <template v-for="(value, key) in list" :key="key">
          <template v-if="value">
            <div :key="'logo-full-' + key" :class="[parseInt(key) % 2 ? 'line_odd' : 'line_even']">
              <template v-for="n in 2">
                <!---防止循环完以后抖动 所以需要循环两遍---->
                <div v-for="(item, j) in value" :key="'item-' + key + '-' + n + '-' + j" class="item">
                  <div class="img-box" :style="{ width: item?.attributes?.width + 'px' }">
                    <my-img
                      :src="item?.attributes?.url"
                      :width="item?.attributes?.width"
                      :height="item?.attributes?.height"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <div v-if="link.label" class="mt-20 bottom-text">
        <a class="flex" :href="link.url" v-html="link.label"></a>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.logo-wrap {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  font-size: 0;
  .line_odd,
  .line_even {
    display: inline-block;
    white-space: nowrap;
  }
  .line_odd {
    -webkit-animation: scrollToRight 55s linear infinite;
    animation: scrollToRight 55s linear infinite;
  }
  .line_even {
    -webkit-animation: scrollToRight 60s linear infinite;
    animation: scrollToRight 60s linear infinite;
  }
  .item {
    display: inline-block;
    padding: 10px;
  }
  .img-box {
    position: relative;
    padding-top: 49.1228%;
    overflow: hidden;
    max-width: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.bottom-text {
  a {
    @apply flex-justify-center flex-items-center;
    &::after {
      content: '>';
      margin-left: 2px;
      font-size: 24px;
      margin-top: 2px;
    }
    &:hover {
      color: #00a9f0;
    }
  }
}
@-webkit-keyframes scrollToRight {
  from {
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0%, 0, 0);
    transform: translate3d(0%, 0, 0);
  }
}
@keyframes scrollToRight {
  from {
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0%, 0, 0);
    transform: translate3d(0%, 0, 0);
  }
}
@media (max-width: 660px) {
  .logo-wrap {
    .item {
      width: 100px;
      padding: 5px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .line_odd {
      -webkit-animation: scrollToRight 15s linear infinite;
      animation: scrollToRight 15s linear infinite;
    }
    .line_even {
      -webkit-animation: scrollToRight 20s linear infinite;
      animation: scrollToRight 20s linear infinite;
    }
  }
}
</style>
