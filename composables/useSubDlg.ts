// 公共数据
export const useSubDlgCommon = () => {
  const randomNum = Number(useRoute().query?.randomNum) || Math.random() * 100
  const locales = useI18n().value
  const locale = useStore.common().locale
  const currency = useStore.product().currency[locale]
  const route = useRoute()
  const optMap = {
    '1M': `(${locales.common.num_month.replace('{num}', '1')})`,
    '1Y': `(${locales.common.num_year.replace('{num}', '1')})`,
    '2Y': `(${locales.common.num_year.replace('{num}', '2')})`,
    LFT: `(${locales.common.lifetime})`,
  }

  return {
    optMap,
    randomNum,
    locale,
    locales,
    route,
    currency,
  }
}

// 订阅弹窗数据
export const useSubDlgData = () => {
  const state = reactive<{
    errShow: boolean
    errTextObj: object
    submitFlag: boolean
  }>({
    errShow: false,
    errTextObj: {
      email: '',
      agree: '',
    },
    submitFlag: false,
  })
  const subForm = reactive<any>({
    email: '',
    recaptcha: '',
    agree: true,
  })
  if (useEmail()) {
    subForm.email = useEmail() as string
  }

  return {
    ...toRefs(state),
    subForm,
  }
}
