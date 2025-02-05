import { routes } from '../config/redirect/languageLimitedRoutes'

export default defineNuxtRouteMiddleware((to) => {
  // 以下代码只在服务端执行
  if (import.meta.client) return

  // enrty_ 开头的动态路由不可访问
  if ((to.name as string)?.startsWith('entry_')) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
  
  // 以下模块仅限某个语种访问
  for (const name in routes) {
    if (name === to.name && !routes[name].includes(useStore.common().locale)) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
  }
})
