import type {
  countDownNewParams,
  CountDownNewResultModel,
  CommonBarParams,
  CommonBarResultModel,
  SubNewsletterParams,
  BackendDataResultModel,
  CountryParams,
  LogoutParams,
} from './interface/common'
import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  countDownNews = '/common/count_down_news',
  mainNavData = '/main-nav-pcs',
  navData = '/sub-nav-pcs',
  navMobileData = '/nav-mobiles',
  footerData = '/footer',
  commonPage = '/page-commons',
  subNewsletter = '/news_letter/subscribe/per',
  countryData = '/common/country',
  // 退出登录
  logout = '/member/logout',
}

export default new (class common extends Http {
  /**
   * @description: 获取首页信息
   */
  public countDownNews(params: countDownNewParams, option?: HttpOption<CountDownNewResultModel>) {
    return this.phpPost<CountDownNewResultModel>(Api.countDownNews, params, option)
  }

  /**
   * 获取 PC 主导航数据
   */
  public mainNavBar(params?: CommonBarParams, option?: HttpOption<CommonBarResultModel>) {
    return this.get<CommonBarResultModel>(
      Api.mainNavData,
      {
        'populate[leftNav][populate]': '*',
        'populate[moreList][populate]': '*',
        'populate[download][populate]': '*',
        'populate[items][populate]': '*',
        ...params,
      },
      {
        ...option,
        _cache: true,
        _cacheKey: `${Api.mainNavData}.${params?.['filters[os][$eq]']}`,
      },
    )
  }

  /**
   * 获取 PC 端导航数据
   */
  public navBar(params?: CommonBarParams, option?: HttpOption<CommonBarResultModel>) {
    return this.get<CommonBarResultModel>(
      Api.navData,
      {
        'populate[free][populate]': '*',
        'populate[faqs][populate]': '*',
        'populate[promotion][populate]': '*',
        'populate[product_rels][populate]': '*',
        'populate[product][populate]':
          'subList,subList.products,subList.products.product_attrs,subList.products.product_attrs.tags,pcBundleList,mobileBundleList,bundleInfo,bundleInfo.media,bottomInfo',
        ...params,
      },
      {
        ...option,
        _cache: true,
        _cacheKey: `${Api.navData}.${params?.['filters[os][$eq]']}${params?.['filters[productLine][$eq]']}`,
      },
    )
  }

  /**
   * 获取 移动端导航数据
   */
  public NavBarMobile(params?: CommonBarParams, option?: HttpOption<CommonBarResultModel>) {
    return this.get<CommonBarResultModel>(
      Api.navMobileData,
      {
        'populate[items][populate]':
          'product,bundleInfo,bundleInfo.media,bundleInfo.product,subList,subList.products,subList.products.product_attrs,subList.products.product_attrs.tags,bottomInfo,bundleInfo.product.imgs,media',

        ...params,
      },
      { ...option, _cache: true },
    )
  }

  /**
   * 获取 footer 数据
   */
  public footerBar(params?: CommonBarParams, option?: HttpOption<CommonBarResultModel>) {
    return this.get<CommonBarResultModel>(
      Api.footerData,
      {
        populate: 'serverList,menuList,menuList.list,linkList',
        ...params,
      },
      {
        ...option,
        _cache: true,
        _cacheKey: `${Api.footerData}`,
      },
    )
  }

  /**
   * 获取 通用页面 数据
   */
  public getCommonPageData(params?: any, option?: HttpOption<CommonBarResultModel>) {
    return this.get<any>(Api.commonPage, params, {
      ...option,
      _cache: true,
      _cacheKey: `${Api.commonPage}.${params?.['[filters][slug][$eq]']}`,
    })
  }

  /**
   * 订阅新闻信
   */
  public subNewsletter(params?: SubNewsletterParams, option?: HttpOption<BackendDataResultModel>) {
    return this.phpPost<BackendDataResultModel>(Api.subNewsletter, params, option)
  }

  /**
   * 获取国家信息
   */
  public getCountry(params?: CountryParams, option?: HttpOption<BackendDataResultModel>) {
    return this.phpPost<BackendDataResultModel>(Api.countryData, params, {
      ...option,
      // _cache: true,
    })
  }

  /**
   * 获取国家信息
   */
  public logout(params?: LogoutParams, option?: HttpOption<BackendDataResultModel>) {
    return this.phpPost<BackendDataResultModel>(Api.logout, params, option)
  }
})()
