<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
      }
    },
  },
  // h 标题
  title: {
    type: String,
    default: '',
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
  // 数组
  navs: {
    type: Array<any>,
    default: () => [],
  },
})
const proInfo = useProInfo().value
const commonStore = useStore.common()
const moreText = useI18n().value.common.more
const tavActiveIndex = ref<number>(1)
tavActiveIndex.value = 1
const faqActiveIndex = ref<number>(0)
faqActiveIndex.value = 0
const faqContentList = ref<any>([])

faqContentList.value = props.items.filter((item) => +tavActiveIndex.value === +item.nav)

const tabClick = (index: number) => {
  tavActiveIndex.value = +index
  faqContentList.value = props.items.filter((item) => +index === +item.nav)
  setTimeout(() => {
    faqActiveIndex.value = faqContentList.value.length > 0 ? faqContentList.value[0].id : 0
  }, 0)
}

const toggleShow = (ques: any) => {
  if (ques.id === faqActiveIndex.value) {
    faqActiveIndex.value = 0
  } else {
    faqActiveIndex.value = ques.id
  }
}

const beforeEnter = (el: any) => {
  el.style.height = '0'
}
const enter = (el: any) => {
  el.style.transition = 'height 0.5s ease'
  el.style.height = el.scrollHeight + 'px'
}
const leave = (el: any) => {
  el.style.transition = 'height 0.5s ease'
  el.style.height = '0'
}

const onBeforeLeave = (el: any) => {
  el.style.height = el.scrollHeight + 'px'
}

onMounted(() => {
  tabClick(1)
})
</script>

<template>
  <div class="block-box faq-tabs" :class="blockClass.value">
    <base-container>
      <h2 class="title mb-40" v-html="title"></h2>
      <!-- tab导航 -->
      <div v-if="navs && navs?.length" class="tab-box">
        <ul class="tab-nav-list mb40">
          <li
            v-for="(nav, index) in navs"
            :key="'nav' + index"
            class="tab-nav-item"
            :class="{ active: tavActiveIndex === +nav.key }"
            @click="tabClick(nav.key)"
          >
            <span v-if="nav.text" class="feature-card-tab-item" v-html="nav.text"></span>
          </li>
        </ul>
      </div>
      <section class="tab-content">
        <!-- <BlocksFaqHTitleDescCollapseBtn /> -->
        <ul v-for="(nav, index) in navs" v-show="tavActiveIndex === +nav.key" :key="'content' + index">
          <li
            v-for="q in faqContentList"
            :key="q.id"
            v-track:click="{
              event: 'click',
              event_category: proInfo?.slug + 'faq',
              event_label: 'javascript:;',
            }"
            @click="toggleShow(q)"
          >
            <div class="faq-content mb10" :class="{ 'active-content': q.id === faqActiveIndex }">
              <div class="flex-between font-s-18">
                <span class="faq-title">{{ q.title }}</span>
                <i v-show="!commonStore.mobile" class="iconfont-sg icon-expand_down"></i>
              </div>

              <Transition
                name="accordion"
                @before-enter="beforeEnter"
                @enter="enter"
                @before-leave="onBeforeLeave"
                @leave="leave"
              >
                <!-- <div v-show="q.pid === activePid" :id="q.pid" > -->
                <div
                  v-if="commonStore.mobile || q.id === faqActiveIndex"
                  class="faq-desc font-s-16"
                  style="overflow: hidden"
                >
                  <div class="pt8">
                    <p v-html="q.desc"></p>
                  </div>
                </div>
              </Transition>
            </div>
          </li>
        </ul>
        <div class="more-button text-center mt28">
          <my-button
            class="more-link"
            href="/faq.htm"
            :label="moreText + ' >'"
            size="normal"
            theme="border"
          />
        </div>
      </section>
    </base-container>
  </div>
</template>

<style scoped lang="less">
.faq-tabs {
  .title {
    text-align: center;
  }
}
// tab导航
.tab-nav-list {
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    background-color: @primary-color;
  }

  .tab-nav-item {
    min-width: 280px;
    margin-right: 10px;
    padding: 8px 10px;
    cursor: pointer;
    background: #f4f4f4;
    border-radius: 10px 10px 0 0;
    text-align: center;

    &.active,
    &:hover {
      color: #fff;
      background: @primary-color;
    }

    .feature-card-tab-item {
      @apply font-size-18;
      text-align: center;
    }
  }
}

.faq-content {
  cursor: pointer;
  background-color: @bg-white;
  border-radius: 12px;
  padding: 20px 30px;
  box-sizing: border-box;
  .faq-title {
    color: @base-text-color;
    font-weight: bold;
  }
  .icon-expand_down {
    font-size: 14px;
    color: #d8d8d8;
  }
  .faq-desc {
    color: @base-text-color;
  }
}
.active-content {
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
  .icon-expand_down {
    transform: rotate(180deg);
  }
}
.faq-content:hover {
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
  .faq-title {
    color: @primary-color;
  }
  .icon-expand_down {
    color: @primary-color;
  }
}

@media (max-width: 1024px) {
  .tab-nav-list {
    .tab-nav-item {
      min-width: 30%;
    }
  }
}
</style>
