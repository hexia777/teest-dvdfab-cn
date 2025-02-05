/**
 * 配置动态路由
 */
import { productRoutes } from '../../config/route/productRoutes'
import { routes } from '../../config/route/nonSuffixRoutes'
import config from '../../config/base'
import streamfabProductRoutes from '../../config/route/productRoutes/streamfabProductRoutes.json'
import { SystemArticleRouters, OldArticleRouters } from '../../config/route/systemArticleRouters'

export const pagesExtend = (pages: any) => {
  // 产品页
  productRoutes.forEach((item: string) => {
    pages.push({
      name: item,
      path: `/${item.replace(/-/g, '_')}`,
      file: '~/pages/entry_product.vue',
      meta: {
        middleware: ['get-product-detail'],
      },
    })
  })

  // 文章页
  SystemArticleRouters.forEach((item: string) => {
    pages.push({
      name: item,
      path: `/${item.replace(/-/g, '_')}`,
      file: '~/pages/entry_system_article.vue',
    })
  })

  // TODO：应当和上面的文章页合并
  OldArticleRouters.forEach((item: string) => {
    pages.push({
      name: item,
      path: `/${item.replace(/-/g, '_')}`,
      file: '~/pages/entry_system_article.vue',
    })
  })

  // StreamFab 文章页
  pages.push({
    name: `downloader-id`,
    path: `/downloader/:id`,
    file: '~/pages/entry_drm_article.vue',
    meta: {
      middleware: ['get-resource-drm-topic-detail'],
    },
  })

  // StreamFab 产品页
  const _streamfabProductRoutes: { [key: string]: string[] } = streamfabProductRoutes
  for (const key in _streamfabProductRoutes) {
    for (const route of _streamfabProductRoutes[key]) {
      pages.push({
        name: `${route}-id`,
        path: `/${route.replace(/-/g, '_')}/:id`,
        file: '~/pages/entry_drm_article.vue',
        meta: {
          middleware: ['get-resource-drm-topic-detail'],
        },
      })
    }
  }

  // 处理域名 .htm 后缀
  pages.forEach((item: { path: string; name: string }) => {
    let path = item.path.replace(/_/g, '-')
    if (!routes.includes(item.name)) {
      path = path.concat(config.page_suffix)
    }

    item.path = path
  })
}
