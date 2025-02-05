import type { PromotionResultModel } from './interface/promotion'

import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  promotion = '/promotions', // '/json/promotion/index.json',
}

export default new (class promotion extends Http {
  /**
   * Get promotion data
   * @param params
   * @param option
   */
  public promotion(params?: any, option?: HttpOption<PromotionResultModel[]>) {
    //   const apiHost =
    //     useRuntimeConfig().public.ENV === 'dev' ? 'http://localhost:3000' : 'https://testapi1.dvdfab.cn'
    return this.get<PromotionResultModel[]>(
      Api.promotion,
      {
        'populate[seo][populate]': '*',
        'populate[blocks][populate]': '*',
        'populate[headBanner][populate]': '*',
        'populate[floatBanner][populate]': '*',
        'populate[articleBanner][populate]': '*',
        'populate[relatedRoute][populate]': '*',
        'populate[disabledRoute][populate]': '*',
        ...params,
      },
      { ...option, _cache: true },
    )
  }
})()
