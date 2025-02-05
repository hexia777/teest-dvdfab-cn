<script setup lang="ts">
const { apiStreamfabMycombo } = useApi()
const { $trace } = useNuxtApp() as any
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  loadingData: {
    type: Boolean,
    default: false,
  },
  dlgInfo: {
    type: Object,
    default: () => {
      return {
        list: [],
        curPid: 0,
      }
    },
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  os: {
    type: String,
    default: 'win',
  },
})
const mycomboCheckList: any = ref(null)
const selPids = ref(null)
const emits = defineEmits(['update:modelValue'])
// 方法
// 关闭弹窗
const closeDialog = () => {
  $trace.traceCustomEvent({
    event: 'click',
    event_category: 'close_customize',
    customize_options: selPids.value,
  })
  emits('update:modelValue', false)
}
const curDlgInfo = reactive({ list: [], curPid: props.dlgInfo.curPid })

const loadingStatus = ref(false)

const textInfo: any = reactive({
  dialogTitle: '',
  checkBtnText: '',
  includedText: '',
  selectedTip: '',
  recomAioText: '',
  selectRequestText: '',
})
const osText = computed(() => {
  return props.os
})
const renderInfoHandle = (os: string) => {
  const forSysData: any = curDlgInfo.list.find((litem: any) => {
    const newItem = litem.attributes
    return newItem.system === os
  })
  for (const key in textInfo) {
    textInfo[key] = forSysData?.attributes[key] || ''
  }
}
if (curDlgInfo.list.length) {
  renderInfoHandle(osText.value)
}
const selPidsChange = (_selPids: any) => {
  selPids.value = _selPids
}
// 监听
// 窗口打开
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      curDlgInfo.curPid = props.dlgInfo.curPid
      if (props.loadingData) {
        loadingStatus.value = true
        apiStreamfabMycombo.getCheckProList().then((res) => {
          loadingStatus.value = false
          curDlgInfo.list = res.data.value?.data || []
          renderInfoHandle(osText.value)
        })
      } else {
        curDlgInfo.list = props.dlgInfo.list
        curDlgInfo.curPid = props.dlgInfo.curPid
        renderInfoHandle(osText.value)
      }
      // mycomboCheckList?.value.getPlanPrice()
    }
  },
)
</script>

<template>
  <transition name="dialog-fade">
    <div v-if="modelValue" class="vd-dialog">
      <div class="close-icon w54 h54 flex-center" @click="closeDialog">
        <i class="iconfont-sg icon-close-line font-size-54"></i>
      </div>
      <BaseContainer>
        <el-skeleton :loading="loadingStatus" class="dark" animated>
          <template #template>
            <div class="flex gap80 skeleton-content">
              <div class="w100% flex flex-col">
                <div class="flex flex-col flex-items-center">
                  <el-skeleton-item variant="h3" class="w100%! max-w-280 h32! mb54" />
                </div>
                <el-skeleton-item variant="text" class="w100%! h464! mb40" />
                <el-skeleton-item variant="text" class="w100%! h200!" />
              </div>
            </div>
          </template>
          <template #default>
            <div
              class="vd-dialog-title text-center font-size-36 font-bold mb60"
              v-html="textInfo.dialogTitle"
            ></div>
            <PagesProductTabMyComboCheckList
              ref="mycomboCheckList"
              :os="osText"
              :g-track-info="gTrackInfo"
              :dlg-info="{ ...curDlgInfo, textInfo: textInfo }"
              @sel-pids-change="selPidsChange"
            />
          </template>
        </el-skeleton>
      </BaseContainer>
    </div>
  </transition>
</template>

<style scoped lang="less">
.vd-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: #f1f8fe;
  padding: 80px 0;
  z-index: 999;
  color: @base-text-color;
}
.close-icon {
  position: absolute;
  right: 40px;
  top: 40px;
  color: #a7a7a7;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    color: @primary-color;
  }
}
</style>
