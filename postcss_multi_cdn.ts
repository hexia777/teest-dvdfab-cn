/**
 * 用 CDN URL 替换 img_url() 的 PostCSS 插件，可以将 CSS 中提到的图片资源军谈到多个 CDN 节点上，以提升图片加载速度。
 *
 * 用法：
 *
 * ```css
 * .example {
 *   background-image: img_url('example.jpg');
 * }
 * ```
 *
 * 将转变为
 *
 * ```css
 * .example {
 *   background-image: url('https://cdn.example.com/example.jpg?hash=123456789');
 * }
 * ```
 */
import type { PluginCreator, Declaration } from 'postcss'

interface PluginOptions {
  domains?: string[]
  debug?: boolean
  imgDir?: string
}

const plugin: PluginCreator<PluginOptions> = (opts = {}) => {
  const options = {
    domains: ['c1.dvdfab.cn', 'c2.dvdfab.cn', 'c3.dvdfab.cn', 'c4.dvdfab.cn', 'c5.dvdfab.cn', 'c6.dvdfab.cn'],  // TODO: 读取配置 config\base.ts 中的  cdn_domain_subs，另外这个文件不应当放到这个目录
    imgDir: 'images',
    ...opts,
  }

  function crc32(str: string): number {
    const table = new Array(256)
    let c: number
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      table[n] = c
    }

    let crc = 0 ^ -1
    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xff]
    }
    return (crc ^ -1) >>> 0
  }

  return {
    postcssPlugin: 'postcss-cdn-url',
    Declaration(decl: Declaration) {
      if (decl.value.includes('img_url(')) {
        decl.value = decl.value.replace(/img_url\(['"](.+?)['"]\)/g, (match, path) => {
          const hash = crc32(path)
          const domainIndex = hash % options.domains.length
          const domain = options.domains[domainIndex]
          const preSuffix = domain.startsWith('http') ? '' : 'https://'
          const hashParams = path.includes('?') ? hash : '?hash=' + hash
          const imgDir = options.imgDir ? `/${options.imgDir}` : ''
          return `url('${preSuffix}${domain}${imgDir}${path}${hashParams}')`
        })
      }
    },
  }
}

plugin.postcss = true

export default plugin
