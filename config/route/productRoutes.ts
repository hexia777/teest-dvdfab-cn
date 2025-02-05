import dvdfabProductRoutes from './productRoutes/dvdfabProductRoutes.json'
import streamfabProductRoutes from './productRoutes/streamfabProductRoutes.json'
import musicfabProductRoutes from './productRoutes/musicfabProductRoutes.json'
import playerfabProductRoutes from './productRoutes/playerfabProductRoutes.json'
import passkeyProductRoutes from './productRoutes/passkeyProductRoutes.json'
import bookfabProductRoutes from './productRoutes/bookfabProductRoutes.json'
import otherProductRoutes from './productRoutes/otherProductRoutes.json'
import { routes } from './productSpecialRoutes'

export const productRoutesReal: string[] = []
export const freeProductRoutes: string[] = []
const data = [
  dvdfabProductRoutes,
  streamfabProductRoutes,
  musicfabProductRoutes,
  playerfabProductRoutes,
  passkeyProductRoutes,
  bookfabProductRoutes,
  otherProductRoutes,
]

for (const item of data) {
  for (const key in item) {
    const routes: string[] = (item as { [key: string]: string[] })[key]
    for (const route of routes) {
      productRoutesReal.push(route)
      if (key === 'free') {
        freeProductRoutes.push(route)
      }
    }
  }
}
// 部分语种产品页路由和默认产品页路由不一致，需要特殊处理
for (const route in routes) {
  for (const lang in routes[route]) {
    if (!productRoutesReal.includes(routes[route][lang])) {
      productRoutesReal.push(routes[route][lang])
    }
  }
}

export const productRoutes: string[] = [...productRoutesReal]
