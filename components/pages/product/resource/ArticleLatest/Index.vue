<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  items: {
    type: Array<any>,
    default: () => [],
    required: true,
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
  more: {
    type: String,
    default: '',
  },
  moreUrl: {
    type: String,
    default: '',
  },
})

const $t = useI18n().value
const articles = computed(() => {
  const arr = [] as Array<any>
  props.items.forEach((item: any, i) => {
    if (item?.articles?.length) {
      item.articles?.forEach((child: any) => {
        child.articleUrl = `/${child.category}/${child.url}`
      })
      item.title = $t.article[`category_` + item.category_id]
    }
    if (item.title) {
      arr.push(item)
    }
  })
  return arr
})

const indexObj = ref<any>({
  catalogIndex: -1,
  popularIndex: -1,
})

function showHide(index: number, type: string) {
  const parentEle = document.querySelectorAll('.latest_contents') as NodeListOf<HTMLElement>
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

const locale = useStore.common().locale
const urlInit = (product_url: string, category: string, url: string) => {
  return product_url
    ? '/' + product_url + '/' + url + '.htm'
    : locale === 'ja'
    ? '/' + category.replace(/_/g, '-') + '/' + url + '.htm'
    : '/resource/' + category.replace(/_/g, '-') + '/' + url
}
</script>

<template>
  <div class="article-latest-wrap" :class="{ sticky: isFixed }">
    <PagesProductResourceArticleWithBgTitle :title="title" />
    <div class="latest_contents" :class="'latest_contents'">
      <div v-if="articles?.length" class="articles">
        <template v-for="(catalogItem, index) in articles" :key="'catalog_' + index">
          <section
            v-if="catalogItem.title"
            class="latest-item latest-item-pc"
            :class="{ 'latest-item-non': !catalogItem.title }"
            @mouseenter="showHide(index, 'latest')"
            @mouseleave="showHide(index, 'latest')"
          >
            <div class="one_child i-amphtml-accordion-header">
              <div class="latest-articles-box" :title="catalogItem.title.replace(/&nbsp;/gi, ' ')">
                <div class="title">
                  <span></span>
                  <span v-html="catalogItem.title"></span>
                </div>
                <div v-if="catalogItem.articles && catalogItem.articles.length" class="open-box">
                  <i
                    class="iconfont-sg icon-arrow_line_dwon cursor-pointer"
                    :class="[indexObj.catalogIndex == index ? 'up' : 'down']"
                  ></i>
                </div>
              </div>
            </div>
            <div :id="'latest-list-' + index + '-' + index" class="latest-list answer pl16">
              <ul v-if="catalogItem?.articles?.length" :id="'latest-item-' + index + '-' + index" class="">
                <li v-for="(itm, ide) in catalogItem.articles" :key="'nodes' + ide">
                  <a :href="urlInit(itm.product_url, itm.category, itm.url)" class="flex child-desc pb4">
                    <span class="mr10">-</span>
                    <span
                      v-html="
                        itm.title.indexOf('：') != '-1'
                          ? itm.title.replace('：', '：<br/>')
                          : itm.title.replace(':', ':<br/>')
                      "
                    >
                    </span>
                  </a>
                </li>
                <li v-if="more" class="text-right">
                  <a class="more-txt" :href="moreUrl" v-html="more"> </a>
                </li>
              </ul>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.article-latest-wrap {
  background-color: #fff;
}
.latest_contents {
  @apply pl20 pr20;
  .scrollbar();
}
.latest-item {
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
.more-txt {
  color: @primary-text-color;
  &:hover {
    text-decoration: underline;
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
