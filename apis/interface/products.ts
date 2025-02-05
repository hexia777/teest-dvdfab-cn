import type { Seo } from '~/apis/interface/seo'
import type { ProductModel, ProductsAttrsModel } from '~/apis/interface/product'

export interface ProductsParams {
  'filters[slug][$eq]'?: any
  populate?: any
  [k: string]: any
}

export interface ProductsResultAttrsModel extends ProductsAttrsModel {}

export interface ProductsResultModel extends ProductModel {}

export interface PageProductsParams extends ProductsParams {}

export interface PageProductsResultModel {
  id: number
  attributes: {
    slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
    blocks: any[]
    seo: Seo
    product: {
      data: ProductModel
    }
    system: string
  }
}

export interface ProductPriceParams {
  pids: string
  email?: string
  lang?: string
}

export interface ProductPriceResultItemModel {
  pid: number
  name: string
  price1M: number
  price1Y: number
  priceLFT: number
  discountPriceLFT: number
  notBoughtOriginPrice: number
  basicDiscountPriceLFT: number
  discountRate: number
  bestDiscountType: string
  bestDiscountRate: number
  orderType: string
  userType: string
  completeRate: number
  boughtAIOPidTypes: Array<{
    pid: string
    type: string
  }>
  userUnifabLFTOptionPids: string[]
  aioBundlePids: string[]
  notBoughtAIOPids: string[]
  notBoughtAIOProducts: Array<any>
}

export interface ProductPriceResultModel {
  email?: string
  lang: string
  currency: string
  products: Array<ProductPriceResultItemModel>
  aioText: {
    upgradeTitle: string
    upgradeDescription: string
    upgradeButton: string
    completeTitle: string
    completeDescription: string
    completeButton: string
    upgradeOfferDescription: string
    upgradeMacTitle: string
    complementBannerPriceDes: string
  }
}

export interface UserInfoParams {
  token_id?: string // 用户token
  machine_id?: string // 用户的mac地址
  email?: string // 用户邮箱
}

export interface EnvParams {
  platform: string // 平台(desktop|mobile)
  os: string // 操作系统
  domain?: string // 名
  domain_root?: string // 域名类型
  currency: string // 货币类型
  source?: string // 接口来源(web | client)
  return_options: boolean // 是否返回用户拥有的options信息
  cache_clear?: boolean // 清除接口缓存(多用于开发调试，默认为false)
  app_id: string // 产品线的 app_id
}

export interface ProductDiffPriceParams {
  user_info: UserInfoParams
  env: EnvParams
  operation_keys: Array<string | number> // pid集合 or 关键key
  version?: string // 接口协议版本
  common_discount?: boolean // 是否返回通用折扣
  debug_user_info?: boolean // 是否返回用户信息 (用于调试，展示用户属性)
}
// 差异化接口返回的数据模型
export interface ProductDiffPriceResultModel {
  base?: any
  details: any
}
// 价格数据模型
export interface ProductDiffPriceModal {
  code: string // discount or coupon 优惠码
  currency: 'USD' // 币种
  discount_rate: number // 折扣率，用于计算
  discount_type: string // 优惠券类型
  discount_verify: string // 当类型为 discount 时 用于优惠券系统验证的密文
  off_num: 30 // 具体折扣数字, 用于展示
  origin_price: 379.99 // 原价
  payment_price: 265.99 // 折扣价（实际支付价）
}

// 获取用户标签 - 接口入参
export interface UserTagsParams {
  user_info: UserInfoParams
  version?: string // 接口协议版本
  cache_clear?: boolean // 清除接口缓存(多用于开发调试，默认为false)
  debug_user_tags: boolean // 直接展示tags内容，tags内容不进行base64编码
}

// 获取用户标签 - 返回模型
export interface UserTagsResultModel {
  data: any
}

// 获取404页面产品列表 - 接口入参
export interface PageErrorProductList {
  locale: string
}

// 提交订阅 - body 入参
export interface UserPayInfoParams {
  email: string
  confirm_email: string
  fname?: string
  lname?: string
  address1?: string
  city?: string
  country?: string
  state?: string
  state_us?: string
  state_ac?: string
  zip?: string
  phone?: string
}

// 提交订阅 - 返回模型
export interface SubscribeResultModel {
  data: any
}

// 获取默认支付方式 - 接口入参
export interface getDefPayParams {
  domain_root: string
  token: string
}

// 获取通道列表(订阅|非订阅) - 接口入参
export interface getPayDataParams {
  domain_root: string
  order_type: string
  ip: string
  lang: string
  language: string
  currency: string
  exchange: string
}
