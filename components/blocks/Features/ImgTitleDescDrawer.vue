<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => ({
      value: '',
    }),
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const blockData = props.items as any
const item1 = blockData?.[0]
const item2 = blockData?.[1]
const subTitle1Height = ref(0)
const subTitle2Height = ref(0)
const imgBox1Height = ref(0)
const imgBox2Height = ref(0)
const windowWidth = ref()
const resizeHandle = () => {
  windowWidth.value = window.innerWidth
}

const isMobile = computed(() => {
  return useStore.common().mobile || windowWidth.value < 1000
})

onMounted(() => {
  window.addEventListener('resize', resizeHandle)
  resizeHandle()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandle)
})

const getSubTitleHeight = (index: number, height: number) => {
  if (index === 1) {
    subTitle1Height.value = height
  }
  if (index === 2) {
    subTitle2Height.value = height
  }
}

const getImgBoxHeight = (index: number, height: number) => {
  if (index === 1) {
    imgBox1Height.value = height
  }
  if (index === 2) {
    imgBox2Height.value = height
  }
}
const imgBoxHeight = computed(() => {
  return Math.max(imgBox1Height.value, imgBox2Height.value)
})

const subTitleHeight = computed(() => {
  return Math.max(subTitle1Height.value, subTitle2Height.value)
})
</script>

<template>
  <div class="block-box" :class="blockClass?.value ? blockClass?.value : 'no-bg'">
    <BaseContainer>
      <div>
        <h2
          v-if="title"
          class="text-center mb40 font-40 fw-bold"
          :class="{ 's1-mobile-tit': isMobile }"
          v-html="title"
        ></h2>
        <p v-show="desc" class="mb40 text-center" v-html="desc"></p>

        <div class="card-items" :class="{ 'justify-content': blockData && blockData.length === 1 }">
          <!-- 要计算两个item的高度没有使用 for循环渲染 -->
          <div v-if="item1" :class="[{ 'block-item': !isMobile }]">
            <PagesProductFeaturesHImgTextText
              class="s1-2"
              :alt="item1?.mediaAlt || ''"
              :img-path="item1?.media?.data?.attributes?.url"
              :img-width="item1?.media?.data?.attributes?.width"
              :img-height="item1?.media?.data?.attributes?.height"
              :img-style="item1?.media?.data?.attributes?.imgStyle || {}"
              :title="item1.title"
              :desc="item1.desc"
              :is-mobile="isMobile"
              :sub-title-height="subTitleHeight"
              :img-box-height="imgBoxHeight"
              @get-sub-title-height="(height) => getSubTitleHeight(1, height)"
              @get-img-box-height="(height) => getImgBoxHeight(1, height)"
            />
          </div>

          <div v-if="item2" :class="[{ 'block-item': !isMobile }]">
            <PagesProductFeaturesHImgTextText
              class="s1-2"
              :alt="item2?.mediaAlt || ''"
              :img-path="item2?.media?.data?.attributes?.url"
              :img-width="item2?.media?.data?.attributes?.width"
              :img-height="item2?.media?.data?.attributes?.height"
              :img-style="item2?.media?.data?.attributes?.imgStyle || {}"
              :title="item2.title"
              :desc="item2.desc"
              :is-mobile="isMobile"
              :sub-title-height="subTitleHeight"
              :img-box-height="imgBoxHeight"
              @get-sub-title-height="(height) => getSubTitleHeight(2, height)"
              @get-img-box-height="(height) => getImgBoxHeight(2, height)"
            />
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<style lang="less" scoped>
.card-items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  // margin-bottom: 40px;
}
.card-items.justify-content {
  justify-content: center;
}
.s1-mobile-tit {
  text-align: center;
  color: @base-text-color;
}
.block-item {
  width: 48.3%;
  // margin-bottom: 40px;
}
</style>
