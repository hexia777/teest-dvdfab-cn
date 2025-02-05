export interface Attributes {
  locale: string
  bestSellerText: string
  exclusiveDiscount: string
  yearItems: Array<{
    id: number
    text: string
  }>
  leftimeItems: Array<{
    id: number
    text: string
  }>
  allInOneItems: Array<{
    id: number
    text: string
  }>
  images: {
    data: Array<{
      id: number
      attributes: {
        name: string
        alternativeText: string | null
        width: number
        height: number
        url: string
      }
    }>
  }
  bottomItems: Array<{
    id: number
    text: string
  }>
  localizations: {
    data: any[]
  }
  screenRecoderItems: {
    data: any[]
  }
  aioUserAlertText: string
}

export interface PurchaseAlertModel {
  id: number
  attributes: Attributes
}

export interface Product {
  data: {
    id: number
    attributes: {
      slug: string
      name: string
      description: string
      pid: number
      price1M: number
      price1Y: number
      priceLFT: number
      discountRate: number
      coupon: string
      image: {
        data: {
          id: number
          attributes: {
            name: string
            alternativeText: string | null
            width: number
            height: number
            url: string
          }
        }
      }
    }
  }
}

export interface PurchaseStepAttrsModel {
  addCouponText: string
  addText: string
  backText: string
  changeText: string
  couponCodeText: string
  invalidCouponText: string
  recommendText: string
  yourEmailText: string
  changeEmailText: string
  fillInText: string
  payNowText: string
  protectText: string
  subtotalText: string
  discountText: string
  totalText: string
  precautionsText: string
  orText: string
  emailInformationText: string
  paymentText: string
  paymentCompleteText: string
  emailTitle: string
  emailDescription: string
  continuePayText: string
  checkNow: string
  payln: string
  anotherCurrency: string
  changeCurrency: string
  preferredCurrency: string
  orderSummary: string
  headerProductGroups: Array<{
    id: number
    title: string
    description: string
    product: Product
  }>
  recommendProductGroups: Array<{
    id: number
    title: string
    description: string
    product: Product
    selected: boolean
  }>
  topRecommendProducts: Array<{
    id: number
    title: string
    description: string
    product: Product
  }>
  images: {
    data: Array<{
      id: number
      attributes: {
        alternativeText: string
        width: number
        height: 89
        url: string
      }
    }>
  }
  NotOwenedText: string
  YouSelectedText: string
}

export interface PurchaseStepModel {
  id: 1
  attributes: PurchaseStepAttrsModel
}
