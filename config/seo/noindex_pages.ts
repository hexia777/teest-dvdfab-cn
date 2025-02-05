import config from '../../config/base'
import musicfabProductRoutes from './../route/productRoutes/musicfabProductRoutes.json'

const locales = config.locales

const _pages: { [key: string]: string[] } = {
  '/clientad-product-recommended.htm': locales,
  '/free-license.htm': locales,
  '/clientad-musicfab.htm': locales,
  '/streamfab-5th.htm': locales,
  '/update-payment-method.htm': locales,
  '/musicfab.htm': locales,
  '/google-auth-for-client.htm': locales,
}
const data = [musicfabProductRoutes]

for (const item of data) {
  for (const key in item) {
    const routes: string[] = (item as { [key: string]: string[] })[key]
    for (const route of routes) {
      const page = '/' + route.replace(/_/g, '-') + '.htm'
      if (!_pages[page]) {
        _pages[page] = locales
      }
    }
  }
}

export const pages: { [key: string]: string[] } = _pages
