export interface ImageAttr {
  name: string
  alternativeText?: string
  caption: null
  url: string
  width: number
  height: number
}

export interface Image {
  data: {
    id: number
    attributes: ImageAttr
  }
}
