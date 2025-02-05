import { routes as paymentRoutes } from '~/config/route/paymentRoutes'

export const useWebPush = () => {
  const route = useRoute() as any
  const locale = useStore.common().locale as 'en' | 'de' | 'ja' | 'fr' | 'zh'
  const excludeRoutes = paymentRoutes
  onMounted(() => {
    const { web_push: webPush } = useAppConfig()
    if (!excludeRoutes.includes(route.name) && webPush[locale].enabled) {
      const options = {
        applicationServerPublicKey: webPush[locale].publicKey,
        app_id: webPush[locale].appId,
        delay: '7000',
        sw_path: '/webpush/sw.js',
      }
      // eslint-disable-next-line new-cap,no-new
      new webpush(options)
    }
  })
}
