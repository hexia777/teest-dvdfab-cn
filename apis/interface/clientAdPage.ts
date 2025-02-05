import type { Seo } from '~/apis/interface/seo'

export interface ClientPageParams {
  '[filters][slug][$eq]': string
}

export interface ClientPageResultModel {
  id: number
  attributes: {
    slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
    blocks: any[]
    seo: Seo
  }
}
