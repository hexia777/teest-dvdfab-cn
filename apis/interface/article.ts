import type { Seo } from '~/apis/interface/seo'
import type { ProductModel } from '~/apis/interface/product'

export type ArticleCategory =
  | 'drmdownloader'
  | 'topic'
  | 'resource'
  | 'tips'
  | 'translate_resource'
  | 'recorder'

export interface CatalogItem {
  level: string
  hid: string
  name: string
  content: string
  cid: number
  pid: number
  nodes?: CatalogItem[]
}

export interface AuthorInfo {
  facebook_address: string
  instagram_address: string
  linkedin_address: string
  pinterest_address: string
  twitter_address: string
  description: string
  author_name: string
  author_img: string
}

export interface PopularTag {
  title: string
  href: string
}
export interface ArticleResource {
  id: string
  url: string
  title: string
  description: string
  category: string
  type: string
  sort: string
  author: string
  summary: string
  content: string
  product: string
  download_win: string
  download_mac: string
  product_1: string
  product_txt_1: string
  product_2: string
  product_txt_2: string
  product_3: string
  product_txt_3: string
  views: number
  attach: string
  time: string
  rating: string
  recommend_article: string
  cover_img: string
  catalog: CatalogItem[]
  create_time: string
  keywords: string
  convert_title: string
  product_top_banner: string
  mac_product_top_banner: string
  product_summary_banner: number
  product_category_banner: number
  product_base_banner: number
  product_popup_banner: string
  mac_product_base_banner?: number
  product_top_banner_content: string
  product_top_banner_title: string
  mac_product_top_banner_content?: string
  mac_product_top_banner_title?: string
  mac_product_popup_banner: string
  mac_product_category_banner: string
  product_url: string
  is_show: string
  summary_banner_title: string
  summary_banner_content: string
  author_info: AuthorInfo
  popular_tags: PopularTag[]
  traffic_type: string
}

export interface ArticleProduct {
  pid: number
  product_name: string
  product_box: string
  down_url: string
  route: string
  product_name_new: string
  route_new: string
  down_url_new: string
  product_line: string
}
export interface ArticleProductInfo {
  [key: string]: ArticleProduct
}
export interface ArticleDetailNewResultModel {
  resource: ArticleResource
  product_info: ArticleProductInfo
  recommend_article_list: object[]
  recommend_products: object[]
  category_article: object[]
  trick_summary_mac?: string
  trick_summary_win?: string
}

// 往下是copy过来的定义
export interface PaginationParams {
  'pagination[page]': number
  'pagination[pageSize]': number
}

export interface CategoryParams extends PaginationParams {}

export interface CategoryResultModel {
  id: number
  attributes: {
    createdAt: string
    updatedAt: string
    locale: string
    name: string
    slug: string
    descriptions: string
  }
}

export interface CategoryFilterParams extends PaginationParams {
  'filters[category][slug]': string
}

interface FormatsItem {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: null
  size: number
  width: number
  height: number
}

export interface CategoryFilterAttributes {
  title: string
  slug: string
  summary: string
  updatedDate: string
  content: string
  blocks?: any[]
  image: {
    data: {
      id: number
      attributes: {
        name: string
        alternativeText: any
        caption: any
        width: number
        height: number
        formats: {
          large: FormatsItem
          small: FormatsItem
          medium: FormatsItem
          thumbnail: FormatsItem
        }
        hash: string
        ext: string
        mime: string
        size: number
        url: string
        previewUrl: any
        provider: string
        provider_metadata: any
        createdAt: string
        updatedAt: string
      }
    }
  }
  category: {
    data: {
      id: number
      attributes: {
        createdAt: string
        updatedAt: string
        locale: string
        name: string
        slug: string
        descriptions: string
      }
    }
  }
  tags: {
    data: Array<{
      id: 2
      attributes: {
        name: string
        createdAt: string
        updatedAt: string
        locale: string
        slug: string
      }
    }>
  }
  author: {
    data: {
      id: number
      attributes: {
        name: string
        email: string
        createdAt: string
        updatedAt: string
        locale: string
        biography: string
        facebook: any
        twitter: any
        instagram: any
        linkedIn: any
        slug: string
        avatar: {
          data: {
            attributes: {
              alternativeText?: string | null
              url: string
            }
          }
        }
      }
    }
  }
  product: {
    data: ProductModel
  }
  seo: Seo
}

export interface CategoryFilterResultModel {
  id: number
  attributes: CategoryFilterAttributes
  seo: Seo
}

export interface ArticleDetailParams {
  '[filters][slug][$eq]': string
}

export interface ArticleDetailResultModel extends CategoryFilterResultModel {}

export interface TagsParams extends PaginationParams {
  'filters[tags][slug][$eq]': string
}

export interface TagsResultModel {
  id: number
  attributes: {
    title: string
    slug: string
    summary: string
    image: {
      data: {
        id: number
        attributes: {
          url: string
        }
      }
    }
    category: {
      data: {
        id: number
        attributes: {
          slug: string
          name: string
          createdAt: string
          updatedAt: string
          descriptions: string
        }
      }
    }
    tags: {
      data: {
        id: number
        attributes: {
          name: string
        }
      }
    }
    author: {
      data: {
        id: number
        attributes: {
          name: string
        }
      }
    }
  }
}

export interface HotResultModel {
  id: number
  attributes: {
    createdAt: string
    updatedAt: string
    locale: string
    hotArticles: {
      data: Array<{
        id: number
        attributes: {
          title: string
          slug: string
          image: {
            data: null
          }
        }
      }>
    }
  }
}

export interface NewParams extends PaginationParams {
  'filters[slug][$ne]': string
}

export interface NewResultModel {
  id: number
  attributes: {
    title: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
    content: string
    summary: string
    slug: string
    updatedDate: string
    image: {
      data: {
        id: number
        attributes: {
          url: string
        }
      }
    }
  }
}

export interface AuthorByArticleParams extends PaginationParams {
  'filters[author][slug][$eq]': string
}

export interface AuthorByArticleResultModel extends CategoryFilterResultModel {}

export interface GetArticleFirstImgParams {
  lang: string
  url_list: {
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
  }
}

export interface GetArticleFirstImgRes {
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
}

export interface ArticleCategoryListParams {
  lang: string
  len?: string | number
  os?: string
}

export interface subCategoryArtistListParams {
  lang: string
  type: string
  sub_type?: string
  len: string | number
  start?: string | number
}

interface ResourceType {
  [key: string]: string
}

interface SubType {
  [key: string]: string
}

interface ResourceSubType {
  [key: string]: SubType
}

interface Product {
  down_url: string
  down_url_new: string
  pid: number | string
  product_box: string
  product_line: string
  product_name: string
  product_name_new: string
  route: string
  route_new: string
  top_content: string
  top_title: string
}

export interface ArticleCategoryListRes {
  resource_type: ResourceType
  resource_sub_type: ResourceSubType
  recommend_products: Product
}

export interface Article {
  url: string
  title: string
  type: string
  summary: string
  time: string
  author: string
  link?: string
  authorLink?: string
  img?: string
  cover_img?: string
  cover_image?: string
}

export interface ResourceDataRes {
  dvd: Article[]
  blu_ray: Article[]
  video: Article[]
  cinavia: Article[]
  drm: Article[]
  '4k_media': Article[]
  image: Article[]
  downloader: Article[]
  topics: Article[]
}

export interface Author {
  id: number
  name: string
  mailbox: string
  description: string
  meta_title: string
  meta_keywords: string
  meta_description: string
}

export interface AuthorArticleListParams {
  lang: string
  start: string | number
  len: string | number
  author?: string | number
}
