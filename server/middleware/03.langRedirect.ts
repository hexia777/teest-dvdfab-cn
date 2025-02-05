import { routes } from '~/config/redirect/languageLimitedRoutes'
import { pages } from '~/config/redirect/langRedirectPagesList'

/*
  dvdfab.cn 强制 301 跳转到 www.dvdfab.cn
  dvdfab.cn 及 www.dvdfab.cn 针对浏览器 accept-language 302 跳转到响应的域名
  测试域 配置
  客户端只用到www.dvdfab.cn 域名,其他的根据浏览器语种进行跳转,修改时需要考虑
 */

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const location = getRequestURL(event)
  const host = location.host
  const url: string = req.url || ''
  const uri = location.pathname
  let redirect = true
  // 限制语种的不做跳，多级路由的不做跳转
  const len = (uri.match(/\//g)?.length as number) || 0
  if (routes[uri.replace(/-/g, '_').replace('.htm', '')] || len > 1) {
    redirect = false
  } else {
    for (const page of pages) {
      if (uri.indexOf(page) === 0) {
        redirect = false
        break
      }
    }
  }

  // 匹配数字的正则表达式
  const pattern = /\d+/
  // 使用正则表达式查找第一个数字
  const result = host.match(pattern)
  const num = (result && result[0]) || '1'

  const domain = host?.includes('test')
    ? {
        en: `${useAppConfig().web_domain.en.replace('www.', 'test' + num + '.')}`,
        de: `test${num}.${useAppConfig().web_domain.de}`,
        ja: `test${num}.${useAppConfig().web_domain.ja}`,
        fr: `test${num}.${useAppConfig().web_domain.fr}`,
        zh: `${useAppConfig().web_domain.zh.replace('zh.', 'zh.test' + num + '.')}`,
      }
    : useAppConfig().web_domain

  if (
    redirect &&
    (host === domain.en ||
      host === 'www.' + domain.en ||
      host.replace(/test\d\./, '') === domain.en.replace('www.', ''))
  ) {
    if (getRequestHeader(event, 'accept-language')) {
      let locale = getRequestHeader(event, 'accept-language')?.split(',')[0].toLocaleLowerCase()
      if (uri === '/' && url.includes('_cut_')) {
        // 如果是其他语种跳转到首页,如果cookie设置过期时间为session周期
        setCookie(event, 'change_lang', '1', { path: req.headers.host })
      } else if (getCookie(event, 'change_lang') === undefined && locale && !locale.includes('zh-cn')) {
        // 简体中文不跳，方便同事测试
        if (locale.length > 2) {
          locale = locale.substring(0, 2)
        }
        const tbl: { [key: string]: string } = {
          ja: domain.ja,
          de: domain.de,
          zh: domain.zh,
          fr: domain.fr,
        }
        if (Object.prototype.hasOwnProperty.call(tbl, locale)) {
          const newHost = tbl[locale]
          if (newHost !== host) {
            console.log(
              `middleware lang_redirect redirect(302) ' ${host}${url} to ${location.protocol}//${newHost}${url}`,
            )
            await sendRedirect(event, `${location.protocol}//${newHost}${url}`, 302)
          }
        }
      }
    }
  }
})
