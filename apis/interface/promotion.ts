export interface Img {
  url: string
  width?: string
  height?: string
}

interface EntryCommonAttrs {
  trackId: string
  title: string
  show: boolean
  img: Img
  titleStyle: any
  toUrl: string
  linkTarget: string
  isShow: boolean
}

export interface HeadBannerAttrs extends EntryCommonAttrs {
  btnText: string
  closeIconStyle: any
  mobileTitle: string
  btnStyle: any
  bgColor: string
}
export interface FloatBannerAttrs extends EntryCommonAttrs {
  closeIconStyle: any
  btnStyle: any
  btnText: string
  btnShow: boolean
}
export interface ResourceBannerAttrs extends EntryCommonAttrs {}

export interface PromotionAttrModel {
  slug: string // 路由
  promotionPid: string // 活动id
  name: string // 活动名称
  tag: string // 活动标记
  blocks: any[] // 活动着陆页的 blocks
  page: object // 活动页一些全局的内容
  themeType: string // 主体类型
  startTime: string // 活动开始时间
  endTime: string // 活动结束时间
  showEntryBanner: boolean // 是否展示入口(多活动在线时需要次要活动需要配置为false)
  headBanner: HeadBannerAttrs
  floatBanner: FloatBannerAttrs
  resourceBanner: ResourceBannerAttrs
}

export interface PromotionResultModel {
  normal: Array<PromotionAttrModel>
  dvdfab: Array<PromotionAttrModel>
  streamfab: Array<PromotionAttrModel>
  musicfab: Array<PromotionAttrModel>
  unifab: Array<PromotionAttrModel>
  playerfab: Array<PromotionAttrModel>
  passkey: Array<PromotionAttrModel>
  bookfab: Array<PromotionAttrModel>
  recordfab: Array<PromotionAttrModel>
}
