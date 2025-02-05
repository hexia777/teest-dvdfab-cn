<script setup lang="ts">
import vueRecaptcha from 'vue3-recaptcha2'
defineOptions({ name: 'SubDlg' })
const { locales, locale, optMap, currency, route } = useSubDlgCommon()
const { getCrossDomainElkParams } = useCheckoutCommon()
const { subForm, errShow, errTextObj, submitFlag } = useSubDlgData()
const { $trace } = useNuxtApp() as any

const props = defineProps({
  show: { type: Boolean, default: false },
  payObj: {
    type: Object,
    default: () => ({}),
  },
  proItem: {
    type: Object,
    default: () => ({}),
  },
  os: {
    type: String,
    default: 'win',
  },
})

const emit = defineEmits(['close'])
const orderType = 'subcribe'

const dlgShow = ref<boolean>(false)
const opt = ref(props?.proItem?.opt || '1Y')
const proInfo = ref(props?.proItem) || {}
const payInfo = ref(props?.payObj) || {}
let token = ''

const state = reactive<{
  showRecaptcha: boolean
  isSendRisk: boolean
  isReloadRecaptcha: boolean
}>({
  showRecaptcha: false,
  isSendRisk: false,
  isReloadRecaptcha: true,
})

// 弹窗展示监听
watch(
  () => props.show,
  (newVal) => {
    dlgShow.value = newVal
  },
  {
    deep: true,
  },
)
// 支付方式监听
watch(
  () => props.payObj,
  (newVal) => {
    payInfo.value = newVal
  },
)
// 产品信息监听
watch(
  () => props.proItem,
  (newVal) => {
    if (!newVal) {
      return
    }

    proInfo.value = newVal || {}
    opt.value = proInfo.value?.opt
  },
)

// 初始化
onMounted(() => {
  token = useCookie('laravel_session').value || ''
  nextTick(() => {
    if (subForm.email) {
      validateForm(true)
    }
  })
})

const getSubmitParams = () => {
  const email = subForm.email
  let payChannel = useStore.product()?.defualtPay ? useStore.product()?.defualtPay[orderType] : ''
  let platform = ''
  let affiliate = ''
  let ad = ''
  let ad1 = ''
  let referer = ''

  // url 参数带的支付通道
  if (route.params.pay) {
    payChannel = (route.params.pay as string) || ''
  } else if (payInfo.value?.pay) {
    // 优惠系统配置的支付通道
    payChannel = payInfo.value?.pay
    platform = payInfo.value?.platform || 'no_platform'
  } else {
    payChannel = useStore.product()?.defualtPay ? useStore.product()?.defualtPay[orderType] : ''
    platform = 'pay_method_error'
  }

  if (useCookie('affiliate').value) {
    affiliate = useCookie('affiliate').value || ''
  }
  if (useCookie('ad').value) {
    ad = useCookie('ad').value || ''
  }
  if (useCookie('ad1').value) {
    ad1 = useCookie('ad1').value || ''
  }
  if (useCookie('referer').value) {
    referer = encodeURIComponent(useCookie('referer').value as string)
  }

  // 提交订阅 - url 入参
  const url = {
    pid: proInfo.value?.pid,
    qty: '1',
    [`opt${proInfo.value?.pid}`]: proInfo.value?.opt,
    currency: currency[0],
    exchange: currency[0],
    pay: payChannel,
    platform,
    lang: locale,
    affiliate,
    ad,
    ad1,
    referer,
    laravel_session: token || '',
    domain: 'dvdfab.cn',
  }

  //  提交订阅信息
  const form: any = {
    email,
    confirm_email: email,
    fname: '',
    lname: '',
    address1: '',
    city: '',
    country: '',
    state: '',
    state_us: '',
    state_ac: '',
    zip: '',
    phone: '',
  }
  if (subForm.recaptcha) {
    form.recaptcha = subForm.recaptcha
  }
  return {
    url,
    form,
  }
}

// 人机验证过期操作，现在有问题，后续再操作
const recaptchaExpired = (vueRecaptchaRef: any) => {
  vueRecaptchaRef.reset()
}
// 人机验证
const validCode = (value: string) => {
  subForm.recaptcha = value
  if (value) {
    submitFlag.value = false
  }
}

// 风险校验
const validateRisk = () => {
  const formParams = getSubmitParams()
  const cookieParams: any = {
    token_id: useCookie('_EA_TID').value || '',
    finger_id: useCookie('_EA_FID').value || '',
    country: useCookie('country_info_code').value || '',
  }
  const params = {
    ...formParams.url,
    ...formParams.form,
    url: window.location.href,
    pids: (formParams.url.pid + '').split(','),
    referer: formParams.url.referer || 'referer',
  }
  for (const key in cookieParams) {
    if (cookieParams[key]) {
      params[key] = cookieParams[key]
    }
  }
  state.isSendRisk = true
  useApi()
    .apiProducts.validateRisk(params)
    .then((res: any) => {
      console.log('validateRisk  res', res)
    })
}

const clickSub = () => {
  if (submitFlag.value || !validateForm(false)) {
    return
  }

  const { $trace } = useNuxtApp() as any

  // 按钮设置可点击
  submitFlag.value = true

  const formParams = getSubmitParams()
  const urlParams = urlParamsToString(formParams.url) || ''

  $trace.traceCustomEvent({
    event: 'checkout',
    xargs_email_source: 'order',
    xargs_email_item: 'checkout',
    email: formParams.form.email,
    payment_gateway: payInfo.value.pay,
    payment_test: 'sub_dlg',
    pids: [proInfo.value?.pid],
    products: {
      list_count: 1,
      type: 'checkout',
      list: [{ pid: proInfo.value?.pid, year: proInfo.value?.opt }],
    },
  })

  useApi()
    .apiProducts.submitSubscribe(urlParams, formParams.form, { formData: true })
    .then((res) => {
      submitFlag.value = false
      const resStr = res?.data?.value || ''
      const resData = resStr ? JSON.parse(resStr) : {}
      if (resData?.result) {
        let href = resData.result?.location?.replace('/card-info-stripe.htm', '/card-info-pay.htm')
        // 需要跳转中间站的通道，url 都需要携带扩展参数
        if (href.startsWith('https://')) {
          href += getCrossDomainElkParams(formParams.form.email) || ''
        }

        if (!href.includes('&sub=1')) {
          window.location.href = href + '&sub=1'
        } else {
          window.location.href = href
        }
      } else if (res.error) {
        if (resData.error?.code === 'recaptcha_error') {
          alert(resData.error?.code)
          state.isReloadRecaptcha = false
          setTimeout(() => {
            state.isReloadRecaptcha = true
          }, 10)
          $trace.traceCustomEvent({
            event: 'submit',
            xargs_event_category: 'checkout_submit_error',
            event_label: 'recaptcha_error',
            email: subForm.email,
          })
        } else if (resData.error.code === 'risk_error') {
          state.showRecaptcha = true
          submitFlag.value = true
          $trace.traceCustomEvent({
            event: 'submit',
            xargs_event_category: 'checkout_submit_error',
            event_label: 'risk_error',
            email: subForm.email,
          })
        } else {
          alert(resData?.error?.message)

          $trace.traceCustomEvent({
            event: 'error',
            xargs_email_source: 'order',
            xargs_email_item: 'checkout',
            xargs_event_category: 'dialog_error_pro',
            email: formParams.form.email,
            payment_gateway: payInfo.value.pay,
            payment_test: 'sub_dlg',
            pids: [proInfo.value?.pid],
            products: {
              list_count: 1,
              type: 'checkout',
              list: [{ pid: proInfo.value?.pid, year: proInfo.value?.opt }],
            },
            fail_info: {
              detail: resData?.error?.message,
            },
          })
        }
      }
    })
}

// 验证表单
const validateForm = (sendRisk = true) => {
  /**
   * @function 验证邮箱是否正确, 并返回是否验证通过
   * @description reason: 是否返回错误原因, 错误：{flag: false, msg: '错误原因'}, 正确: true
   * @returns {string}
   */
  const validateEmail = (value: string, param: { reason?: boolean }) => {
    const { reason } = param || {}
    const locales = useI18n().value
    const emptyReg = /^\s*$/
    // eslint-disable-next-line no-useless-escape
    const emailReg = /^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    const result = {
      flag: true,
      msg: '',
      type: '',
    }

    // 多语言: 不能为空
    if (!value || emptyReg.test(value)) {
      if (reason) {
        result.flag = false
        result.msg = locales.common.field_required
        result.type = 'field_required'
        return result
      }

      return false
    } else if (!emailReg.test(value)) {
      // 多语言: 邮箱格式不正确
      if (reason) {
        result.flag = false
        result.msg = locales.common.invalid_email
        result.type = 'invalid_email'
        return result
      }

      return false
    } else if (value.toLowerCase().endsWith('@dvdfab.cn')) {
      // 多语言: 邮箱不能以 dvdfab.cn 结尾
      if (reason) {
        result.flag = false
        result.msg = locales.common.no_email_suffix
        result.type = 'email_dvdfab_suffix'
        return result
      }

      return false
    }

    if (reason) {
      // 多语言: 提交成功
      result.flag = true
      result.msg = locales.common.submit_success
      result.type = 'success'
      return result
    }

    return true
  }
  const emailVal = subForm.email
  const emailResult = validateEmail(emailVal, { reason: true }) || {}

  // 重置错误提示
  errTextObj.value = {
    email: '',
    agree: '',
  }

  // 邮箱验证
  if (!emailResult.flag) {
    errShow.value = true
    errTextObj.value.email = emailResult.msg

    // 邮箱不能以 dvdfab.cn 结尾
    if (emailResult?.type === 'email_dvdfab_suffix') {
      $trace.traceCustomEvent({
        event: 'click',
        xargs_event_category: 'email_error',
        ext_params_str_param1: 'has_dvdfab_cn',
        ext_params_str_param2: emailVal,
      })
    }
    return false
  }

  // 同意协议
  if (!subForm.agree) {
    errShow.value = true
    errTextObj.value.agree = locales.common.field_required

    return false
  }

  if (sendRisk) {
    validateRisk()
  }

  return true
}

const clickBtn = () => {
  dlgShow.value = false
  state.showRecaptcha = false
  subForm.recaptcha = ''
  state.isReloadRecaptcha = false
  setTimeout(() => {
    state.isReloadRecaptcha = true
  }, 10)
  submitFlag.value = false
  emit('close', dlgShow.value)
}
</script>

<template>
  <div class="sub-dlg pro-sub-dlg">
    <div class="content">
      <div class="pro-dlg-close" @click="clickBtn"></div>
      <my-img
        :src="`${useImgPath().value}/product_common/sub_dlg_logo.png`"
        style="max-width: 125px"
        width="125"
        height="125"
        layout="responsive"
        alt=""
        class="sub-dlg-logo"
      />
      <div class="mian-box">
        <div
          class="title font-bold text-center"
          v-html="
            locales?.common?.purchase_proname.replace('{product_name}', proInfo.shortName) +
            ' <span>' +
            optMap[opt] +
            '</span>'
          "
        ></div>
      </div>
      <div class="line"></div>
      <div class="mian-box">
        <!-- 邮箱输入 -->
        <div class="input_layer">
          <input
            v-model="subForm.email"
            type="text"
            :placeholder="locales?.common?.email_address"
            name="email"
            @blur="validateForm"
          />
        </div>
        <!-- 错误提示 -->
        <template v-if="errShow && errTextObj.email">
          <p v-if="errTextObj.email" class="error-msg" v-html="errTextObj.email"></p>
        </template>
        <!-- 确认协议 -->
        <label class="checkbox-label">
          <input v-model="subForm.agree" type="checkbox" name="agree" value="true" checked="checked" />
          <span class="sub-checkbox"> <i class="iconfont-sg icon-check-l-n"></i></span>
          <span v-html="locales?.common?.sub_dlg_msg"></span>
        </label>
        <!-- 错误提示 -->
        <template v-if="errShow && errTextObj.agree">
          <p v-if="errTextObj.agree" class="error-msg" v-html="errTextObj.agree"></p>
        </template>
        <!-- ...submitElkBaseInfo, -->
        <!-- v-track:click="{
            event: 'submit',
            xargs_event_category: 'dialog_error_pro',
            ...submitElkBaseInfo,
          }" -->
        <div v-if="state.showRecaptcha" class="mt24">
          <vueRecaptcha
            v-if="state.isReloadRecaptcha"
            ref="vueRecaptchaRef"
            sitekey="6LdPc3cjAAAAAIK0OsjuzPgIsXIxUUjF-iLv5cn8"
            @expire="recaptchaExpired"
            @verify="(val:string) => validCode(val)"
          />
        </div>
        <div
          href="javascript:;"
          class="submit-btn text-center font-bold"
          :class="{ disabled: submitFlag }"
          @click="clickSub"
          v-html="locales?.common?.continue"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.pro-sub-dlg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999999999;
  .pro-dlg-close {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    right: 14px;
    top: 14px;
    &:before,
    &:after {
      content: '';
      display: inline-block;
      width: 15px;
      height: 2px;
      background: #a7a7a7;
      position: absolute;
      top: 10px;
      left: 0;
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-60%);
    padding-top: 70px;
    padding-bottom: 30px;
    max-width: 96%;
    width: 450px;
    background: #ffffff;
    border-radius: 10px;
  }
  .title {
    font-size: 18px;
    span {
      display: inline-block;
    }
  }
  .sub-dlg-logo {
    position: absolute;
    top: -75px;
    left: 50%;
    transform: translateX(-50%);
  }
  .line {
    margin: 25px 0;
    width: 100%;
    height: 1px;
    border: 1px solid #eaeaea;
  }
  .mian-box {
    padding: 0 30px;
  }
  .checkbox-label {
    position: relative;
    padding-left: 20px;
    margin-top: 15px;
    display: block;
    font-size: 14px;
    input {
      display: none;
      &:checked + .sub-checkbox {
        border-color: #00a9f0;
        background-color: #00a9f0;
        i {
          display: inline-block;
          color: #fff;
        }
      }
    }
    .sub-checkbox {
      position: absolute;
      top: 7px;
      left: 0;
      margin-top: -2px;
      margin-right: 10px;
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 1px solid #989898;
      text-align: center;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 10px;
      i {
        display: none;
        position: relative;
        top: -5px;
        left: -1px;
      }
    }
  }
  .input_layer {
    input {
      width: 100%;
      height: 45px;
      font-size: 14px;
      padding: 0 10px;
      border: 1px solid #c4e1eb;
      border-radius: 6px;
      color: #3b5159;
      &:focus {
        border-color: #3db2dd;
        color: #00a9f0;
      }
    }
  }
  .submit-btn {
    cursor: pointer;
    margin-top: 30px;
    display: inline-block;
    width: 100%;
    height: 60px;
    font-size: 24px;
    line-height: 60px;
    background: #06c668;
    border-radius: 5px;
    color: #fff;
    &.disabled {
      background: #ddd;
    }
  }
  .error-msg {
    margin-top: 5px;
    font-size: 12px;
    color: #ff5353;
  }
}
</style>
