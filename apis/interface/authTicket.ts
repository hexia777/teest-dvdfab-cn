export interface TicketListParams {
  start: number
  len: number
  status: number
  email: string
  host?: string
  domain_id: number
}

export interface TicketListItemModel {
  id: number
  email: string
  subject: string
  problem_id: number
  read_status: number
  status: number
  create_time: string
  last_message: string
  last_message_time: string
}

export interface TicketListResultModel {
  list: Array<TicketListItemModel>
  start: number
  len: number
  total: number
}

export interface TicketRefundParams {
  domain_id: number
  order_no: string
  software: string
  refund_id: number
  reason_desc: string
  email: string
  full_name: string
  origin_url: string
  came_from: number
  language: number
}

export interface TicketMessageParams {
  id: string
  email: string
}

export interface TicketMessageResultModel {
  id: number
  email: string
  subject: string
  contents: string
  full_name: string
  came_from: number
  problem_id: number
  read_status: number
  status: number
  create_time: string
  messages: Array<{
    message: string
    member_id: number
    create_time: string
    name: string
  }>
}

export interface TicketMessageSendParams {
  id: number
  message: string
  email: string
}

export interface TicketMessageCloseParams {
  id: number
  status: number
}

export interface TicketEvaluateParams {
  id: number
  opinion: string
  service_process: number
  service_result: number
}
