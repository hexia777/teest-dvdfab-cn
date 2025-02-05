export interface InvoiceParams {
  order_id: string
}

export interface InvoiceResultModel {
  email: string
  username: string
  business: any[]
  order_info: {
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
}
