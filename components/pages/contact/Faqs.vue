<script setup>
// 定义 props
const props = defineProps({
  faqList: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  titleClass: {
    type: String,
    default: 'background-title',
  },
  title: {
    type: String,
    default: '',
  },
})

// 计算属性
const startNumber = computed(() => {
  return (props.currentPage - 1) * props.pageSize
})

// 生命周期钩子
onMounted(() => {
  getFaqList()
})

// 方法
const emit = defineEmits(['getList'])

const getFaqList = () => {
  emit('getList')
}
</script>

<template>
  <div class="faq-list-con w100%">
    <h2 :class="titleClass" class="title title2 text-center mb40 font-semibold">
      <span v-html="title"></span>
    </h2>
    <!-- 列表 -->
    <div>
      <ul class="faq-content">
        <li v-for="(item, index) in faqList" :key="item.id" class="pl32 pt20 pr32 pb20">
          <div class="flex flex-items-center gap24 min-h40">
            <i
              v-if="startNumber + index < 3"
              class="text-center"
              :class="`iconfont-sg icon-more-star start-${index + 1}`"
            >
              <span
                class="faq-icon-num flex-1 font-semibold absolute top-50% left-50% translate-x--50% translate-y--50%"
              >
                {{ index + 1 }}
              </span>
            </i>
            <label v-else class="block text-center faq-num w35 h35 lh-35 b-rd-50%">{{
              startNumber + index + 1
            }}</label>
            <span class="faq-text text-ellipsis-2-lines flex-1 font-semibold" v-html="item.title"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.start-1 {
  color: #fe551c;
}

.start-2 {
  color: #ff8d03;
}

.start-3 {
  color: #ff8d03;
}

.faq-list-con {
  background: #fff;

  .title {
    color: @base-text-color;
  }

  .faq-content {
    li {
      border-bottom: 2px solid @border-gray1;

      > a {
        gap: 24px;
        font-size: @font-size;
        color: @base-text-color;
      }

      &:first-of-type {
        border-top: 2px solid @border-gray1;
      }

      label {
        background: #e8e8e8;
        color: #666;
        font-size: @font-size-sm;
      }

      i {
        position: relative;
        font-size: 36px;

        span {
          color: #fff;
          font-size: @font-size-sm;
        }
      }

      .faq-icon-num,
      .faq-text {
        line-height: @base-line-height;
      }
    }
  }
}
</style>
