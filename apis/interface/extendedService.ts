export interface ExtendedServiceProductItem {
  status: boolean
  eds_pid: number
  software: {
    win: { [k: string]: any }
    mac: { [k: string]: any }
    [k: string]: any
  }
}

export interface ExtendedServiceProductResultModel {
  eds_info: {
    UniFab: ExtendedServiceProductItem
  }
}

export interface ExtendedServiceParams {
  software: string | number
}

export interface ExtendedServiceResultModel {
  software: number
  version: number
  extend_download: string
}
