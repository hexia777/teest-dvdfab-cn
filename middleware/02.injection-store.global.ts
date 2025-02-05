export default defineNuxtRouteMiddleware(() => {
  // 以下代码只在服务端执行
  if (import.meta.client) return

  // 设置 ip
  useStore.common().setIp(
      useRequestHeader('x-forwarded-for')
        ? useRequestHeader('x-forwarded-for')?.split(',')[0]
        : useRequestHeader('x-real-ip') || '',
    )

  // TODO:
  if (process.env.LOCATION) {
    useStore.common().setServeLocation(process.env.LOCATION)
  }

  // 设置客户端信息（浏览器、操作系统、设备）
  let userAgent: string = useRequestHeader('user-agent') as string
  useStore.common().setClient(getOperatingSystemInfo(userAgent))
  useStore.common().setMobile(isMobile(userAgent))
  useStore.common().setIsX64(isX64(userAgent))

  // 设置 host
  useStore.common().setHost(useRequestURL().host)

  // 设置 locale
  useStore.common().setLocale(useLocale(useRequestURL().host))
})
