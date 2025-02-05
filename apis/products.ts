import type { UnwrapRef } from 'vue'
import type {
  ProductsResultModel,
  ProductsParams,
  PageProductsParams,
  PageProductsResultModel,
  ProductPriceParams,
  ProductPriceResultModel,
  // 差异化价格
  ProductDiffPriceParams,
  ProductDiffPriceResultModel,
  // 用户标签
  UserTagsParams,
  UserTagsResultModel,
  PageErrorProductList,
  // 订阅
  UserPayInfoParams,
  SubscribeResultModel,
  // 默认支付方式
  getDefPayParams,
  getPayDataParams,
} from './interface/products'
import type { PageErrorProductModel } from './interface/product'
import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  products = '/products',
  pageProducts = '/page-products',
  productPrice = '/price',
  // 产品差异化价格接口
  productDiffPrice = '/price_discount/best/product_list',
  // 用户标签接口
  userTags = '/price_discount/user_tags',

  pageErrorProductList = `/page-error`,
  // 订阅接口
  orderSubscribe = '/order/checkout4.php',
  // 获取默认支付方式
  defaultPay = '/pay_ratio/get_default',
  // 购买弹窗接口
  buyDlgInfo = '/pro-dlg',
  // 获取所有适用支付通道
  payData = '/pay_ratio/index1',
  validateRisk = '/pre',
}

export default new (class products extends Http {
  /**
   * @description: 获取产品信息
   */
  public products(params: ProductsParams, option?: HttpOption<ProductsResultModel[]>) {
    const relatePid = `${params['filters[pid][$in][0]'] || '_'}${params['filters[pid][$in][1]'] || '_'}${
      params['filters[pid][$in][2]'] || '_'
    }${params['filters[pid][$in][3]'] || '_'}`
    return this.get<ProductsResultModel[]>(Api.products, params, {
      ...option,
      _cache: true,
      _cacheKey: `${Api.products}.${params['filters[pid][$eq]'] || '_'}.${relatePid}`,
    })
  }

  /**
   * @description: 产品页block信息
   */
  public pageProducts(params: PageProductsParams, option?: HttpOption<PageProductsResultModel[]>) {
    return this.get<PageProductsResultModel[]>(
      Api.pageProducts,
      {
        'populate[seo][populate]': '*',
        ...params,
      },
      {
        ...option,
        _cacheKey: `${Api.pageProducts}.${params['filters[slug][$eq]']}`,
        _cache: true,
      },
    )
  }

  /**
   * @description: 获取产品价格
   */
  public productPrice(
    params: ComputedRef<UnwrapRef<ProductPriceParams>> | ProductPriceParams,
    option?: HttpOption<ProductPriceResultModel>,
  ) {
    return this.get<ProductPriceResultModel>(Api.productPrice, params, option)
  }

  /**
   * @description: 获取产品差异化价格价格
   */
  public productDiffPrice(
    params: ComputedRef<UnwrapRef<ProductDiffPriceParams>> | ProductDiffPriceParams,
    option?: HttpOption<ProductDiffPriceResultModel>,
  ) {
    return this.post<ProductDiffPriceResultModel>(
      useRuntimeConfig().public.API_OM + Api.productDiffPrice,
      params,
      option,
    )
  }

  /**
   * @description: 获取用户标签
   */
  public userTags(
    params: ComputedRef<UnwrapRef<UserTagsParams>> | UserTagsParams,
    option?: HttpOption<UserTagsResultModel>,
  ) {
    return this.post<UserTagsResultModel>(useRuntimeConfig().public.API_OM + Api.userTags, params, option)
  }

  /**
   * @description: 获取404页面产品列表
   */
  public getPageErrorProductList(params: PageErrorProductList) {
    return this.get<PageErrorProductModel>(
      Api.pageErrorProductList,
      {
        'populate[win][populate]':
          'products,products.imgs,products.price,products.product_attrs,products.product_attrs.media,products.product_attrs.tags,products.coupon',
        'populate[mac][populate]':
          'products,products.imgs,products.price,products.product_attrs,products.product_attrs.media,products.product_attrs.tags,products.coupon',
        'populate[winItems]': '*',
        'populate[macItems]': '*',
        ...params,
      },
      {
        server: true,
        watch: [],
        lazy: false,
        key: 'error_page_product_list',
        _cache: true,
        _cacheKey: `${Api.pageErrorProductList}`,
      },
    )
  }

  /**
   * @description: 提交订阅
   */
  public submitSubscribe(
    urlParams: string,
    params: UserPayInfoParams,
    option?: HttpOption<SubscribeResultModel>,
  ) {
    return this.post<SubscribeResultModel>(
      useRuntimeConfig().public.API_OAPI + Api.orderSubscribe + `?${urlParams}`,
      params,
      option,
    )
  }

  /**
   * @description: 风险校验
   */
  public validateRisk(params: any, option?: any) {
    return this.post<any>(useRuntimeConfig().public.API_RISK + Api.validateRisk, params, option)
  }

  /**
   * @description: 获取默认支付方式(订阅 | 非订阅)
   */
  public getDefPay(params: getDefPayParams, option?: any) {
    return this.phpPost<SubscribeResultModel>(Api.defaultPay, params, option)
  }

  /**
   * @description: 购买弹窗
   */
  public getBuyDlgInfo(params: any, option?: any) {
    const _params = {
      populate: 'tag,normal,dvdfab,streamfab,musicfab,playerfab,passkey,bookfab,media_recover',
      ...params,
    }
    return this.get<any>(Api.buyDlgInfo, _params, { ...option, _cache: true })
  }

  /**
   * @description: 获取所有适用通道(订阅 | 非订阅)
   */
  public getPayData(params: getPayDataParams, option?: any) {
    return this.phpGet<SubscribeResultModel>(Api.payData, params, option)
  }
})()
