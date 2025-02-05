<script setup lang="ts">
interface Faq {
  title: string
  desc: string
  label: string
  pdom_height: number
  id: string
}

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {},
  },
  items: {
    type: Array,
    default: () => [],
  },

  isNewJa: {
    type: Boolean,
    default: false,
  },
  faqNum: {
    type: Number,
    default: 0,
  },
})
const isMobile = useStore.common().mobile
const proInfo = useProInfo().value || {}
const moreText = useI18n().value.common.more
const faqs = props.items as any

const route = useRoute()
const activePid = ref(faqs?.[0]?.id)
// const targetFaqs = computed(() => {
//   if (props.faqNum > 0) {
//     return faqs.slice(0, props.faqNum)
//   }
//   return faqs
// })

const toggleShow = (q: Faq) => {
  if (q.id === activePid.value) {
    activePid.value = undefined
  } else {
    activePid.value = q.id
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
</script>

<template>
  <div
    class="block-box"
    :class="[blockClass && blockClass.value ? blockClass.value : 'has-bg', { mobile_page: isMobile }]"
  >
    <BaseContainer>
      <h2 class="text-center mb40 line-height-28">{{ title }}</h2>
      <ul class="mb20">
        <li
          v-for="q in faqs"
          :key="q.id"
          v-track:click="{
            event: 'click',
            xargs_event_category: proInfo.slug + 'faq',
            event_label: q.icon ? '#' + q.icon : 'javascript:;',
          }"
          @click="toggleShow(q)"
        >
          <div class="faq-content mb10" :class="{ 'active-content': q.id === activePid }">
            <div class="flex-between font-s-18">
              <span class="faq-title">{{ q.title }}</span>
              <i v-show="!isMobile" class="iconfont-sg icon-expand_down"></i>
            </div>

            <Transition
              name="accordion"
              @before-enter="beforeEnter"
              @enter="enter"
              @before-leave="onBeforeLeave"
              @leave="leave"
            >
              <!-- <div v-show="q.pid === activePid" :id="q.pid" > -->
              <div v-if="isMobile || q.id === activePid" class="faq-desc font-s-16" style="overflow: hidden">
                <div class="pt8">
                  <p v-html="q.desc"></p>
                </div>
              </div>
            </Transition>
          </div>
        </li>
      </ul>
      <div class="more-button" :class="{ 'new-more': isNewJa }">
        <my-button
          class="more-link"
          href="/faq.htm"
          :label="moreText + (isNewJa ? '' : ' >')"
          size="normal"
          theme="border"
        />
      </div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.faq-content {
  cursor: pointer;
  background-color: @bg-white;
  border-radius: 12px;
  // min-height: 68px;
  padding: 20px 30px;
  box-sizing: border-box;
  .faq-title {
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // font-size: 18px;
    color: @base-text-color;
    font-weight: bold;
    // line-height: 28px;
    // font-size: 18px;
  }
  .icon-expand_down {
    font-size: 14px;
    color: #d8d8d8;
  }
  .faq-desc {
    color: @base-text-color;
    line-height: 24px;
    // font-size: 16px;
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

.more-button {
  margin-top: 28px;
  text-align: center;
}

@media (max-width: 1024px) {
}
@media (max-width: 460px) {
}
</style>
