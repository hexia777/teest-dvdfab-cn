<script setup lang="ts">
import { nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  pid: {
    type: Number,
    default: -1,
  },
  pname: {
    type: String,
    default: '',
  },
  domId: {
    type: String,
    default: 'J_buy_dlg',
  },
  hasMac: {
    type: String,
    default: '', // 'true' 'false'
  },
})

const {
  loadingStatus,
  proInfo,
  proLine,
  dialogData,
  macProInfo,
  safeguardListData,
  recomPlanItems,
  bottomRecomPlanItem,
  payways,
  osText,
  dlgTitle,
  reloadBtnData,
  switchTabHandle,
} = useBuyDialog(props)

const curProInfo = useProInfo().value
const curMacProInfo = useMacProInfo().value

// 支持的支付方式
const paywaysImgList = ['visa', 'master', 'ae', 'jcb', 'applepay', 'goglepay']

// 定义 emits
const emits = defineEmits(['update:modelValue'])

// 基本变量
const commonJson = useI18n().value.common
const imagePath = useImgPath().value
const os = ref('')
os.value = useStore.common().client

const proId = ref(-1)
proId.value = props.pid
const opt = ref('')

// 底部推荐产品
// 是否展示 streamfab mycombo 弹窗
const shoSfMyCombo = ref<boolean>(false)

const route = useRoute()

// 方法
const showDialog = () => {
  emits('update:modelValue', true)
}
// 关闭弹窗
const closeDialog = () => {
  dlgTitle.value = ''
  emits('update:modelValue', false)
}

const showMycomboHandle = () => {
  shoSfMyCombo.value = true
}

/**
 *** 订阅弹窗
 * */
const showSubDlg = ref(false)
const proItem = ref({})
// 显示订阅弹窗
const showSubDlgHandle = (curPro: any) => {
  if (payways) {
    const curProInfo = osText.value === 'win' ? proInfo : macProInfo
    proItem.value = {
      ...curPro,
      ...curProInfo.value,
    }
    nextTick(() => {
      showSubDlg.value = true
    })
  }
}

// 关闭订阅弹窗
const closeSubDlgHandle = () => {
  showSubDlg.value = false
}

/** 页面两个产品的购买弹窗，解决订阅输入框弹出两个的问题,
      有的产品页多个购买弹窗，引入多的订阅弹窗删除掉 */
const onlyOneDlgCtrlHandle = () => {
  const proSubDlg = document.querySelectorAll('.pro-sub-dlg')
  if (proSubDlg && proSubDlg.length > 1) {
    for (let i = 1; i < proSubDlg.length; i++) {
      proSubDlg[i].remove()
    }
  }
  const subBtns = document.querySelectorAll("a[data-vars-event='subscribe']")
  for (let i = 0; i < subBtns.length; i++) {
    subBtns[i].addEventListener('click', (e: any) => {
      e.preventDefault()
      const href = e.target.getAttribute('href')
      const params = getUrlParams(href)
      // 页面两个产品的购买弹窗，解决订阅输入框弹出两个的问题
      // if (params.pid == this.win_pid || getWinPidByMacPid(params.pid) == this.win_pid) {
      showDialog()
      proId.value = +params.pid
      opt.value = params['opt' + proId.value]
      // this.$refs[this.domId].dlgShow = true
      // proInfo.pid = +params.pid
      // this.opt = params['opt' + this.pid]
      // }
    })
  }
}
// 产品页链接中添加参数open=true, 当包含改参数时，默认打开Buy Now 弹窗
const autoOpenDlg = () => {
  const rQuery = route.query || {}
  if (rQuery?.open && rQuery?.open === 'true') {
    if (rQuery.dlg_pid) {
      showDialog()
    } else {
      const _curPro = osText.value === 'win' ? curProInfo : curMacProInfo
      if (_curPro.type === 'single' || _curPro.type === 'bundle') {
        showDialog()
      }
    }
  }
}
// 立即调用
autoOpenDlg()
// 标题
const _dlgTitle = computed(() => {
  const _ProInfo = useProInfo().value
  const _MacProInfo = useMacProInfo().value
  const _curPro = osText.value === 'win' ? _ProInfo : _MacProInfo
  return props.pname || dlgTitle.value || _curPro.name || _MacProInfo.name
})
const routeName = useRoute().name as string
const curPid = computed(() => {
  const _ProInfo = proInfo.value
  const _MacProInfo = macProInfo.value
  const _curPro = osText.value === 'win' ? _ProInfo : _MacProInfo
  return _curPro.pid || 0
})

const _hasMac = computed(() => {
  const _MacProInfo = useMacProInfo().value
  // 此mac弹窗 不显示switchOs
  if (routeName === 'mac_blu_ray_player') {
    return false
  } else {
    return props.hasMac ? props.hasMac === 'true' : _MacProInfo && Object.keys(_MacProInfo).length
  }
})

// 生命周期
onMounted(() => {
  onlyOneDlgCtrlHandle()
})
</script>

<template>
  <transition name="dialog-fade">
    <div v-if="modelValue" :id="domId" class="vd-dialog pro-sub-dlg">
      <div class="close-icon w54 h54 flex-center" @click.stop="closeDialog">
        <i class="iconfont-sg icon-close-line font-size-54"></i>
      </div>
      <BaseContainer class="flex flex-col flex-items-center">
        <div class="buy-dlg-content">
          <div class="title3 text-center mb40">{{ dlgTitle || _dlgTitle || 'Dialog Title' }}</div>
          <el-skeleton :loading="loadingStatus" class="dark" animated>
            <template #template>
              <div class="flex gap80 skeleton-content">
                <div class="w100% flex flex-col">
                  <div class="flex flex-col flex-items-center mb82">
                    <el-skeleton-item v-if="_hasMac" variant="text" class="w100%! max-w-280 h32!" />
                  </div>
                  <div class="flex gap20 sc-mobile">
                    <el-skeleton-item variant="text" class="w100%! h464! mb24" />
                    <el-skeleton-item variant="text" class="w100%! h464! mb24" />
                    <el-skeleton-item variant="text" class="w100%! h464! mb24" />
                  </div>
                  <el-skeleton-item variant="text" class="w100%! h200! mt65 m-auto" />
                </div>
              </div>
            </template>
            <template #default>
              <div class="flex-center">
                <BaseSwitchOs
                  v-if="_hasMac"
                  theme="blue"
                  :is-update-all="false"
                  :os="osText"
                  @tab-click="switchTabHandle"
                />
              </div>
              <div class="buy-dlg-content2 mt82">
                <div class="recom-pro-items">
                  <template v-for="(item, idx) in recomPlanItems" :key="'buy-dlh-recom' + idx">
                    <div class="recom-item" :class="{ best: item.isBest }">
                      <!-- tag -->
                      <div v-if="item.isBest" class="tag-box best" v-html="item.bestText"></div>
                      <div
                        v-if="item.rightTopTag"
                        class="tag-box right-top-tag"
                        v-html="item.rightTopTag"
                      ></div>
                      <!-- title -->
                      <div
                        class="title5 min-h56 text-center"
                        v-html="item.key === 'aio_youtube_pro' ? dialogData.recommended : item.title"
                      ></div>
                      <div
                        v-if="item.desc"
                        class="text-center min-h-160"
                        v-html="
                          item.key === 'aio_youtube_pro' ? item.title + '<br />' + item.desc : item.desc
                        "
                      ></div>
                      <template v-if="item.key === 'mycombo' && !item.isUpgrade">
                        <!-- price -->
                        <div class="price-box flex flex-justify-center flex-items-baseline">
                          <span class="gray-color font-s-14 mr12" v-html="item.startPriceText"></span>
                          <span class="title3" v-html="item.startPriceNum"></span>
                        </div>
                        <!-- btn -->
                        <div
                          v-if="reloadBtnData.value && reloadBtnData?.reloadOs[osText]"
                          class="btn-group flex-center mt20"
                        >
                          <MyButtonBuy
                            v-track:click="{ ...item.event?.click, event_category: 'open_customize' }"
                            v-track:exposure="item.event?.exposure"
                            :show-icon="false"
                            :theme="item.isBest ? 'yellow' : 'border'"
                            tag="div"
                            :label="item.btnText"
                            @click="showMycomboHandle"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <!-- price -->
                        <div class="price-box flex flex-justify-center flex-items-baseline min-h40">
                          <span class="title3" v-html="item.price"></span>
                          <del
                            v-if="item.oriPrice"
                            class="gray-color font-s-14 ml8"
                            v-html="item.oriPrice"
                          ></del>
                        </div>
                        <!-- btn -->
                        <div
                          v-if="reloadBtnData.value && reloadBtnData?.reloadOs[osText]"
                          class="btn-group flex-center mt20"
                        >
                          <MyButtonBuy
                            v-if="item.opt !== 'LFT'"
                            v-track:click="{
                              ...item.event?.click,
                              event: 'subscribe',
                              ext_params_str_param1: '',
                              ext_params_str_param3: '',
                            }"
                            v-track:exposure="item.event?.exposure"
                            :show-icon="false"
                            :href="item.checkoutUrl"
                            :theme="item.isBest ? 'yellow' : 'border'"
                            :label="item.isUpgrade ? commonJson.upgrade_now : commonJson.buy_now"
                            @click.prevent="showSubDlgHandle(item)"
                          />
                          <MyButtonBuy
                            v-else
                            v-track:click="{
                              ...item.event?.click,
                              event: 'buy_now',
                            }"
                            v-track:exposure="item.event?.exposure"
                            :show-icon="false"
                            :href="item.checkoutUrl"
                            :theme="item.isBest ? 'yellow' : 'border'"
                            :label="
                              item.isUpgrade
                                ? item.btnText
                                  ? item.btnText
                                  : commonJson.upgrade_now
                                : commonJson.buy_now
                            "
                          />
                        </div>
                      </template>

                      <!-- split line -->
                      <div v-if="item.descList && item.descList.length" class="border-line"></div>
                      <!-- notice items -->
                      <div v-if="item.noticeItems && item.noticeItems.length" class="notice-items mt12">
                        <template v-for="notice in item.noticeItems" :key="notice">
                          <div class="item" v-html="notice"></div>
                        </template>
                      </div>
                      <!-- includes items -->
                      <div v-if="item.includeItems && item.includeItems.length" class="include-items mt12">
                        <div v-if="proLine === 'recordfab'">
                          <template v-for="include in item.includeItems" :key="include">
                            <div class="item no-dot" v-html="include.value"></div>
                          </template>
                        </div>
                        <template v-else>
                          <div class="include-title mb8">
                            {{ dialogData.tag.productsIncluded.replace('{num}', item.includeItems.length) }}
                          </div>
                          <template v-for="include in item.includeItems" :key="include">
                            <div class="item" v-html="include.attributes.shortName"></div>
                          </template>
                        </template>
                      </div>
                      <!-- gift items -->
                      <div
                        v-if="item.giftItems && item.giftItems.length"
                        class="w100% gift-items mt12"
                        :class="{ 'has-img': item.giftProImg }"
                      >
                        <MyImg v-if="item.giftProImg" :src="item.giftProImg.url" width="100" height="100" />
                        <div class="gift-item-list">
                          <template v-for="gift in item.giftItems" :key="gift">
                            <div class="item font-s-14 lineheight-1.5">
                              <span class="gift-icon">
                                <i class="iconfont-sg icon-gift"></i>
                              </span>
                              <div v-html="gift.value"></div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <!-- feature items -->
                      <div class="feature-items mt20" :class="[item.featureClass]">
                        <template
                          v-for="feature in item.specialGiftValue && item.specialGiftValue.length
                            ? [...item.specialGiftValue, ...item.descList]
                            : item.descList"
                          :key="'feature' + feature.id"
                        >
                          <div class="item flex lineheight-1.2">
                            <span class="check-icon flex-none mr12">
                              <i class="iconfont-sg icon-check-l-n"></i>
                            </span>
                            <div v-html="feature.value"></div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  v-if="bottomRecomPlanItem && Object.keys(bottomRecomPlanItem).length"
                  class="bottom-recom-pro"
                  :class="{ 'no-img': !bottomRecomPlanItem.proImg }"
                >
                  <div class="recom-left">
                    <MyImg
                      v-if="bottomRecomPlanItem.proImg"
                      :src="bottomRecomPlanItem.proImg?.url"
                      :alt="bottomRecomPlanItem.title"
                      width="220"
                      height="220"
                      class="mr24"
                    />
                    <div class="recom-info">
                      <div class="title5" v-html="bottomRecomPlanItem.title"></div>
                      <div class="mt12" v-html="bottomRecomPlanItem.desc"></div>

                      <div
                        v-if="bottomRecomPlanItem.giftItems && bottomRecomPlanItem.giftItems.length"
                        class="gift-items"
                      >
                        <div
                          v-for="(giftTxt, idx) in bottomRecomPlanItem.giftItems"
                          :key="'bottom-recom-gift' + idx"
                          class="item"
                        >
                          <span class="gift-icon">
                            <i class="iconfont-sg icon-gift2"></i>
                          </span>
                          <div v-html="giftTxt.value"></div>
                        </div>
                      </div>
                      <!-- feature items -->
                      <div
                        v-if="bottomRecomPlanItem.descList && bottomRecomPlanItem.descList.length"
                        class="feature-items mt20 flex flex-wrap gap16"
                      >
                        <template
                          v-for="feature in bottomRecomPlanItem.descList"
                          :key="'feature' + feature.id"
                        >
                          <div class="item flex lineheight-1.2 mt0! w48%">
                            <span class="check-icon flex-none mr12">
                              <i class="iconfont-sg icon-check-l-n"></i>
                            </span>
                            <div v-html="feature.value"></div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="recom-right">
                    <!-- tag -->
                    <div v-if="bottomRecomPlanItem.isBest" class="tag-img-box flex-center best">
                      <MyImg
                        :src="`${imagePath}/cn/buyDlg/off-tag.png`"
                        :alt="bottomRecomPlanItem.bestText"
                        width="122"
                        height="122"
                      />
                      <span
                        class="tag-text color-price2 font-bold"
                        v-html="bottomRecomPlanItem.bestText"
                      ></span>
                    </div>
                    <div
                      v-if="bottomRecomPlanItem.rightTopTag"
                      class="tag-box right-top-tag"
                      v-html="bottomRecomPlanItem.rightTopTag"
                    ></div>
                    <!-- price -->
                    <div class="price-box flex flex-col flex-items-center">
                      <del
                        v-if="bottomRecomPlanItem.oriPrice"
                        class="gray-color font-s-14 mb8"
                        v-html="bottomRecomPlanItem.oriPrice"
                      ></del>
                      <span class="title3" v-html="bottomRecomPlanItem.price"></span>
                    </div>
                    <!-- avg txt -->
                    <div
                      v-if="bottomRecomPlanItem.priceDesc"
                      class="mt8"
                      v-html="bottomRecomPlanItem.priceDesc"
                    ></div>
                    <div v-if="reloadBtnData.value && reloadBtnData?.reloadOs[osText]" class="btn-group mt16">
                      <MyButtonBuy
                        v-track:click="bottomRecomPlanItem.event?.click"
                        v-track:exposure="bottomRecomPlanItem.event?.exposure"
                        :show-icon="false"
                        :href="bottomRecomPlanItem.checkoutUrl"
                        :label="bottomRecomPlanItem.isUpgrade ? commonJson.upgrade_now : commonJson.buy_now"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 底部介绍部分 -->
              <div class="bottom-introduce pt49 mt65">
                <div class="payways flex-center gap20">
                  <template v-for="item in paywaysImgList" :key="item">
                    <MyImg :src="`${imagePath}/cn/buyDlg/${item}.png`" :alt="item" width="75" height="53" />
                  </template>
                </div>
                <div class="safeguard flex flex-items-center flex-justify-between gap40 mt60">
                  <template v-for="(item, index) in safeguardListData" :key="'safeguard' + index">
                    <div class="gray-color flex-center w25% lineheight-1.2">
                      <i class="iconfont-sg gray-color font-size-35 mr10" :class="item.icon"></i>
                      <span v-html="item.text"></span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </BaseContainer>
      <PagesDialogSubDlg
        v-if="showSubDlg"
        :show="showSubDlg"
        :pay-obj="payways"
        :pro-item="proItem"
        @close="closeSubDlgHandle"
      />
      <PagesDialogCheckMyCombo
        v-model="shoSfMyCombo"
        :loading-data="true"
        :dlg-info="{ curPid: curPid }"
        :os="osText"
        :g-track-info="{
          ext_params_str_param1: 'streamfab_productpage_popup',
          ext_params_str_param2: 'mycombo_customize',
        }"
      />
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
  padding: 40px 0 120px;
  z-index: 9999;
  color: @base-text-color;
}
.close-icon {
  position: absolute;
  right: 40px;
  top: 40px;
  color: #bed2e3;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    color: @primary-color;
  }
}
.bottom-introduce {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  width: 100%;
}
.check-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: radial-gradient(50% 50% at 50% 50%, #ffd5a0 0%, #ffe8cb 49%, rgba(255, 232, 203, 0) 100%);
  filter: blur(0px);
  i {
    color: @secondary-color;
    font-size: 14px;
  }
}
.buy-dlg-content2,
.buy-dlg-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.buy-dlg-content2 {
  max-width: 1060px;
}
.include-items {
  width: 100%;
  background: #fff9e5;
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  .include-title {
    font-weight: bold;
  }
  .item {
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      margin-right: 8px;
      background-color: @secondary-color;
    }
    &.no-dot {
      &::before {
        display: none;
      }
    }
  }
}
.feature-items {
  width: 100%;
  .item + .item {
    margin-top: 16px;
  }
}
.notice-items {
  font-size: 14px;
  font-size: 14px;
  color: @secondary-color;
}
.gift-items {
  margin-top: 12px;

  .item {
    display: flex;
    font-size: 14px;
    & + .item {
      margin-top: 12px;
    }
  }
  .gift-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    background-color: @secondary-color;
    color: @text-white-color;
    border-radius: 16px;
    margin-right: 12px;
    flex: none;

    i {
      width: 10px;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 8px;
    }
  }
}
.recom-pro-items {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  width: 100%;
  .border-line {
    width: 100%;
    height: 1px;
    background-color: @border-gray2;
    margin-top: 40px;
  }
  .gift-items {
    padding: 12px;
    border: 1px solid rgba(255, 144, 0, 0.2);
    border-radius: 8px;
    &.has-img {
      border: none;
      display: flex;
      padding: 0;
      background: linear-gradient(180deg, rgba(255, 247, 226, 0.1), #fff0ca);
      border-radius: 0;
      padding: 0;
      .gift-item-list {
        padding: 4px;
      }
    }
    .gift-icon {
      width: 24px;
      height: 24px;
      background-color: rgba(255, 144, 0, 0.2);
      border-radius: 24px;
      color: @secondary-color;
      i {
        font-size: 18px;
      }
    }
  }
  .recom-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33.33333%;
    background-color: @bg-white;
    padding: 50px 24px 24px;
    border-radius: 10px;
    border: 2px solid @border-gray2;
    position: relative;
    &.best {
      background: linear-gradient(180deg, #a740ff 0%, #6855df 100%);
      color: @text-white-color;
      border: none;
      .check-icon {
        background: radial-gradient(
          50% 50% at 50% 50%,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.2) 49%,
          rgba(255, 255, 255, 0) 100%
        );
        i {
          color: @text-white-color;
        }
      }
      .price-box {
        color: @price-color;
      }
      .border-line {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .gift-items {
        border: 1px solid rgba(255, 255, 255, 0.2);
        .gift-icon {
          background-color: rgba(255, 255, 255, 0.2);
          i {
            color: @price-color;
          }
        }
      }
      .gray-color {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .streamfab-upgrade {
      width: 100%;
      .item {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
      :deep(.item) {
        b {
          color: @secondary-color;
        }
      }
      .check-icon {
        display: none;
      }
    }
  }
}
.bottom-recom-pro {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  position: relative;
  background-color: @bg-white;
  padding: 20px 32px 20px 20px;
  border-radius: 10px;
  margin-top: 64px;
  gap: 32px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 1px; // 控制border宽度
    border-radius: 8px;
    background: linear-gradient(-90deg, #a740ff 0%, #008aff 100%);
    transition: 0.1s;
    --mask-bg: linear-gradient(red, red); // 随便设置一个背景都可以
    --mask-clip: content-box, padding-box;
    -webkit-mask-image: var(--mask-bg), var(--mask-bg);
    -webkit-mask-clip: var(--mask-clip);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }
  .recom-left {
    display: flex;
    align-items: center;
  }
  .recom-right {
    padding-left: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: 1px solid @border-gray1;
  }
  &.no-img {
    padding-left: 32px;
    min-height: 180px;
    .price-box {
      flex-direction: row;
      align-items: baseline;
      del {
        margin-bottom: 0;
        margin-right: 8px;
      }
    }
  }
}
.tag-box {
  position: absolute;
  background: linear-gradient(90deg, #ff8a00 0%, #ffc000 100%);
  border-radius: 4px;
  padding: 4px 16px;
  color: @text-white-color;
  font-weight: bold;
  top: -12px;
  text-align: center;
  &.best {
    min-width: 220px;
    max-width: 98%;
    padding: 10px 16px;
    top: -18px;
  }
  &.right-top-tag {
    right: 0;
  }
}
.tag-img-box {
  position: absolute;
  width: 122px;
  height: 122px;
  left: -4px;
  top: -4px;
  .tag-text {
    top: 30px;
    left: -16px;
    text-align: center;
    width: 100%;
    position: absolute;
    transform: rotate(-45deg);
  }
}

@media (max-width: 1024px) {
  .close-icon {
    top: 30px;
    right: 30px;
  }
  .sc-mobile {
    flex-direction: column;
    align-items: center;
  }
  .el-skeleton__item {
    max-width: 496px;
    &.m-auto {
      margin: 65px auto 0;
    }
  }
  .recom-pro-items {
    flex-direction: column;
    align-items: center;
    gap: 56px;
    .recom-item {
      width: 100%;
      max-width: 496px;
    }
  }
  .bottom-recom-pro {
    flex-direction: column;
    width: 100%;
    max-width: 496px;
    .recom-left {
      flex-direction: column;
      align-items: center;
      .title5 {
        text-align: center;
        margin-top: 12px;
      }
    }
    .recom-right {
      padding-left: 0;
      padding-top: 30px;
      border-left: none;
      border-top: 1px solid #eeeeee;
    }
  }
  .bottom-introduce {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .payways {
    flex-wrap: wrap;
  }
  .safeguard {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    .w25\% {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
@media (max-width: 768px) {
  .close-icon {
    top: 10px;
    right: 0px;
  }
  .bottom-recom-pro {
    .feature-items {
      .item {
        width: 100%;
      }
    }
  }
}

@media (max-width: 640px) {
  .bottom-recom-pro {
    .feature-items {
      .item {
        width: 100%;
      }
    }
  }
}
@media (max-width: 414px) {
  .bottom-recom-pro {
    .recom-left {
      img {
        width: 190px;
        height: 190px;
      }
    }
  }
}
</style>
