/**
 * @function getBrowser
 * @description 根据 UserAgent 获取浏览器类型
 * @param ua
 * @returns {string}
 */
export const getBrowser = (ua: string): string => {
  if (!ua) {
    return 'chrome'
  }

  const userAgent = ua // 取得浏览器的userAgent字符串
  const isOpera = userAgent.includes('Opera') // 判断是否Opera浏览器
  const isIE = userAgent.includes('compatible') && userAgent.includes('MSIE') && !isOpera // 判断是否IE浏览器
  const isEdge = userAgent.includes('Edge') // 判断是否IE的Edge浏览器
  const isFF = userAgent.includes('Firefox') // 判断是否Firefox浏览器
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome') // 判断是否Safari浏览器
  const isChrome = userAgent.includes('Chrome') && userAgent.includes('Safari') // 判断Chrome浏览器

  if (isOpera) {
    return 'opera'
  }

  if (isEdge) {
    return 'edge'
  }

  if (isIE) {
    return 'ie'
  }

  if (isFF) {
    return 'firefox'
  }

  if (isSafari) {
    return 'safari'
  }

  if (isChrome) {
    return 'chrome'
  }
  return ''
}

/**
 * @function isMobile
 * @description 根据 UserAgent 判断是否为移动端
 * @param ua
 * @returns {boolean}
 */
export const isMobile = (ua: string): boolean => {
  // Referer https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
  let isMobile = false
  if (
    // eslint-disable-next-line max-len
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      ua,
    ) ||
    // eslint-disable-next-line max-len
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
      ua ? ua.substr(0, 4) : '',
    )
  ) {
    isMobile = true
  }

  return isMobile
}

/**
 * @function getOperatingSystemInfo
 * @description 根据 UserAgent 获取操作系统类型
 * @param ua
 * @returns {string}
 */
export const getOperatingSystemInfo = (ua: string): string => {
  if (/Win32|Windows/i.test(ua)) {
    return 'win'
  } else if (/Mac68K|MacPPC|Macintosh|MacIntel|Mac OS X/i.test(ua)) {
    return 'mac'
  } else {
    return 'win'
  }
}

/**
 * @function isX64
 * @description 根据 UserAgent 判断是否为64位系统
 * @param ua
 * @returns {boolean}
 */
export const isX64 = (ua: string): boolean => {
  let result = false
  if (/Win32|Windows/i.test(<string>ua)) {
    if (ua.includes('WOW64') || ua.includes('Win64')) {
      result = true
    }
  }

  return result
}

/**
 * @function isBot
 * @description 根据 UserAgent 判断是否机器爬虫
 * @param ua
 * @returns {boolean}
 */
export const isBot = (ua: string): boolean => {
  let result = false

  if (ua) {
    const bots = [
      'Googlebot',
      'AhrefsBot',
      'AdsBot-Google',
      'bingbot',
      'python-requests',
      'bot',
      'crawler',
      'spider',
      'robot',
      'crawling',
      'Chrome-Lighthouse',
      'Yandex',
      'GuzzleHttp',
    ]
    ua = ua.toLowerCase()
    result = bots.some((v) => {
      const item = v.toLowerCase()
      return ua.includes(item)
    })

    return result
  }

  return result
}
