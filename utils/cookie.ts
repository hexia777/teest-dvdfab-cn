/**
 * @function cookie 过期时间
 * @param {Number} expireDays
 * @returns {String}
 */
export const cookieExpireTime = (expireDays: number): string => {
  const date = new Date() as any
  date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000)
  return date.toGMTString()
}

/**
 * @function 获取是否测试环境
 * @return {Boolean}
 */
const isTestEnv = (): boolean => {
  let isTest: boolean = false
  if (import.meta.client) {
    isTest = window.location.host.includes('test') || window.location.host.includes('localhost')
  } else {
    isTest = process.env.VITE_PACK_ENV ? !process.env.VITE_PACK_ENV.includes('prod') : true
  }
  return isTest
}

/**
 * @function newCookie
 * @description 生成 cookie
 * @param {String}name
 * @param {String | number}value
 * @param {String | number}expireDays
 * @returns {String}
 */
export const newCookie = (name: string, value: string, expireDays: number, domain: string): string => {
  const expires = cookieExpireTime(expireDays)
  const _domain = isTestEnv() ? '' : (getCookieDomain(domain) as string) // 测试环境不设置 domain
  return `${name}=${value}; expires=${expires}; domain=${_domain}; path=/`
}

/**
 * @function 客户端设置 cookie
 * @description 非生产环境设置到当前域名，生产环境设置到主域
 * @param {String}name
 * @param {String | number}value
 * @param {String | number}expireDays
 */
export const clientSetCookie = (name: string, value: string, expireDays = 1): void => {
  if (!import.meta.browser) {
    // eslint-disable-next-line no-console
    console.error('clientSetCookie, wrong use')
    return
  }

  window.document.cookie = newCookie(name, value, expireDays, window.location.host)
}

/**
 * @function getCookie
 * @description 获取顶级域名
 * @param host
 * @returns {string}
 */
export const getCookieDomain = (host: string): string => {
  if (!host) {
    return ''
  }

  const ip =
    // eslint-disable-next-line max-len
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (ip.test(host) || host.includes('localhost')) {
    return host.replace(/:.+/, '')
  }
  const regex = /([^]*).*/
  const match = host.match(regex)
  if (typeof match !== 'undefined' && match !== null) {
    host = match[1]
  }
  if (typeof host !== 'undefined' && host !== null) {
    const strAry = host.split('.')
    if (strAry.length > 1) {
      host = strAry[strAry.length - 2] + '.' + strAry[strAry.length - 1]
    }
  }
  return '.' + host
}
