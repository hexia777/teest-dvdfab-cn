export interface OrderListItem {
  id: string
  tid: string
  pid: string
  pname: string
  user_name: string
  vid: string
  oid: string
  start: string
  end: string
  EXT1: string | number
  EXT2: string | number
  ANSWER: string
  quantity: string
  STATUS: string
  track_id: string
  expired: boolean
  payment_currency: string
  payment_amount: string
  currency: string
  card_type: string
  card: string
}

export interface SubscribeListResultModel {
  order_list: Array<OrderListItem>
  is_all_in_one_plan: false
  is_old_user: false
  time_notice: false
  subscribe_list: any[]
  activated_list: any[]
}
