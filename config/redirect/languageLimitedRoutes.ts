import config from '../base'
import { routes as germanMagazineRoutes } from '../route/germanMagazine'
import { routes as productSpecialRoutes } from '../route/productSpecialRoutes'
// 德语杂志页面
const _germanMagazineRoutes: { [key: string]: string[] } = {}
for (const item of germanMagazineRoutes) {
  _germanMagazineRoutes[item] = ['de']
}
/*
特殊产品页路由
根据 路由配置,动态限制语种
产品路由关联关系,例如产品A默认路由为a,而英语站路由却为a1
*/
const _productSpecialRoutes: { [key: string]: string[] } = {}
for (const orgRoute in productSpecialRoutes) {
  const _langs: string[] = [] // 和默认路由不一致的语种
  for (const lang in productSpecialRoutes[orgRoute]) {
    _langs.push(lang)
    if (_productSpecialRoutes[productSpecialRoutes[orgRoute][lang]]) {
      _productSpecialRoutes[productSpecialRoutes[orgRoute][lang]].push(lang)
    } else {
      _productSpecialRoutes[productSpecialRoutes[orgRoute][lang]] = [lang]
    }
  }
  const langs = config.locales.filter((language) => !_langs.includes(language))

  _productSpecialRoutes[orgRoute] = langs
}
// 以下路由仅限某个语种访问
export const routes: { [key: string]: string[] } = {
  ..._germanMagazineRoutes,
  ..._productSpecialRoutes,
  'video_download-id': ['ja'],
  'toolkit-id': ['en', 'ja', 'de'],
  shipping_policy: ['en'],
  // youtube_to_mp3_converter: ['ja'], // 其他语种已经301跳转
  giveaway_for_newsletter: ['en', 'ja'],
  giveaway_ads: ['en', 'ja'],
  reseller: ['ja'],
}
