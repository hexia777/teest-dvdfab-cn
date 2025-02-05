import type { Image } from '~/apis/interface/image'

interface PageModel {
  data: {
    attributes: {
      blocks: any[]
    }
  }
}

export interface ProductCommonModel {
  slug: string
  name: string
  description: string
  price: number
  win64DownloadUrl: string
  updatedDate: string
  buyUrl: string
  coupon: string
  gifts: Array<{
    label: string
    link: string
  }>
  pid: number
  winSystem: string
  macSystem: string
  buyDescription: string
  downloadDescription: string
  price1Y: number
  priceLFT: number
  discountRate: number
  image: Image
  imageWithoutGift: Image
  backgroudImage: Image
  logoImage: Image
  icon: Image
  page_install_success?: PageModel
  page_download_success?: PageModel
  downloadUrl: string
  system: string
  countDownTime: string
  isShowCountdown: boolean
}

export interface ProductsBaseModel extends ProductCommonModel {
  products: {
    data: ProductCommonModel[]
  }
}

export interface ProductsAttrsModel extends ProductsBaseModel {
  related_product: {
    data: {
      id: number
      attributes: ProductsBaseModel
    }
  }
  imgs?: []

  win?: {
    id: number
    attributes: ProductsBaseModel
  }
  mac?: {
    id: number
    attributes: ProductsBaseModel
  }
}

export interface ProductModel {
  id: number
  attributes: ProductsAttrsModel
}

export interface PageErrorProductsAttrsModel extends ProductsBaseModel {
  title: string
  locale: string
  win?: {
    id: number
    attributes: ProductsBaseModel
  }
  mac?: {
    id: number
    attributes: ProductsBaseModel
  }
}

export interface PageErrorProductModel {
  id: number
  attributes: ProductsAttrsModel
}
