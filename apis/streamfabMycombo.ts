import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

interface CalculatePriceModel {
  standard_price: any
  coupon_url: any
  cal: any
  bundle_save: any
  amount: any
  bundle: any
  time_now: any
  p: any
}

enum Api {
  calculatePrice = '/promotion/streamfab/streamfab_price_calculate',
  checkProList = '/streamfab-mycombos',
  proDlg = '/pro-dlg',
}

export default new (class home extends Http {
  /**
   * @description: 获取 combo 计算价格
   */
  public calculatePrice(params?: any, option?: HttpOption<CalculatePriceModel>) {
    return this.phpGet<CalculatePriceModel>(Api.calculatePrice, params, option)
  }

  /**
   * @description: 获取 checkout list
   * @param locale 语种
   */
  public getCheckProList(params?: any, option?: HttpOption<any>) {
    const _params = {
      'populate[aio_product_items][populate]': 'products,products.price,selected_products',
      'populate[product][populate]': 'price,imgs,coupon,amazon,products,product_attrs.tags',
      'populate[tags][populate]': 'products',
      // "[filters][system][$eq]": 'win',
      ...params,
    }
    return this.get<any>(Api.checkProList, _params, option)
  }

  /**
   * @description: 获取 ProDlgData
   * @param locale 语种
   */
  public getProDlgData(params?: any, option?: HttpOption<any>) {
    const _params = {
      ...params,
    }
    return this.get<any>(Api.proDlg, _params, option)
  }
})()
