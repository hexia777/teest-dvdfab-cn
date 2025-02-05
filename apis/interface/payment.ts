import type { Image } from '~/apis/interface/image'

export interface Attributes {
  title: string
  description: string
  orderInformation: string
  orderNumber: string
  productName: string
  transationAmount: string
  orderDate: string
  license: string
  renewalTime: string
  authenticateTitle: string
  authenticateDescription: string
  image: Image
  items: Array<{
    id: number
    title: string
    description: string
    linkLabel: string
    link: string
    image: Image
  }>
  backgroundImage: Image
  errorAuthenticateDescription: string
  errorAuthenticateTitle: string
  errorDescription: string
  errorTitle: string
}

export interface PaymentResultModel {
  id: number
  attributes: Attributes
}
