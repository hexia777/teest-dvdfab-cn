export const useImgPath = () =>
  useState('imgPath', () =>
    useRuntimeConfig().public.ENV === 'prod'
      ? `${useAppConfig().cdn_domain}/images`
      : `${useAppConfig().cnd_test_domain}/images`,
  )

// 关闭headerBanner

// os系统切换
export const useOs = () => useState('os', () => useStore.common().client)
export const usePageType = () => useState('pageType', () => useStore.common().pageType)

// 是否显示系统切换
export const useShowOsSwitch = () => useState('showOsSwitch', () => false)

// mac下载按钮唤起弹窗
export const useMacDownloadModal = () => useState('macDownloadModal', () => false)

// mac下载按钮唤起弹窗的产品线
export const useMacDownloadProductLine = () => useState('macDownloadProductLine', () => 'dvdfab')

// 是否有mac产品
export const useHasMacPro = () => useState('hasMacPro', () => false)
// product info
export const useProInfo = () =>
  useState('proInfo', () => {
    return {} as any
  })
export const useMacProInfo = () =>
  useState('macProInfo', () => {
    return {} as any
  })

// product info
export const useProDiffPrice = () =>
  useState('proDiffPrice', () => {
    return {} as any
  })

// product info
export const useProLine = () => useState('proLine', () => 'dvdfab')

// 用来处理按钮首次加上上报 show 事件
export const useReloadBtnData = () =>
  useState('reloadBtnData', () => {
    return {
      reloadOs: {
        win: false,
        mac: false,
      } as any, // 已经重新 reload 过的系统
      value: true,
    } as any
  })

// 用来处理弹窗的数据
export const useDlgData = () =>
  useState('dlgData', () => {
    return {} as any
  })
