import type { Image } from '~/apis/interface/image'

export interface IndexAttrModel {
  title: string
  description: string
  buttonText: string
  tipText: string
  submitSuccessText: string
  backText: string
  emailTitle: string
  emailContent: string
  image: Image
}

export interface IndexResultModel {
  id: 1
  attributes: IndexAttrModel
}

export interface AddParamsModel {
  email: string
  id: string
  notes: string
}

export interface sendEmailParamsModel {
  email: string
  email_title: string
  email_content: string
  product: string
  type: string
}
