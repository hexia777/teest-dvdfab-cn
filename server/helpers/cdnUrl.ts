/**
 * 打包结果 (css 和 js) 按季度存储
 */
import fs from 'fs'
import config from '../../config/base'

export const cdnUrl = () => {
  if (['prod'].includes(process.env.VITE_PACK_ENV as string)) {
    const ts = fs
      .readFileSync('./publish_ts/quarter.txt', 'utf8')
      .trim()
      .replace(/[\r\n]/g, '')

    return `${config.cdn_domain}/dist/${ts}`
  } else {
    return ''
  }
}
