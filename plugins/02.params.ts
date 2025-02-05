/**
 * 客户端回访的链接会携带 email、client_e、client_m 等参数，需要处理
 */
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * 链接带的 email(email 和 client_e 参数) 和本地 cookie 中的 email 不一致则清除
 * 注意：如果遇到未清除情况, 检查下 useCookie('email') 是否已经被覆盖了
 * **/
const removeLoginInfoIfNeed = () => {
  const query = useRoute().query
  const email = useCookie('email').value
  if (query.email) {
    if (email && email !== query.email) {
      useMember().clearLoginCookie()
    }
  }

  if (query.client_e) {
    const client_e = fixBase64DecodeParam(query.client_e as string)
    if (email && email !== client_e) {
      useMember().clearLoginCookie()
    }
  }
}

export default defineNuxtPlugin(() => {
  const route = useRoute() as RouteLocationNormalizedLoaded
  const query = route.query

  // query?.client_e 和 query?.email 的处理代码完全一致，query?.client_e的优先级高
  if (query?.client_e) {
    const client_e = fixBase64DecodeParam(query?.client_e as string)
    if (client_e) {
      removeLoginInfoIfNeed()

      // 总是记录最新的 email
      clientSetCookie('email', client_e, 365)
    }
  } else if (query?.email) {
    removeLoginInfoIfNeed()

    // 总是记录最新的 email
    clientSetCookie('email', query.email as string, 365)
  }

  if (query?.client_m) {
    const client_m = fixBase64DecodeParam(query?.client_m as string)
    if (client_m) {
      // 总是记录最新的 mac
      clientSetCookie('elk_mac', client_m, 365)
    }
  }
})
