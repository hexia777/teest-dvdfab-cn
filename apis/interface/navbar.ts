import type { ProductCommonModel } from '~/apis/interface/product'

export interface NavBarPage {
  id: number
  attributes: {
    slug: string
    type: string /* product | other */
    title: string
    product: {
      data: {
        id: number
        attributes: ProductCommonModel
      }
    }
    system?: string /* mac | null */
    locale?: string
    createdAt?: string
    publishedAt?: string
    updatedAt?: string
  }
}

export interface NavBarAttrs {
  copyright: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  headerBlocks: Array<{
    id: number
    href: string
    title: string
    label: string
    __component: string
    leftPage?: {
      data: NavBarPage
    }
    items: Array<{
      id: number
      title: string
      pages: {
        data: Array<NavBarPage>
      }
    }>
    page: {
      data: NavBarPage
    }
    pages: {
      data: Array<NavBarPage>
    }
  }>
  footerBlocks: Array<{
    id: number
    title: string
    __component: string
    description?: string
    placeholder?: string
    alertSuccess?: string
    alertFail?: string
    facebook?: string
    twitter?: string
    youtube?: string
    pinterest?: string
    linkedIn?: string
    pages: {
      data: Array<NavBarPage>
    }
  }>
  leftBlocks?: Array<{
    id: number
    slug: string
    title: string
    __component: string
    leftPage: {
      data: NavBarPage
    }
    pages: {
      data: Array<NavBarPage>
    }
    isExpand: boolean
  }>
  rightBlocks?: Array<{
    id: number
    __component: string
    page: {
      data: NavBarPage
    }
    pages: {
      __component: string
      data: Array<NavBarPage>
    }
  }>
}

export interface NavbarResultModel {
  id: number
  attributes: NavBarAttrs
}

// 新闻信订阅
export interface NewsLetterSubParams {
  check_url: string
  email: string
}

export interface NewsLetterSubResultModel {}
