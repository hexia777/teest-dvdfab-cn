export interface UploadResultModel {
  uid: string
  name: string
  thumbnail: string
  w: number
  h: number
  filesize: number
}

export interface transformEnlargeParamsModel {
  uid: string
}

export interface transformEnlargeResultModel {
  trans_id: string
  status: string
}

export interface DownloadParamsModel {
  trans_id: string
}
