/**
 * @function joinUrlParams
 * @description 拼接参数到 url 上
 * @param url
 * @param params
 * @returns {string}
 */
export const joinUrlParams = (url: string, params?: { [k: string]: any }): string => {
  if (!params) {
    return url
  }

  const paramsStr = Object.keys(params)
    .map(
      (key) =>
        Object.prototype.hasOwnProperty.call(params, key) &&
        params[key] !== undefined &&
        params[key] !== null &&
        `${key}=${params[key]}`,
    )
    .filter((item) => item)
    .join('&')

  if (!paramsStr) {
    return url
  }

  return url.includes('?') ? `${url}&${paramsStr}` : `${url}?${paramsStr}`
}

/**
 * @function urlParamsToString
 * @description 拼接参数为 QueryString
 * @param params
 * @returns {string}
 */
export const urlParamsToString = (params: { [k: string]: any }): string => {
  const paramsStr = Object.keys(params)
    .map(
      (key) =>
        Object.prototype.hasOwnProperty.call(params, key) &&
        params[key] &&
        params[key] !== undefined &&
        params[key] !== null &&
        `${key}=${params[key]}`,
    )
    .filter((item) => item)
    .join('&')

  if (!paramsStr) {
    return ''
  }

  return paramsStr
}

/**
 * @function getUrlParams
 * @description 获取 url参数
 * @param params
 * @returns {string}
 */
export const getUrlParams = (url: string): string => {
  if (!url) {
    return ''
  }
  url = url.split('?')[1] // 获取url中"?"符后的字串
  const theRequest: any = {}
  if (url) {
    const params = url.split('&')
    for (let i = 0; i < params.length; i++) {
      theRequest[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
    }
  }
  return theRequest
}
