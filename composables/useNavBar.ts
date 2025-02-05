import type { UserTagsParams } from '~/apis/interface/products'
import pageType from '~/config/page_type.json'
interface SubNavItem {
  productLine: string
  attributes?: Record<string, any> // 添加 attributes 属性
}
interface SubNavDataItem {
  product?: {
    label: string
    bundleInfo: any[]
    pcBundleList: any[]
    mobileBundleList: any[]
    subList: any[]
    bottomInfo: any
  }
  free?: any
  faqs?: any
  promotion?: any
  product_rels?: object
  logoLink: string
  logo: string
  logo_title: string
}

// footer 数据
export const useFooterBarRequest = () =>
  useApi().apiCommon.footerBar({ locale: useStore.common().locale }, { key: 'footerBar' })

// pc 主导航栏数据
export const useMainNavBarRequest = () =>
  useApi().apiCommon.mainNavBar(
    {
      locale: useStore.common().locale,
      'filters[os][$eq]': useStore.common().mobile ? 'win' : useStore.common().client,
    },
    { key: 'mainNavBar' },
  )
// pc 二级导航栏数据
export const useNavBarRequest = async () => {
  setPageType()
  if (!useStore.common().pageProLine) {
    return
  }
  await useApi().apiCommon.navBar(
    {
      locale: useStore.common().locale,
      'filters[os][$eq]': useStore.common().client,
      'filters[productLine][$eq]': useStore.common().pageProLine,
    },
    { key: 'subNavBar' },
  )
}
const setPageType = () => {
  const { data: res } = useNuxtData('page-data')
  const proLine = res.value?.product_line
  useStore.common().setPageProLine(proLine)

  // 特定页面配置所属产线
  const pageTypes = pageType.prolineMaps as { [key: string]: string[] | object }
  for (const key in pageTypes) {
    if (Array.isArray(pageTypes[key])) {
      for (const item of pageTypes[key]) {
        if (useRoute().path === item || useRoute().path.includes(item)) {
          useStore.common().setPageProLine(key)
        }
      }
    }
  }

  // 不属于8个产线进行产线转换 ['streamfab', 'dvdfab', 'unifab', 'musicfab', 'playerfab', 'passkey', 'recordfab', 'bookfab']
  const proLineArr = Object.keys(pageType.prolineMaps)
  const proLineMaps = pageType.typeMaps as { [key: string]: string }
  if (proLine && !proLineArr.includes(proLine)) {
    if (proLineMaps[proLine]) {
      useStore.common().setPageProLine(proLineMaps[proLine])
    } else {
      // 不再配置文件中的且不属于8大产线的置空
      useStore.common().setPageProLine('')
    }
  }
}
// 移动端导航栏数据
export const useNavBarMobileRequest = () =>
  useApi().apiCommon.NavBarMobile({ locale: useStore.common().locale }, { key: 'NavBarMobile' })

export const useNavBar = () => {
  const locales = useI18n().value
  const locale = useStore.common().locale
  let mainNavData: object = {}
  const subNavData = ref<SubNavDataItem>({} as SubNavDataItem)
  const logoutClick = ref(true)
  const subNavShow = ref(!!useStore.common().pageProLine)

  // 获取主导航数据
  const getMainNavData = () => {
    const { data: mainNavBarRes } = useNuxtData('mainNavBar')
    if (mainNavBarRes?.value?.data?.length) {
      const mainBarData = getStrapiData(mainNavBarRes?.value?.data)
      mainNavData = getStrapiData(mainBarData[0])
      if ((mainNavData as any).leftNav) {
        ;(mainNavData as any).leftNav.forEach((item: any) => {
          item.mobileShowDetail = 0
        })
      }
    }
  }
  // 获取二级导航数据
  const getSubNavData = () => {
    const { data: subNavBarRes } = useNuxtData('subNavBar')
    if (subNavBarRes?.value?.data?.length > 0) {
      const subNavDataList = getStrapiData(subNavBarRes?.value?.data) as SubNavItem[]
      const attributes = subNavDataList[0].attributes || {}

      // 确保 attributes 符合 SubNavDataItem 的类型定义
      const defaultSubNavData: SubNavDataItem = {
        logoLink: '',
        logo: '',
        logo_title: '',
        product: undefined,
        free: undefined,
        faqs: undefined,
        promotion: undefined,
        product_rels: {},
      }

      subNavData.value = { ...defaultSubNavData, ...attributes }
      if (subNavData.value.product) {
        ;(subNavData.value.product as { mobileShowDetail?: number }).mobileShowDetail = 1
      }
      if (subNavData.value.free) {
        ;(subNavData.value.free as { mobileShowDetail?: number }).mobileShowDetail = 0
      }
    } else {
      subNavShow.value = false
    }
  }

  getMainNavData()
  if (subNavShow.value) {
    getSubNavData()
  }

  const navBarPcDom = ref<HTMLElement>()
  const navBarMobileDom = ref<HTMLElement>()
  const promotionHeaderDom = ref<HTMLElement>()

  const state = reactive<{
    mainNavData: object
    subNavData: object
    isFixed: boolean
    // 登录相关
    userVisible: boolean
    subNavShow: Ref<boolean>
  }>({
    mainNavData,
    subNavData,
    isFixed: false,
    userVisible: false,
    subNavShow,
  })

  const elkEventLabel = {
    store: 'store',
    dvdfab: 'dvdbd',
    passkey: 'passkey',
    recover: 'recover',
    multimedia: 'multimedia',
    download: 'download',
    ai: 'ai',
    streamfab: 'streaming',
    more: 'more',
    menu: 'menu',
    free: 'free',
    playerfab: 'playerfab',
    unifab: 'unifab',
    musicfab: 'musicfab',
  }

  /**
   * 菜单列表相关  start
   * */
  // 处理标签
  const handProTag = (item: { [k: string]: any }) => {
    if ((!item || isEmpty(item?.product_attrs?.data?.length)) && !item.mobileTag) {
      return {
        name: '',
        tag: '',
      }
    }

    // 移动端产品线 tag 标签
    if (item.mobileTag) {
      return item.mobileTag
    }

    // 产品标签
    const tagObj = getStrapiData(item?.product_attrs?.data[0]) || {}
    if (['hot'].includes(tagObj.slug) || ['new'].includes(tagObj.slug) || ['free'].includes(tagObj.slug)) {
      return {
        name: tagObj.name || '',
        tag: tagObj.slug || '',
      }
    }
    if (/off/.test(tagObj.slug)) {
      return {
        name: tagObj.name || '',
        tag: 'off',
      }
    }

    return {
      name: '',
      tag: '',
    }
  }

  // 处理产品链接
  const handProLink = (item: any) => {
    if (!item) {
      return ''
    }
    const anchor = item?.anchor ? `#${item?.anchor}` : ''
    const suffix = anchor
    let link = ''

    if (item.link) {
      link = item.link
    } else if (item.slug) {
      link = item.slug + '.htm'
    }

    // 如果 link 不以 "/" 开头，添加一个
    if (link && !link.startsWith('/')) {
      link = '/' + link
    }

    const result = link ? link + suffix : ''

    return result
  }

  /**
   * 菜单相关  end
   * */

  /**
   * 登录相关  start
   * */
  // 退出登录
  const logout = (token: string) => {
    if (!logoutClick.value) {
      return
    }
    logoutClick.value = false
    const { $trace } = useNuxtApp() as any

    const laravel_session = {
      laravel_session: token || '',
    }
    useApi()
      .apiCommon.logout(laravel_session)
      .then((res) => {
        if (res?.data?.value?.cscode === 0) {
          useMember().clearLoginCookie()

          setTimeout(() => {
            window.location.href = '/member.htm?a=login'
          }, 100)
        } else {
          logoutClick.value = true
          const errStr = `token: ${token}。res.data.value: ${JSON.stringify(
            res?.data?.value,
          )}。res.status: ${JSON.stringify(res.status)}`
          $trace.traceCustomEvent(errStr)

          alert('failed:' + res?.data?.value?.cscode)
        }
      })
      .catch((e) => {
        const errStr = e.stack ? String(e.stack) : String(e)
        // eslint-disable-next-line no-console
        console.error(e)
        $trace.traceCustomEvent(`token: ${token}。errStr: ${errStr}`)
      })
  }
  /**
   * 登录相关  end
   * */

  // dom 操作
  // 监听滚动
  const scrollHandler = () => {
    const headerHeight = promotionHeaderDom.value?.clientHeight || 0
    if (navBarPcDom.value) {
      navBarPcDom.value.style.top =
        window.scrollY >= headerHeight ? -headerHeight + 'px' : -window.scrollY + 'px'
    }
    if (navBarMobileDom.value) {
      navBarMobileDom.value.style.top =
        window.scrollY >= headerHeight ? -headerHeight + 'px' : -window.scrollY + 'px'
    }
    state.isFixed = window.scrollY >= headerHeight
  }

  return {
    ...toRefs(state),
    elkEventLabel,
    locales,
    locale,
    navBarPcDom,
    navBarMobileDom,
    promotionHeaderDom,
    logout,
    handProTag,
    handProLink,
    scrollHandler,
  }
}

// 获取用户标签
export const getUserTags = () => {
  const { ENV } = useRuntimeConfig().public
  const tidKey = ENV === 'prod' ? '_EA_TID' : '_T_EA_TID'
  const userTagsData = (email?: string) => {
    const params: UserTagsParams = {
      cache_clear: false,
      debug_user_tags: true,
      user_info: {
        email: email || (useEmail() as string),
        machine_id: '',
        token_id: useCookie(tidKey).value || '',
      },
    }

    // console.log('user_info', params.user_info)

    return useApi().apiProducts.userTags(params)
  }

  return {
    userTagsData,
  }
}

// 移动端处理
export const useNavBarMobile = () => {
  let leftData: any = []
  const { data: navMobileBarRes } = useNuxtData('NavBarMobile')
  if (navMobileBarRes?.value?.data?.length) {
    const navMobileBarData = getStrapiData(navMobileBarRes?.value?.data)
    leftData = navMobileBarData || []
  }

  const state = reactive<{
    leftData: any
  }>({
    leftData,
  })

  const showHide = (id: string, item: object, index: string, type?: string) => {
    const obj = item as any
    setTimeout(function () {
      const pdom = document.getElementById(id + index)
      if (!pdom) {
        return
      }

      if (!obj.mobileShowDetail) {
        pdom.style.height = pdom.scrollHeight + 'px'
        obj.mobileShowDetail = pdom.scrollHeight
      } else {
        pdom.style.height = '0'
        obj.mobileShowDetail = 0
      }
      if (type === 'sub') {
        // 二级头部点击,清除一级菜单设置的高度
        const parent = pdom?.parentNode?.parentNode?.parentNode

        if (parent && parent instanceof HTMLElement) {
          parent.style.height = 'auto'
        }
      }
    }, 1)
  }

  return {
    ...toRefs(state),
    showHide,
  }
}
