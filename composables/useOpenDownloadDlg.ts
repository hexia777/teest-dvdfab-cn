import { pages as downloadPages } from '~/config/route/downloadRoutes'
import { changeAppId } from '~/config/downloadInfo'
import install from '~/config/elk/install.json'

/** 下载 打开新窗口 ************** start */
const getUrlInfo = (p: string) => {
  const info = {
    app_id: '',
    pid: '',
    os: 'win',
    url: '',
  }
  const key = p?.toLowerCase() || ''
  const _install: {
    [key: string]: {
      app_id: string
      pid: string | number
    }
  } = install
  let app_id = _install[key] && _install[key].app_id
  if (!app_id) {
    if (key.includes('streamfab')) {
      app_id = 'streamfab'
    } else if (key.includes('music')) {
      app_id = 'musicfab'
    }
  }
  if (app_id) {
    info.app_id = changeAppId[app_id] || app_id // 转换app_id
    if (key.includes('mac')) {
      info.os = 'mac'
    }
    if (downloadPages[info.app_id] && downloadPages[info.app_id][info.os]) {
      info.url = downloadPages[info.app_id][info.os]
      return info
    }
  }
  return null
}

const handleMacDialog = (event: any, productLine: string) => {
  event.preventDefault()
  useMacDownloadModal().value = true
  if (productLine) {
    useMacDownloadProductLine().value = productLine
  }
}

/**
 * @function getUrlKey
 * @description 获取url参数
 * @param name
 * @param url
 * @returns {string}
 */
function getUrlKey(name: string, url: string) {
  if (typeof name !== 'string' && !url) {
    return false
  }

  url = decodeURIComponent(url)

  // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }

  return results[2].replace(/\+/g, ' ')
}

// TODO
export const useOpenDownloadPage = (event: any) => {
  const href = event.currentTarget.href
  const gParams = getUrlKey('g', href)
  // 如果是安卓页面不打开弹窗
  if (href.includes('StreamFab_for_Android')) {
    return
  }
  const info = getUrlInfo(gParams || '')
  if (useStore.common().mobile) {
    event.preventDefault()
    window.open(`/mobile-download-button.htm?g=${gParams}`, '_self')
    return
  }
  // mac下载弹出 intel 和 apple 下载链接选择,例如 dvdFab 下载包
  const btnFrom = event.currentTarget.getAttribute('data-btn-from')
  if (btnFrom !== 'mac-download-dlg' && info?.os === 'mac' && info?.app_id === 'dvdfab') {
    let app_id = info?.app_id
    if (href.includes('12')) {
      app_id = 'dvdfab12'
    }
    handleMacDialog(event, app_id)
  } else if (info?.url) {
    // window.open(`${info.url}?g=${gParams}&dl=${Base64.encode(href)}`, '_blank')
    window.open(`${info.url}?g=${gParams}&open=true`, '_blank')
  }
}
