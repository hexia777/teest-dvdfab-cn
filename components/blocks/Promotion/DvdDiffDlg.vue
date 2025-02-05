<script setup lang="ts">
defineOptions({ name: 'DvdDiffDlg' })
const props = defineProps({
  // 大标题
  title: {
    type: String,
    default: 'Congratulations!',
  },
  desc: {
    type: String,
    default: "You've received a limited-time <span>$10</span> discount for upgrading to {proName} !",
  },
  btnText: {
    type: String,
    default: 'Apply Discount Code',
  },
})

const curCookie = unref(useCookie('dvdfab_discount_dlg'))
const dlgShow = ref<boolean>(true)

// 获取用户类型
const userType = computed(() => {
  // 用户画像
  const userTagsObj: any = useStore.common().userTagsRes || {}
  // 已花费金额$140~$180和$80~$120的两个区间用户
  const isDfPW =
    (userTagsObj.dvdfab_win_num_spending > 140 && userTagsObj.dvdfab_win_num_spending < 180) ||
    (userTagsObj.dvdfab_win_num_spending > 80 && userTagsObj.dvdfab_win_num_spending < 120)
  const isDfPM =
    (userTagsObj.dvdfab_mac_num_spending > 140 && userTagsObj.dvdfab_mac_num_spending < 180) ||
    (userTagsObj.dvdfab_mac_num_spending > 80 && userTagsObj.dvdfab_mac_num_spending < 120)
  return { isDfPW, isDfPM }
})

// 产品名称
const proName = computed(() => {
  let name = ''
  const commomJson = useI18n().value.common
  const { isDfPW, isDfPM } = userType.value
  if (isDfPW && isDfPM) {
    name = commomJson.dvdfab_aio_name_win + ', ' + commomJson.dvdfab_aio_name_mac
  } else if (isDfPW && !isDfPM) {
    name = commomJson.dvdfab_aio_name_win
  } else if (!isDfPW && isDfPM) {
    name = commomJson.dvdfab_aio_name_mac
  }
  return name
})

// 是否显示
const visible = computed(() => {
  const { isDfPW, isDfPM } = userType.value
  return !curCookie && (isDfPW || isDfPM)
})
const showDlg = () => {
  if (visible) {
    let timer: any = null
    let count: number = 0
    // 折扣弹窗已经显示出来了，则设置cookie，下次不再显示
    timer = setInterval(() => {
      count++
      if (count > 10) {
        clearInterval(timer)
      }
      if (document.querySelector('.discountDlgBox')) {
        clientSetCookie('dvdfab_discount_dlg', '1')
        clearInterval(timer)
      }
    }, 3000)
  }
}
const closeDlg = () => {
  clientSetCookie('dvdfab_discount_dlg', '1')
  dlgShow.value = false
}

onMounted(() => {
  nextTick(() => {
    showDlg()
  })
})
</script>

<template>
  <div v-if="visible && dlgShow" class="fixed-container discountDlgBox">
    <div class="inner-container">
      <h5 class="title text-center" v-html="title"></h5>
      <div class="content">
        <i class="icon_dvdfab13_logo"></i>
        <div class="right" v-html="desc.replace('{proName}', proName)"></div>
      </div>
      <div class="bottom-btn text-center">
        <a @click="closeDlg" v-html="btnText"></a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.fixed-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
}
.inner-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 644px;
  border-radius: 12px;
  background: #fff img_url('/cn/common/dlg_bg.png') top center no-repeat;
  color: @base-text-color;
  padding: 24px;
  .title {
    font-size: 24px;
    margin: 24px 0;
  }
  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    .right {
      flex: 1;
      margin-left: 12px;
      span {
        font-size: 20px;
        color: #ff9000;
      }
    }
    :deep(.right) {
      span {
        font-size: 20px;
        color: #ff9000;
      }
    }
  }
  .bottom-btn {
    margin-top: 24px;
    a {
      height: 48px;
      background: #00a9f0;
      border-radius: 24px;
      display: inline-flex;
      padding: 0 24px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      &:hover {
        background: #2dc1ff;
        color: #fff;
      }
    }
  }
  @media (max-width: 640px) {
    width: 90%;
    .content {
      .right {
        flex: unset;
        width: 100%;
        margin-left: 0;
        text-align: center;
        margin-top: 10px;
      }
      > i {
        position: absolute;
        top: -45px;
      }
    }
    .title {
      margin-top: 36px;
      margin-bottom: 0;
    }
  }
}
</style>
