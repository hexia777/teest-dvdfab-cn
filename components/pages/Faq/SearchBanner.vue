<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  searchTips: {
    type: String,
    default: '',
  },
  cardData: {
    type: Object,
    default: () => ({}),
  },
  breadData: {
    type: Object,
    default: () => ({}),
  },
  keywordTitle: {
    type: String,
    default: '',
  },
  keywordData: {
    type: Array as any,
    default: () => [],
  },
  breadcrumbData: {
    type: Object,
    default: () => {},
  },
})
const route = useRoute()
const searchVal = ref<any>('')
const emit = defineEmits(['handSearchData'])

onBeforeMount(() => {
  handlerDefault()
})
const handlerDefault = () => {
  const { defaultVal } = props.cardData
  searchVal.value = null
  if (defaultVal) {
    searchVal.value = defaultVal
  }
  handSearchData(searchVal.value, 'init')
}
const handSearchData = (val, type) => {
  const { prop } = props.cardData
  const obj = {} as any
  obj[prop] = searchVal.value
  emit('handSearchData', obj, type)
}
const clickIcon = () => {
  handSearchData(searchVal.value, '')
}
</script>

<template>
  <div class="search-banner-wrapper">
    <BaseContainer>
      <!-- 面包屑 -->
      <BaseBreadcrumb v-bind="breadcrumbData" />
      <!-- 标题 -->
      <h1 v-if="title" class="banner-title font-700 font-s-42" v-html="title"></h1>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <el-input
          v-model="searchVal"
          class="search-box"
          :placeholder="searchTips"
          type="text"
          @keyup.enter="clickIcon"
        />
        <div class="icon_cursor">
          <i class="default icon-search iconfont-sg" @click="clickIcon"></i>
          <i class="hover icon-search iconfont-sg" @click="clickIcon"></i>
        </div>
      </div>

      <!-- 关键字 -->
      <div v-if="!cardData.hideWord && keywordData.length" class="key-word-box test1">
        <span class="tips-text">
          <span v-html="keywordTitle"></span>
          <i class="icon-triangle-right"></i>
        </span>
        <div class="key-words">
          <a
            v-for="item in keywordData"
            :key="item.id"
            :class="{
              active: route.query.route_name == item.route_name,
            }"
            :href="`/faq/` + item.route_name + `.htm#` + item.route_name"
            v-html="item.keyword"
          ></a>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<style lang="less" scoped>
.search-banner-wrapper {
  background: linear-gradient(180deg, #c2edff 0%, #ffffff 100%);
  padding: 40px 0;
  .banner-title {
    padding-top: 20px;
    padding-bottom: 32px;
    text-align: center;
    color: @base-text-color;
    line-height: 1.2;
  }
}
.search-box-wrapper {
  position: relative;
  .icon_cursor {
    position: absolute;
    right: 24px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .icon_cursor {
    width: 40px;
    height: 40px;
    background: #e5f7ff;
    border-radius: 100%;
    @apply flex-center;
    color: @primary-color;
    &:hover {
      background-color: @primary-color;
      color: #fff;
    }
    i {
      font-size: @font-size-md;
    }
  }
}
// 搜索框
.search-box {
  position: relative;
  :deep(.el-input__wrapper) {
    padding: 0 !important;
    background-color: transparent;
    box-shadow: none;
  }
  :deep(.el-input__inner) {
    color: #000;
    font-size: @font-size-sm;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: none;
  }
  :deep(.el-input__inner) {
    height: 66px;
    line-height: 66px;
    border-radius: 33px;
    border: 2px solid @primary-color;
    overflow: hidden;
    background: #fff;
    padding: 0 30px;

    &::-webkit-input-placeholder {
      font-size: @font-size-sm;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  :deep(.el-input-group__append) {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    background: #e5f7ff;
    border-radius: 50%;
    color: #fff;
    border: none;
    @media screen and(max-width:600px) {
      right: 12px;
    }

    .icon-search {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      cursor: pointer;
    }
    .icon-search.hover {
      display: none;
    }
    &:hover {
      background: @primary-color;
      .icon-search.hover {
        display: inline-block;
      }
      .icon-search.default {
        display: none;
      }
    }
  }

  .default,
  .hover {
    width: 40px;
    height: 40px;
    background: #e5f7ff;
  }
  .hover {
    background: @primary-color;
  }
}

// 关键字
.key-word-box {
  margin-top: 30px;
  font-weight: bold;
  .tips-text {
    position: relative;
    display: inline-block;
    padding: 8px 24px;
    background-color: @primary-color;
    color: #fff;
    border-radius: 4px;
    &::before {
      position: absolute;
      right: -12px;
      top: 0;
      bottom: 0;
      margin: auto;
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-left-color: @primary-color;
    }

    .icon-triangle-right {
      position: absolute;
      right: -6px;
      top: 11px;
    }
  }

  .key-words {
    display: inline;
    align-items: center;
    margin-left: 8px;

    a {
      position: relative;
      padding: 0 16px;
      color: @base-text-color;
      display: inline-block;
      margin-bottom: 10px;
      &.active {
        color: @primary-color;
      }
      &:hover {
        color: @primary-color;
      }

      &:nth-of-type(n + 2):before {
        content: '';
        position: absolute;
        height: 20px;
        width: 2px;
        left: 0;
        top: 1px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    @media screen and (max-width: 460px) {
      margin-left: 0;
    }
  }
}
</style>
