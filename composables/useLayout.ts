import { setCookieFromReferUrl } from '@utils/skyward-elk-common'
import { routes as paymentRoutes, resultRoutes as paymentResultRoutes } from '~/config/route/paymentRoutes'

// 针对文章或多语言下面的下载链接绑定事件
const addDownloadEvent = () => {
  const aList = document.querySelectorAll('a[href*="download.php"]')
  for (let i = 0; i < aList.length; i++) {
    const btnType = aList[i].getAttribute('data-my-btn-type')
    // 组件内的下载按钮不绑定事件
    if (btnType !== 'download') {
      aList[i].removeEventListener('click', useOpenDownloadPage)
      aList[i].addEventListener('click', useOpenDownloadPage)
    }
  }
}

// 添加UET代码
const addAds = () => {
  const route = useRoute()
  if (!(route && route.name) || useStore.common().mobile) {
    return
  }
  const script = document.createElement('script')
  script.type = 'text/javascript'
  /* eslint-disable max-len */
  const code = `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"134618004"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`
  script.appendChild(document.createTextNode(code))
  document.body.append(script)
  let code_1 = 'window.uetq = window.uetq || [];'
  const name = route.name as string
  // 添加追踪广告
  if (paymentRoutes.includes(name)) {
    if (paymentResultRoutes.includes(name)) {
      code_1 +=
        "window.uetq.push('event', 'purchase', {'gv': '0', 'ecomm_prodid': '0', 'ecomm_pagetype': 'purchase'});"
    } else {
      code_1 +=
        "window.uetq.push('event', 'add_to_cart', { 'ecomm_prodid': '" +
        (route.query.pid ? route.query.pid : '20020') +
        "', 'ecomm_pagetype': 'cart'});"
    }
  } else if (useStore.common().pageType && useStore.product().currentPid) {
    code_1 +=
      "window.uetq.push('event', 'view_item', { 'ecomm_prodid': '" +
      useStore.product().currentPid +
      "', 'ecomm_pagetype': 'product'});"
  } else {
    code_1 += "window.uetq.push('event', 'view_search_results', { 'ecomm_pagetype': 'searchresults'});"
  }
  const script_1 = document.createElement('script')
  script_1.type = 'text/javascript'
  script_1.appendChild(document.createTextNode(code_1))
  document.body.append(script_1)
}

// 自动登录
const autoLogin = () => {
  const query = useRoute().query
  const email =
    (query.email as string) || (query.client_e ? fixBase64DecodeParam(query.client_e as string) : '') || ''
  // 如果cookie中有登录信息, 则不调用接口
  if (
    ((!email && useCookie('email').value) || (email && useCookie('email').value === email)) &&
    useCookie('laravel_session').value &&
    useCookie('user_info_new').value
  ) {
    try {
      const user = useCookie('user_info_new')?.value || '{}'
      const user_info = typeof user === 'object' ? user : JSON.parse(user)
      useStore.common().setUserInfo({
        ...user_info,
        username:
          decodeURIComponent(encodeURIComponent(user_info.username)).trim() ||
          decodeURIComponent(user_info.username).trim(),
        token: useCookie('laravel_session').value,
        isInit: false,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('autoLogin error: ', error)
    }
  } else if (query.token) {
    const params = {
      token: query.token as string,
      email,
      lang: useStore.common().locale,
      laravel_session: 'wKJIUvhyYzq16VYxaTfs',
    }
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.API_PHP
    useApi()
      .apiAuth.autoLogin(apiUrl, params)
      .then((res) => {
        const { data: response } = res
        // 如果登录成功
        if (response?.value?.data?.status) {
          const res = response.value.data
          useMember().setLoginCookie(res)
        }
      })
  } else {
    useStore.common().setUserInfo({
      isInit: false,
      vip: 0,
      username: '',
      email: '',
      uid: '',
      token: '',
    })
  }
}

const handleBuyDialogOpenBuyNowEvent = (callback: any) => {
  const getBuyBtnDom = (dom: any) => {
    if (dom.dataset?.buyDlg && dom.dataset?.buyDlg === 'show') {
      return dom
    }
    return getBuyBtnDom(dom.parentNode)
  }

  const buyEvent = (e: any) => {
    const buyDom = getBuyBtnDom(e.target)
    if (!buyDom) {
      return
    }
    const pid = buyDom.getAttribute('data-pid')
    const pname = buyDom.getAttribute('data-pname') || ''
    const hasmac = buyDom.getAttribute('data-hasmac') || ''
    callback(pid, pname, hasmac)
  }
  const buyDomList = document.querySelectorAll('*[data-buy-dlg="show"]')
  for (let i = 0; i < buyDomList.length; i++) {
    const buyDom: any = buyDomList[i]
    buyDom.removeEventListener('click', buyEvent)
    buyDom.addEventListener('click', buyEvent)
  }
}

export const useLayout = () => {
  const { need } = usePromotionData()
  const { isHeaderBannerShow, isFloatBannerShow, setCookieSuffix } = usePromotion()
  setCookieSuffix()
  const { isShowBuyDialog } = useProductPage()
  const state = reactive<{ hideNavRouteName: boolean; buyDialog: any }>({
    hideNavRouteName: ['checkout'].includes(useRoute().name as string),
    buyDialog: {
      show: false,
      pid: '',
      pname: '',
      hasMac: '',
    } as any,
  })
  usePageHead()
  useWebPush()
  useReport()

  // pc 主导航栏 [pc/移动共用]
  !state.hideNavRouteName && useMainNavBarRequest()

  // pc 导航栏 [pc/移动共用]
  if (!state.hideNavRouteName) {
    useNavBarRequest()
  }

  // footer
  !state.hideNavRouteName && useFooterBarRequest()

  /**
   * Checks if the current page has proper heading tags (h1, h2) and reports to ELK if missing
   *
   * Reports the following error events:
   * - 'no_h1_tag' if page is missing h1 tag
   * - 'no_h1_tag_no_h2_tag' if page is missing both h1 and h2 tags
   * - 'no_h2_tag' if homepage is missing h2 tag
   */
  const checkPageHasHTitle = () => {
    const { $trace } = useNuxtApp() as any
    const routeName = useRoute().name
    // 没有h1标签的页面上报elk
    if (!document.querySelector('h1')) {
      let event_value = 'no_h1_tag'
      if (!document.querySelector('h2')) {
        event_value = 'no_h1_tag_no_h2_tag'
      }
      $trace.traceCustomEvent({
        event: 'error',
        event_value,
        fail_info: {
          detail: routeName,
        },
      })
    }
    // 首页没有h2标签上报elk
    if (!document.querySelector('h2') && routeName === 'index') {
      $trace.traceCustomEvent({
        event: 'error',
        event_value: 'no_h2_tag',
        fail_info: {
          detail: routeName,
        },
      })
    }
  }

  onMounted(() => {
    nextTick(() => {
      addDownloadEvent() // 添加下载事件打开页面
      autoLogin() // 自动登录
      // urlParamsConcat() // trackid 拼接
      addAds() // 添加广告追踪信息
      handleBuyDialogOpenBuyNowEvent((pid: string | number, pname: string, hasMac: string) => {
        state.buyDialog.show = true
        state.buyDialog.pid = pid
        state.buyDialog.pname = pname
        state.buyDialog.hasMac = hasMac
      })
      // 添加skyward相关cookies
      setCookieFromReferUrl('_ET_AF')
      // 检测 h1 h2 标签
      setTimeout(() => {
        checkPageHasHTitle()
      }, 1000)
    })
  })
  return {
    ...toRefs(state),
    isShowBuyDialog,
    isBannerShow: need,
    isHeaderBannerShow,
    isFloatBannerShow,
  }
}
