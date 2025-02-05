<script setup lang="ts">
const props = defineProps({
  searchWords: {
    type: String,
    default: '',
  },
  faqs: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  faqTotal: {
    type: Number,
    default: 0,
  },
  locales: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['changePage'])

const pageSize = 5

const defaultExpandFaqs = computed(() => {
  return (props.faqs as any).map((item: any) => item.id)
})

const changePage = (page: number) => {
  emit('changePage', page)
}
</script>

<template>
  <div class="block-box pt0">
    <BaseContainer>
      <div
        v-if="searchWords"
        class="tips pt20 pb20 pl32 font-size-24 font-700 mb40"
        v-html="locales.search_tips"
      ></div>

      <div v-if="!faqs || !faqs.length || !searchWords" class="empty mb80">
        <my-img src="https://c6.dvdfab.cn/images/faq/empty.png" width="260" height="140" alt="faq-empty" />
        <p class="empty-text mt15" v-html="locales.search_empty"></p>
      </div>
      <PagesFaqResultItems v-else :default-expand-faqs="defaultExpandFaqs" :faqs="faqs" />
      <div v-if="faqTotal > pageSize" class="mt40">
        <BasePagination
          type="event"
          :current-page-prop="currentPage"
          :total="faqTotal"
          :page-size="5"
          @change-page="changePage"
        />
      </div>
      <!-- <ContactSection page-key="faq" /> -->
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.tips {
  background: #f4f4f4;
  border-radius: 10px;
  // display: flex;
  // align-items: center;
  // line-height: 1;
  // vertical-align: middle;
  :deep(span) {
    color: @primary-color;
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
