<script setup>
// 定义 props
const props = defineProps({
  hasBg: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
  splitClass: {
    type: String,
    default: '',
  },
  splitText: {
    type: String,
    default: '/',
  },
})
</script>

<template>
  <div class="breadcrumb-wrapper" :class="[hasBg && 'has-bg-color']">
    <!-- 面包屑 -->
    <ul v-if="list && list.length" class="breadcrumb-list">
      <template v-for="(item, index) in list" :key="index">
        <li class="breadcrumb-item" :class="[item.active ? 'active' : '']" v-if="item.label">
          <!-- 分割符 -->
          <i v-if="splitClass && index !== 0" class="split" :class="[splitClass]"></i>
          <span v-else-if="splitText && index !== 0" class="split" v-html="splitText"></span>
          <!-- 文案 -->
          <a v-if="item.link" class="link" :href="item.link" v-html="item.label"></a>
          <span v-else class="text" v-html="item.label"></span>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.breadcrumb-wrapper.has-bg-color {
  padding: 4px 8px;
  background: @bg-pf-color;
}
// 面包屑
@breadcrumb-gap: 8px;
.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: @breadcrumb-gap;

  .breadcrumb-item {
    font-weight: 500;
    font-size: @font-size-xs;
    line-height: 20px;
    text-align: left;
    font-style: normal;

    &.active {
      .text,
      .link {
        color: @base-text-color;
      }
    }

    .split {
      color: @text-gray-color;
      margin-right: @breadcrumb-gap;
    }
    .text {
      color: @text-gray-color;
    }

    .text,
    .link,
    .split {
      font-size: @font-size-xs;
    }

    .link {
      color: @base-text-color;
      font-weight: 500;

      &:hover {
        color: @primary-color;
      }
    }

    &:first-child {
      .split {
        display: none;
      }
    }

    &:last-child {
      flex: 1;
    }
  }
}

// 兼容移动端
@media (max-width: 1024px) {
  .breadcrumb-list {
    flex-wrap: wrap;

    .breadcrumb-item {
      &:last-child {
        flex: auto;
      }
    }
  }
}
</style>
