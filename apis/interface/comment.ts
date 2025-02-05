export interface CommentCreateParams {
  email: string
  name: string
  content: string
  recaptcha: string
}

export interface CommentListParams {
  locale: string
  '[filters][url][$eq]': string
  '[filters][isChecked][$eq]': boolean
}

export interface ReplyAttributes {
  title: string
  desc: string
}

export interface CommentResultModel {
  id: 1
  attributes: {
    email: string
    name: string
    content: string
    lang: string
    url: string
    articleType: string
    isChecked: boolean
    fullUrl: string
    reply: ReplyAttributes
  }
}
