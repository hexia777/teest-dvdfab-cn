import type { BaseResultModel } from './phpApiBase'

interface Order {
  id: string
  tid: string
  pid: string
  pname: string
  user_name: string
  vid: string
  oid: string
  start: string
  end: string
  quantity: string
  STATUS: string
  order_list_type: string
  code?: any
}

export interface MyProductResultModel {
  status: boolean
  req_email: string
  content: {
    orders: Array<Order>
    four_in_one_orders: any[]
    oem_orders: Array<Order>
    toolkit_orders: Array<Order>
    oem_dvdfab365: any[]
    oem_unifab_aio: any[]
    multios: string[]
    enabled_products: {
      streamfab_aio_upgrade: {
        discount: string
        aio_for_win: boolean
        aio_for_mac: boolean
      }
      dvdfab_356_discount: {
        pid: number
        amount: number
        discount: string
        time_end: number
      }
      allinone_old_user_discount: { [key: string]: any }
      old_user2_discount_products: { [key: string]: any }
    }
    movie_server: any[]
    is_all_in_one_user: boolean
  }
}

export interface ProductLicense {
  status: boolean
  device_licenses: {
    [key: string]: Array<{
      id: string
      email: string
      client: string
      device: {
        MAC: string
        DS: string
        IS: string
        BI: string
      }
      ip: string
      status: string
      time: string
    }>
  }
  win_used: number
  win_totle: string
  mac_used: string
  mac_totle: string
  mobile_used: string
  mobile_totle: number
  win_deauthorize: {
    total: number
    used: number
    is_allow_reset: boolean
  }
  mac_deauthorize: {
    total: number
    used: number
    is_allow_reset: true
  }
  mobile_deauthorize: {
    total: number
    used: number
    is_allow_reset: number
  }
}

export interface UnbindDeviceParams {
  id: string | number
}

export interface AmazonGiftListContentResultModel {
  vid: string
  oid: string
  pid: string
  raw_pid: string
  start: string
  country: string
  gift_status: string | number
  pname: string
  code: string
  amount: string
  EUR: string
  GBP: string
  JPY: string
  USD: string
}

export interface AmazonGiftListResultModel {
  content: {
    all_in_one_new_amazon: Array<AmazonGiftListContentResultModel>
  }
}

export interface AmazonGiftApplyParams {
  vid: string
  oid: string
  pid: string
  currency: string
  amount: string
  country: string
}

export interface AmazonGiftApplyResultModel extends BaseResultModel {}
