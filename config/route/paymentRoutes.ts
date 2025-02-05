// 支付相关页面路由
// 支付结果页面路由
export const resultRoutes: string[] = ['payment', 'complete_subscription']

export const routes: string[] = [
  'checkout',
  'card_info',
  'card_info_pay',
  'card_info_onerway',
  ...resultRoutes,
]
