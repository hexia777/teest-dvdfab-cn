interface Order {
  order_id: string
  date: string
  status: number
  amount: string
  currency: string
  card_type: string
  products: Array<{
    pid: string
    name: string
    year: string
    app_id: string
  }>
}

export interface OrderListResultModel {
  order_list: Array<Order>
}

export interface ActivateOemParams {
  type: string
  pid: number | string
  vid?: string
  oid?: string
}

export interface ActivateOemResultModel {
  id: string
  vid: string
  oid: string
  opt: string
  num: string
  code: string
  pid: string
}
