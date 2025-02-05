export interface OrderPreviewParams {
  pay?: string
  pid: number | string
  qty: number | string
  currency: string
  exchange: string
  coupon?: string
  discount?: string
  email: string
  ip: string
  [key: string]: any
}

export interface OrderPreviewResultProductsItemModel {
  pid: number
  name: string
  recommend?: boolean
  option: string
  standard_price: number
  checkout_price: number
}

export interface OrderPreviewResultModel {
  standard_price: number
  checkout_price: number
  products: Array<OrderPreviewResultProductsItemModel>
  currency: {
    currency: string
    exchange: string
    rate: number
  }
  client_ip?: string
  country_code?: string
}

export interface OrderCreateQueryParams extends OrderPreviewParams {
  domain: string
  affiliate: string
  ad: string
}

export interface OrderCreateResultModel {
  id: string
  location: string
  data?: {
    client_secret: string
  }
}

export interface OrderQueryParams {
  pay: string
  track: string
}

export interface OrderQueryResultModel {
  oid: string
  email: string
  time: string
  currency: string
  amount: string
  sub_id: string
  products: Array<{
    pid: number
    name: string
    price: number
    option: string
    quantity: number
  }>
}

export interface OrderPaymentAnalyticsResultModel {
  amount: string
  currency: string
  time: string
  vat: number
  payment_vat: number
  payment_method: string
  status: boolean
  oid: string
  raw_amount: string
  raw_currency: string
  platform: string
  coupon: string
  discount: string
  coupon_id: string
  email: string
  domain: string
  lang: string
  sid: string
  balance_currency: string
  balance_amount: string
  is_real_order: boolean
  products: Array<{
    pid: string
    amt: string
    name: string
    opt: string
    qty: string
    cal: string
  }>
  user_token: string
  user_token_new: string
  session_id: string
  refdomain: string
}

export interface OrderGetStripePaymentParams {
  pay: string
  pi: string
  payment_method: number
}

export interface OrderGetStripePaymentResultModel {
  payment_method: {
    id: string
    object: string
    allow_redisplay: string
    card: {
      brand: string
      wallet: any
    }
    type: string
  }
}
