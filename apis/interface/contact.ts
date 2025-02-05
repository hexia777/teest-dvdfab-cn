import type { Image } from '~/apis/interface/image'

export interface ContactAttributes {
  title: string
  description: string
  contactForm: string
  yourEmailAddress: string
  yourEmailAddressPlaceholer: string
  yourFullName: string
  yourFullNamePlaceholer: string
  subject: string
  subjectPlaceholer: string
  whichQuestion: string
  whichQuestionPlaceholer: string
  problemType: string
  problemTypePlaceholer: string
  yourMessage: string
  yourMessagePlaceholer: string
  submit: string
  contactAlert: string
  email: string
  chatTitle: string
  chatDescription: string
  chatTime: string
  chatNow: string
  purchaseProblemType: string
  purchaseProblemTypePlaceholer: string
  chatImage: Image
  uploadFileAlert: string
  submitSuccessTitle: string
  submitSuccessDescription: string
  submitErrorTitle: string
  submitErrorDescription: string
  isClose: boolean
}

export interface ContactResultModel {
  id: 1
  attributes: ContactAttributes
}

export interface ContactConditionParams {
  language: number
  lang: string
  host?: string
}

export interface ContactConditionResultModel {
  problems: Array<{
    id: number
    name: string
    p_id: number
    order_sort: number
    sub: Array<{
      id: number
      name: string
      p_id: number
      order_sort: number
    }>
  }>
  priorities: Array<{
    id: number
    name: string
  }>
}

export interface ContactConfigParams {
  language: number
  lang: string
}

export interface ContactConfigResultModel {
  product_line: Array<{
    id: number
    key: string
    value: string
    project_id: number
  }>
}

export interface TicketAddParams {
  email: string
  problem_id: number
  full_name: string
  priority_id: number
  subject: string
  came_from: number
  origin_url: string
  language: number
  contents: string
  recaptcha: string
  product_line: string
  host?: string
}

export interface TicketAddResultModel {}

export interface TicketRefundTypeParams {
  language: number
}

export interface TicketRefundTypeResultModel {
  key: number
  value: string
}
