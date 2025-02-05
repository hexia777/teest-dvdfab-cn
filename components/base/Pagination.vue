<script setup>
// 定义 props
const props = defineProps({
  type: {
    type: String,
    default: 'route', // 路由分页: route, 参数分页: params, 前端分页: event
  },
  total: {
    type: Number,
    default: 100,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  currentPageProp: {
    type: [Number, String],
    default: 1,
  },
  pageUrl: {
    type: String,
    default: '',
  },
  pageParams: {
    type: String,
    default: 'page',
  },
  linkRel: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '.htm',
  },
})

// 定义响应式数据
const totalPages = ref(Math.ceil(props.total / props.pageSize))
const currentPage = ref(Number(props.currentPageProp))

// 定义 emit
const emit = defineEmits(['changePage'])

// 计算属性
const pagesToShow = computed(() => {
  if (totalPages.value <= 5) {
    return range(1, totalPages.value)
  }
  const pageArr = [1]
  let start = parseInt(currentPage.value, 10) - 1
  if (start < 4) {
    start = 1
    for (let i = start; i < start + 3; i++) {
      pageArr.push(i + 1)
    }
    pageArr.push('...')
  } else {
    pageArr.push('..')
    if (start + 5 > totalPages.value) {
      start = totalPages.value - 4
      for (let i = start; i < start + 3; i++) {
        pageArr.push(i + 1)
      }
    } else {
      for (let i = start; i < start + 3; i++) {
        pageArr.push(i + 1)
      }
      pageArr.push('...')
    }
  }
  pageArr.push(totalPages.value)
  return pageArr
})

// 监听 currentPage 变化
watchEffect(() => {
  currentPage.value = Number(props.currentPageProp)
  totalPages.value = Math.ceil(props.total / props.pageSize)
})

// 方法
const pageDeal = (page) => {
  if (props.type === 'route') {
    if (page === 1) {
      return props.pageUrl + props.suffix
    }
    if (page === '..') {
      for (let i = 0; i < pagesToShow.value.length; i++) {
        if (pagesToShow.value[i] === '..') {
          if (pagesToShow.value[i + 1] - 1 === 1) {
            return props.pageUrl + props.suffix
          }
          return props.pageUrl + `/${props.pageParams}` + (pagesToShow.value[i + 1] - 1) + props.suffix
        }
      }
    }
    if (page === '...') {
      for (let i = 0; i < pagesToShow.value.length; i++) {
        if (pagesToShow.value[i] === '...') {
          return props.pageUrl + `/${props.pageParams}` + (pagesToShow.value[i - 1] + 1) + props.suffix
        }
      }
    }
    return `${props.pageUrl}/${props.pageParams}${page}${props.suffix}`
  } else if (props.type === 'params') {
    if (props.pageUrl.includes('?')) {
      return `${props.pageUrl}&${props.pageParams}=${page}`
    }
    return `${props.pageUrl}?${props.pageParams}=${page}`
  } else {
    return 'javascript:;'
  }
}

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}

const changePage = (idx, type) => {
  if (props.type === 'event') {
    if (type === 'pre') {
      if (currentPage.value <= 1) {
        return
      }
      currentPage.value -= 1
    } else if (type === 'next') {
      if (currentPage.value === totalPages.value) {
        return
      }
      currentPage.value += 1
    } else {
      currentPage.value = idx
    }
    emit('changePage', currentPage.value)
  }
}
</script>

<template>
  <div v-if="total > 0" class="flex-center">
    <ul class="pagination flex-center">
      <li class="pre" :class="{ disabled: parseInt(currentPage, 10) <= 1 }">
        <!-- 上一页 -->
        <!-- 禁用 -->
        <a v-if="currentPage === 1" :rel="linkRel" class="flex-center" href="javascript:;">
          <i class="iconfont-sg icon-caret-left"></i>
        </a>
        <a
          v-else
          class="flex-center"
          :rel="linkRel"
          :href="pageDeal(parseInt(currentPage, 10) - 1)"
          @click="changePage(page, 'pre')"
        >
          <i class="iconfont-sg icon-caret-left"></i>
        </a>
      </li>
      <li v-for="page in pagesToShow" :key="page">
        <!-- 页码 -->
        <span v-if="page == '..' || page == '...'" class="flex-center dot"> ... </span>
        <a
          v-else
          class="flex-center"
          :rel="linkRel"
          :href="pageDeal(page)"
          :class="{ active: parseInt(currentPage, 10) === page }"
          @click="changePage(page, pageDeal(page))"
        >
          <span>{{ page }}</span>
        </a>
      </li>
      <li class="next" :class="{ disabled: parseInt(currentPage, 10) === totalPages }">
        <!-- 下一页 -->
        <a
          v-if="parseInt(currentPage, 10) === totalPages"
          :rel="linkRel"
          class="flex-center"
          href="javascript:;"
        >
          <i class="iconfont-sg icon-caret-right"></i>
        </a>
        <a
          v-else
          class="flex-center"
          :rel="linkRel"
          :href="pageDeal(parseInt(currentPage, 10) + 1)"
          @click="changePage(page, 'next')"
        >
          <i class="iconfont-sg icon-caret-right"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
//分页
.pagination {
  gap: @gap-xs;
  li {
    font-size: @font-size;
    text-align: center;
    line-height: 32px;
    > a,
    > span {
      width: 32px;
      height: 32px;
    }
    a {
      color: @base-text-color;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid @border-gray2;

      &.no-border {
        width: fit-content;
        border: none;
      }
      &:hover {
        color: @primary-color;
        background: #e5f7ff;
        border: none;
      }
      &.active {
        background-color: @primary-color;
        border: none;

        span {
          color: @text-white-color;
        }
      }
    }
    &.pre,
    &.next {
      a i {
        font-size: @font-size-xs;
      }
      &.disabled a {
        cursor: not-allowed;
        &:hover {
          border: 1px solid @border-gray2;
          background: initial;
          border-color: @border-gray2;
        }
        i {
          color: @border-gray2;
        }
      }
    }
  }
}
@media (max-width: 414px) {
  .pagination {
    gap: 5px;
    li a {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
