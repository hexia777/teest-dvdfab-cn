import { Base64 } from 'js-base64'

/**
 * @function base64Encode
 * @description 对对象 base64 编码
 * @param data
 * @returns {string}
 */
export const base64Encode = (data: { [k: string]: any } = {}): string => {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    // eslint-disable-next-line no-console
    console.error('base64Encode, wrong arg: ' + data)
    return ''
  }
  return Base64.encode(JSON.stringify(data))
}
/**
 * @function base64Decode
 * @description base64 解码对象
 * @param data
 * @returns {string}
 */
export const base64Decode = (info: string): string => {
  return fixBase64DecodeParam(JSON.stringify(info))
}

/**
 * @function fixBase64DecodeParam
 * @description 修复 base64 解码参数
 * @param encodedString
 * @returns {string}
 */
export const fixBase64DecodeParam = (encodedString: string): string => {
  if (!encodedString) return ''

  try {
    // TODO: 需要写注释
    // 清理并解码 base64 字符串
    const cleanedBase64 = encodedString
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/[^A-Za-z0-9+/]/g, '')

    return Base64.decode(cleanedBase64)
  } catch (error) {
    console.error('Base64 decode error: ', error)
    return ''
  }
}
