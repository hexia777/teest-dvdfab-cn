<script setup lang="ts">
import { nextTick } from 'vue'
const { $trace } = useNuxtApp() as any
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'no-bg',
      }
    },
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  startText: {
    type: String,
    default: '',
  },
  startPrice: {
    type: String,
    default: '',
  },
  media: {
    type: Object,
    default: () => {},
  },
})
const { apiStreamfabMycombo } = useApi()
const locale = useStore.common().locale
const macData: any = useAttrs().macData || props

const dlgInfo = reactive({
  list: [] as any,
})

// 是否展示 mycombo 弹窗
const showCombonModal = ref<boolean>(false)
const canClickBtn = ref<boolean>(false)

// 方法
const showCombonModalHandle = (isElk = true) => {
  showCombonModal.value = true
  if (isElk) {
    $trace.traceCustomEvent({
      event: 'click',
      event_category: 'open_customize',
    })
  }
}

const blockData = reactive({
  title: '',
  desc: '',
  priceInfo: {} as any,
  mediaList: [] as any,
  selectList: [] as any,
  dlgTextInfo: {} as any,
})

const renderData = (os: any) => {
  let propsInfo: any = os === 'win' ? props : macData
  if (!propsInfo) {
    propsInfo = props
  }
  blockData.title = propsInfo.title
  blockData.desc = propsInfo.desc
  blockData.priceInfo = {
    label: propsInfo.startText,
    value: propsInfo.startPrice,
  }
  blockData.mediaList = propsInfo.media?.data?.map((md: any) => {
    return md.attributes
  })
}

renderData(useOs().value)
const osText = computed(() => {
  return useOs().value
})
watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal)
  },
)
onMounted(() => {
  nextTick(() => {
    const route = useRoute()
    apiStreamfabMycombo.getCheckProList({ locale }).then((res) => {
      dlgInfo.list = res.data.value?.data || []
      canClickBtn.value = true
      const rQuery = route.query || {}
      if (rQuery?.mycomboopen && rQuery?.mycomboopen === 'true') {
        showCombonModalHandle(false)
      }
    })
  })
})
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <div class="mycombo-card-box flex flex-items-center flex-between gap40 p40">
        <div class="mcb-left">
          <div class="font-bold font-s-20 mb12" v-html="blockData.title"></div>
          <div class="mb10" v-html="blockData.desc"></div>
          <div class="pro-img-list flex flex-wrap gap20">
            <template v-for="(icon, idx) in blockData.mediaList" :key="'pro-icon' + idx">
              <MyImg :src="icon.url" :width="icon.width" :height="icon.height" />
            </template>
          </div>
        </div>
        <div class="mcb-right">
          <div class="flex-center mb24">
            <span class="mr16" v-html="blockData.priceInfo.label"></span>
            <span class="font-bold font-size-28" v-html="blockData.priceInfo.value"></span>
          </div>
          <MyButtonBuy
            tag="div"
            theme="white"
            :disabled="!canClickBtn"
            :show-icon="false"
            :label="'Customize Now'"
            @click="showCombonModalHandle"
          />
        </div>
        <PagesDialogCheckMyCombo
          v-model="showCombonModal"
          :os="osText"
          :dlg-info="dlgInfo"
          :loading-data="false"
        />
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.mycombo-card-box {
  color: @text-white-color;
  background-color: @primary-color;
  border-radius: @b-radius-md;
}

@media (max-width: 900px) {
  .mycombo-card-box {
    flex-direction: column;
  }
}
@media (max-width: 640px) {
  .mycombo-card-box {
    padding: @gap-base;
    .mcb-left {
      text-align: center;
    }
  }
  .pro-img-list {
    justify-content: center;
  }
}
</style>
