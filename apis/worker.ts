import {
  type RequestConfig,
  type RequestMethod,
  type UrlType,
  type UrlCacheOption,
  ApiType,
} from './interface/workHttp'

import useStore from '@/composables/store'

enum Api {
  // 弹窗基本信息
  buyDlgInfo = '/pro-dlg',
  // 产品信息
  products = '/products',
  productPrice = '/price',
  // 用户标签接口
  userTags = '/price_discount/user_tags',
  // 产品差异化价格接口
  productDiffPrice = '/price_discount/best/product_list',
  // 获取所有适用支付通道
  payData = '/pay_ratio/index1',
  // 获取默认支付方式
  defaultPay = '/pay_ratio/get_default',
  countryData = '/common/country',
}

const getBaseURL = (baseURL: string, option?: UrlCacheOption) => {
  const {
    public: { API_BASE, API_PREFIX },
  } = useRuntimeConfig() as any
  if (option?.cache) {
    return useRequestURL().origin + API_PREFIX + 'backend'
  }
  return baseURL || API_BASE + API_PREFIX
}

const getCacheKey = (url: UrlType, params: { [key: string]: any } = {}, extraOptions?: UrlCacheOption) => {
  const locale = useStore.common().locale
  if (!extraOptions?.cache) {
    return ''
  }
  if (extraOptions.cacheKey) {
    return `${extraOptions.cacheKey}.${locale}`
  }
  if (extraOptions?.apiType === ApiType.PHP) {
    const paramsKey = urlParamsToString(params)
    return `${url}.${locale}.${paramsKey}`
  }
  return `${url}.${locale}`
}

// 全局参数
const gParamsConfig = () => {
  const locale = useStore.common().locale
  return {
    locale,
    lang: locale,
    laravel_session: useCookie('laravel_session').value || '',
  }
}
// 获取 route 的 query parameters
const getRouteParams = (params?: Record<string, any>): string => {
  if (!params) return ''

  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // 处理数组参数
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${encodeURIComponent(decodeURIComponent(item))}`).join('&')
      }
      // 处理普通参数
      return `${key}=${encodeURIComponent(decodeURIComponent(value))}`
    })
    .join('&')

  return queryParams ? `?${queryParams}` : ''
}

/**
 * 构建请求配置选项
 * @param config - 请求配置对象
 * @param params - URL查询参数（可选）
 * @param params - URL查询参数（可选）
 * @returns 处理后的请求配置
 */
const buildRequestOptions = (
  config: RequestConfig,
  params?: Record<string, any>,
  extOption?: UrlCacheOption,
): RequestConfig => {
  // 获取全局参数配置
  const gParams = gParamsConfig()
  const routeQuery = useRoute().query
  // 统一处理请求方法，转换为大写，默认为 GET
  const method = config.method ? (config.method.toUpperCase() as RequestMethod) : 'GET'
  // 处理 URL 查询参数：合并请求参数和全局参数
  if (params && Object.keys(params).length > 0) {
    // 获取 url
    let _params = { ...params, ...gParams } as any
    // 缓存参数
    if (extOption?.cache) {
      _params = {
        ..._params,
        _cache: extOption.cache,
        _cacheKey: getCacheKey(config.url, params, extOption),
        _cacheBaseUrl: getBaseURL(config?.baseURL || '', { cache: false }),
      }
      if (routeQuery?._original) {
        _params._original = routeQuery?._original
      }
    }

    // 赋值 url 请求接口地址
    config.baseURL = getBaseURL(config?.baseURL || '', extOption)
    config.url = config.url + getRouteParams({ ..._params })
  }

  // POST 请求时，合并全局参数到请求体
  if (method === 'POST') {
    config.data = { ...config.data, ...gParams }
  }

  return config
}

// 获取产品信息的接口参数
const proKeys = [
  'media',
  'downloadUrl',
  'amazon',
  'coupon',
  'services_products',
  'services_product_rels',
  'products',
  'product_rels',
  'related_products',
  'related_products.*',
  'related_product_rels',
  'upgrade_products',
  'product_attrs',
  'product_attrs.media',
  'product_attrs.tags',
  'redirect_products',
  'imgs',
  'price',
  'client_info',
  'client_info.systemRequirement',
]
const relatedProKeys = [
  'related_products.related_products',
  'related_products.downloadUrl',
  'related_products.products',
  'related_products.amazon',
  'related_products.media',
  'related_products.imgs',
  'related_products.price',
  'related_products.coupon',
  'related_products.client_info',
  'related_products.client_info.systemRequirement',
  'related_products.product_attrs',
  'related_products.product_attrs.media',
  'related_products.product_attrs.tags',
]

export default {
  getBuyDlgInfo(params: any) {
    return buildRequestOptions(
      {
        method: 'GET',
        url: Api.buyDlgInfo,
      },
      params,
      {
        cache: true,
      },
    )
  },
  getProducts(params: any) {
    const relatedPids = []
    for (const key in params) {
      if (key.startsWith('filters[pid][$in]') || key.startsWith('[filters][pid][$in]')) {
        relatedPids.push(params[key])
      }
    }
    return buildRequestOptions(
      {
        method: 'GET',
        url: Api.products,
      },
      {
        ...params,
        populate: [...proKeys, ...relatedProKeys].join(','),
      },
      {
        cache: true,
        cacheKey: `${Api.products}.${params['filters[slug][$eq]'] || params['[filters][slug][$eq]'] || '_'}.${
          relatedPids.length ? relatedPids.join(',') : '_'
        }`,
      },
    )
  },

  /**
   * 获取用户标签
   */
  getUserFullTags(data: any) {
    const { ENV, API_OM } = useRuntimeConfig().public
    const tidKey = ENV === 'prod' ? '_EA_TID' : '_T_EA_TID'
    const _data = {
      cache_clear: false,
      debug_user_tags: true,
      user_info: {
        email: data?.email,
        machine_id: '',
        token_id: useCookie(tidKey).value || '',
      },
    }
    return buildRequestOptions({
      method: 'POST',
      url: Api.userTags,
      data: _data,
      baseURL: API_OM,
    })
  },
  /**
   * 获取差异化价格
   */
  getProDiffPrice(data: any) {
    return buildRequestOptions({
      method: 'POST',
      url: Api.productDiffPrice,
      data,
      baseURL: useRuntimeConfig().public.API_OM,
    })
  },
  /**
   * 获取国家信息
   */
  getCountryInfo(data: any) {
    return buildRequestOptions({
      method: 'POST',
      url: Api.countryData,
      data,
      baseURL: useRuntimeConfig().public.API_PHP,
    })
  },
  /**
   * 获取默认支付方式
   */
  getDefaultPay(data: any) {
    return buildRequestOptions({
      method: 'POST',
      url: Api.defaultPay,
      data,
      baseURL: useRuntimeConfig().public.API_PHP,
    })
  },
  /**
   * 获取所有适用通道(订阅 | 非订阅)
   */
  getPayInfo(params: any) {
    return buildRequestOptions(
      {
        method: 'GET',
        url: Api.payData,
        baseURL: useRuntimeConfig().public.API_PHP,
      },
      params,
    )
  },
}
