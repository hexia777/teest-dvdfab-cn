export interface CountDownTimeAttrModel {
  hours: number
  countDownTime: string
  isShowCountdown: boolean
  createdAt: string
  updatedAt: string
}

export interface CountDownTimeResultModel {
  id: number
  attributes: CountDownTimeAttrModel
}
