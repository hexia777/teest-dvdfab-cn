<script setup lang="ts">
const props = defineProps({
  catalog: {
    type: Array<any>,
    default: () => [],
    required: true,
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
})

const indexObj = ref<any>({
  catalogIndex: -1,
  popularIndex: -1,
})

function showHide(index: number, type: string) {
  const parentEle = document.querySelectorAll('.table_contents') as NodeListOf<HTMLElement>
  let height = 0
  for (let i = 0; i < parentEle.length; i++) {
    const list = parentEle[i].querySelectorAll('.' + type + '-list') as NodeListOf<HTMLElement>
    for (let j = 0; j < list.length; j++) {
      if (indexObj.value[type + 'Index'] !== index && index === j) {
        const contentEle = list[j].querySelector('ul')
        if (contentEle) {
          height = height || contentEle.clientHeight
          const addHeight = type === 'popular' ? 41 : 15
          list[j].style.height = (height ? height + addHeight : height) + 'px'
        }
      } else {
        list[j].style.height = '0'
      }
    }
  }
  if (indexObj.value[type + 'Index'] === index) {
    indexObj.value[type + 'Index'] = -1
  } else {
    indexObj.value[type + 'Index'] = index
  }
}
</script>

<template>
  <div class="table_contents max-h-540 overflow-auto">
    <div v-if="catalog?.length" class="articles">
      <section
        v-for="(catalogItem, index) in catalog"
        :key="'catalog_' + index"
        class="catalog-item catalog-item-pc"
        :class="{ 'catalog-item-non': !catalogItem.content.length }"
        @mouseenter="showHide(index, 'catalog')"
        @mouseleave="showHide(index, 'catalog')"
      >
        <div class="one_child i-amphtml-accordion-header">
          <div
            v-if="catalogItem.content.length"
            class="latest-articles-box"
            :title="catalogItem.content.replace(/&nbsp;/gi, ' ')"
          >
            <a :href="'#' + catalogItem.hid" class="title">
              <span></span>
              <span v-html="catalogItem.content"></span>
            </a>
            <div v-if="catalogItem.nodes && catalogItem.nodes.length" class="open-box">
              <i
                class="iconfont-sg icon-arrow_line_dwon cursor-pointer"
                :class="[indexObj.catalogIndex == index ? 'up' : 'down']"
              ></i>
            </div>
          </div>
        </div>
        <div :id="'catalog-list-' + index + '-' + index" class="catalog-list answer pl16">
          <ul v-if="catalogItem?.nodes?.length" :id="'catalog-item-' + index + '-' + index" class="">
            <li v-for="(itm, ide) in catalogItem.nodes" :key="'nodes' + ide">
              <a :href="'#' + itm.hid" class="flex child-desc pb4">
                <span class="mr10">-</span>
                <span
                  v-html="
                    itm.content.indexOf('：') != '-1'
                      ? itm.content.replace('：', '：<br/>')
                      : itm.content.replace(':', ':<br/>')
                  "
                >
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
<style lang="less" scoped>
.table_contents {
  @apply pl20 pr20;
  .scrollbar();
}

.catalog-item {
  @apply relative;
  border-bottom: 1px solid @border-gray;
  &:last-child {
    border-bottom: none;
  }
}
.one_child {
  @apply pt16 pb16;
  &:hover {
    cursor: pointer;
    .open-box .icon-arrow_line_dwon,
    .title {
      color: @link-text-color;
    }
    .latest-articles-box {
      color: @link-text-color;
      &::before {
        background: @link-text-color;
      }
    }
  }
}
.latest-articles-box {
  @apply pl20 relative flex justify-between;
  &:before {
    @apply absolute top-8 left-0 w-6 h-6 b-rd-50\%;
    content: '';
    background: @base-text-color;
  }
}
.title {
  color: @base-text-color;
}
.child-desc {
  color: #909090;
}
a {
  color: @text-gray-color;
  &:hover {
    color: @link-text-color;
  }
}
.answer {
  box-sizing: border-box;
  height: 0;
  overflow: hidden;
  transition: height 0.5s;
}
.open-box {
  @apply ml10;
  float: right;
  .icon-arrow_line_dwon {
    color: #e3e3e3;
  }
  .iconfont-sg.icon-arrow_line_dwon {
    display: inline-block;
    &.up {
      transform: rotate(180deg);
    }
  }
}

//滚动条的配置
.scrollbar(@color-thumb:rgba(6,180,254,0.2), @color-track:rgba(0, 0, 0, 0), @size: 4px, @radius: 4px) {
  &::-webkit-scrollbar {
    width: @size;
    height: @size;
    background: @color-track;
    border-radius: @radius;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: @radius;
    background: @color-thumb;
    &:hover {
      background: darken(@color-thumb, 10%);
    }
  }

  &::-webkit-scrollbar-corner {
    background: darken(@color-track, 10%);
  }
}
</style>
