export const useNavBarBtnList = () => {
  const { subNavData } = useNavBar()
  const commonJson = useI18n().value.common
  const routeName = useRoute().name
  const reloadBtnData = reactive({
    reloadOs: {
      win: false,
      mac: false,
    } as any, // 已经重新 reload 过的系统
    value: true, // 已经重新 reload 过的系统
  })

  const {
    getDefaultPriceInfo,
    userTypeMapKey,
    getBuyUrl,
    getUpgradeExtParams,
    getElkParams,
    getUpgradePriceInfo,
  } = useProductDiffPrice()

  // 当前产线数据
  const { data: res } = useNuxtData('page-data')
  let proInfo = null
  let macProInfo = null
  // 产品页返回了产品数据
  if (res.value && res.value.data && Array.isArray(res.value.data)) {
    const winTarget = res.value.data.find(
      (item: any) =>
        item.attributes.system === 'win' ||
        item.attributes.system === 'both' ||
        item.attributes.system === 'android',
    )
    const macTarget = res.value.data.find((item: any) => item.attributes.system === 'mac')
    if (winTarget) {
      proInfo = getStrapiData(winTarget).product?.data?.attributes
    }

    if (macTarget) {
      macProInfo = getStrapiData(macTarget).product?.data?.attributes
    }
  }

  // 获取不到当前产品信息时：取导航接口数据返回的aio 产品信息
  if (!proInfo && subNavData.value) {
    proInfo = subNavData.value?.product_rels?.data[0].attributes
  }

  // 导航按钮数据
  const BtnList = ref([
    {
      component: 'MyButtonDownload',
      info: {
        size: 'normal',
        showIcon: false,
        label: commonJson.free_download,
        theme: 'primary',
        slug: 'dvdfab',
      },
    },
    {
      component: 'MyButtonBuy',
      info: {
        size: 'normal',
        showIcon: false,
        label: commonJson.buy_now,
        theme: 'primary',
      },
    },
  ])

  // 当前产品信息
  const curProInfo: any = reactive({})
  const renderData = (os: string, diffPriceInfo: any, isClient = true) => {
    let _proInfo: any = os === 'win' ? proInfo : macProInfo || proInfo
    // todo 优化兼容只有mac的情况
    if (routeName === 'mac_blu_ray_player') {
      _proInfo = macProInfo || useProInfo().value
    }
    if (!Object.keys(_proInfo).length) {
      _proInfo = proInfo
    }

    // 获取价格信息
    let priceInfo = getUpgradePriceInfo(_proInfo, diffPriceInfo) || {
      options: {
        has_lft_options_num: 0,
        has_nlt_options_num: 0,
        has_online_lft_options_num: 0,
        has_online_nlt_options_num: 0,
        has_online_options_num: 0,
        has_options_num: 0,
        total_options_num: _proInfo?.products?.data.length,
        lft_not_owned: {},
        lft_owned: {},
        not_owned: [],
        owned: [],
      },
      user_tag_type: 'new',
      price: getDefaultPriceInfo(_proInfo),
    }
    // playerfab 暂时未对接升级
    if (routeName === 'playerfab') {
      priceInfo = {
        options: {
          has_lft_options_num: 0,
          has_nlt_options_num: 0,
          has_online_lft_options_num: 0,
          has_online_nlt_options_num: 0,
          has_online_options_num: 0,
          has_options_num: 0,
          total_options_num: _proInfo?.products?.data.length,
          lft_not_owned: {},
          lft_owned: {},
          not_owned: [],
          owned: [],
        },
        user_tag_type: 'new',
        price: getDefaultPriceInfo(_proInfo),
      }
    }

    // 产品数据更新
    if (proInfo && !proInfo.price?.length && _proInfo.redirect_products?.data) {
      const _redireactProInfo = getStrapiData(proInfo.redirect_products?.data[0])
      if (_redireactProInfo) {
        _proInfo =
          os === _redireactProInfo.system
            ? _redireactProInfo
            : getStrapiData(_redireactProInfo.related_products?.data[0]) || _redireactProInfo
      }
    }
    Object.assign(curProInfo, _proInfo)

    // 1,文章页不放购买按钮; 2,免费产品不显示购买按钮,3, faq页不放购买按钮
    const { data } = useNuxtData('page-data')
    let urlType = ''
    if (data && data.value) {
      urlType = data.value.promotion_url_type
    }
    if (urlType === 'article' || curProInfo.type === 'free' || !curProInfo.pid || urlType === 'faq') {
      BtnList.value.splice(1, 1)
    }

    // 按钮数据更新
    BtnList.value = BtnList.value.flatMap((btn: any) => {
      btn.pid = curProInfo.pid
      if (btn.component === 'MyButtonDownload') {
        btn.info.href = curProInfo.downloadUrl?.[0]?.url
        btn.info['data-vars-dpid'] = curProInfo.pid
        btn.info['data-warden-ck-parm'] = base64Encode({
          event_category: 'nav',
          event_label: 'download',
          event_value: 'download',
          event_target: {
            position: useStore.common().pageProLine + '_nav_header',
          },
        })
        if ([795].includes(+curProInfo.pid)) {
          return []
        }
      } else if (btn.component === 'MyButtonBuy') {
        if (!curProInfo.price?.length) {
          return []
        }
        const elkParams = {
          event: 'click',
          event_category: 'nav',
          event_label: 'buy_now',
          event_value: 'buy_now',
          event_target: {
            position: useStore.common().pageProLine + '_nav_header',
          },
        }
        btn.click = elkParams

        // 规则 返回的price数组中 只有lft时 不展示弹窗
        if (
          (curProInfo.type === 'single' || [62001, 62004, 749].includes(+curProInfo.pid)) &&
          curProInfo.system !== 'android' &&
          ![845].includes(+curProInfo.pid)
        ) {
          btn.info.href = 'javascript:;'
          btn.info.pname = curProInfo.name
        } else {
          btn.info.href = getBuyUrl(curProInfo, {}, priceInfo.price, {}, 'LFT')
          if (curProInfo.system === 'android' || [845].includes(+curProInfo.pid)) {
            btn.click = getElkParams(
              'buy_now',
              { ...curProInfo, payment_price: priceInfo?.price?.payment_price },
              elkParams,
            )
          }

          let type = ''
          if (routeName === 'all_in_one' || routeName === 'downloader') {
            if (routeName === 'all_in_one') {
              type = 'dvdfab'
            } else if (routeName === 'downloader') {
              type = 'streamfab'
            }
            const userType = userTypeMapKey[type][priceInfo.user_tag_type]
            const extParams = getUpgradeExtParams(priceInfo, curProInfo, type, 'buy_now')
            btn.info.href = getBuyUrl(curProInfo, {}, priceInfo.price, extParams, 'LFT', userType)
            btn.info.label = userType !== 'new' ? commonJson.upgrade_now : commonJson.buy_now
            btn.click = { ...elkParams, ...extParams, event: 'buy_now' }
          }
        }
      }
      return btn
    })

    // 矫正购买按钮 show 上报
    if (isClient && !reloadBtnData.reloadOs[os]) {
      reloadBtnData.reloadOs[os] = true
      reloadBtnData.value = false
      nextTick(() => {
        reloadBtnData.value = true
      })
    }
  }
  const loadClientRoute = ['downloader', 'all_in_one', 'streamfab_for_android']
  const loadClient = loadClientRoute.includes(routeName as string)
  renderData(useOs().value, useProDiffPrice().value, !loadClient)
  watch(
    () => useOs().value,
    (val) => {
      renderData(val, useProDiffPrice().value)
    },
  )
  watch(
    () => useProDiffPrice().value,
    (newVal) => {
      renderData(useOs().value, newVal)
    },
    {
      deep: true,
    },
  )

  return {
    reloadBtnData,
    BtnList,
  }
}
