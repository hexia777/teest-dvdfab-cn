import type { ProductModel } from '~/apis/interface/product'

export interface DownloadAttributesModel {
  title: string
  description: string
  products: {
    data: Array<ProductModel>
  }
}

export interface DownloadResultModel {
  id: 1
  attributes: DownloadAttributesModel
}

// 参数
export interface DownloadSoftwareParamsModel {
  lang: string
}

export interface DownloadSoftwareItemModel {
  version: string
  date: string
  size: string
  real_size: string
  beta_text: string
  beta_url: string
}
export interface Software {
  unifab_x64: DownloadSoftwareItemModel
  unifab_for_mac: DownloadSoftwareItemModel
  unifab_for_mac_m1: DownloadSoftwareItemModel
  unifab_toolkit: DownloadSoftwareItemModel
  unifab_videocruise: DownloadSoftwareItemModel
  unifab_video_converter_pro: DownloadSoftwareItemModel
  photo_enhancer_ai: DownloadSoftwareItemModel
  [k: string]: DownloadSoftwareItemModel
}
export interface DownloadSoftwareInfoModel {
  softs: Software
}

export interface SoftwareNameParams {
  g: string
}
export interface SoftwareNameResultModel {
  file_name: string
}
