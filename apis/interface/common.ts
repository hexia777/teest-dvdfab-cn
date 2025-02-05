export interface NavParams {
  'filters[os][$eq]'?: any
  populate?: any
  [k: string]: any
}

export interface countDownNewParams {
  loop: number
  /**
   * json 字符串
   * JSON.stringify([
          {
            time_end: this.$t('common_basic.dvdfab_aio_gift_pro_time_end'),
            loop_seconds: this.$t('common_basic.dvdfab_aio_gift_pro_loop_seconds'),
          },
        ]),
   * */
  time_date: string
}

export interface CountDownNewResultModel {
  date_end: string
  date_end_ts: number
  date_now: string
  end_time: string
  i: number
  loop_time_left: number
  time_end: number
  time_left: number
}

// 导航栏、footer
export interface CommonBarParams {
  'filters[os][$eq]'?: string
  'filters[productLine][$eq]'?: string
  locale: string
}
export interface CommonBarResultModel {
  id: number
  attributes: any
}

// 订阅新闻信
export interface SubNewsletterParams {
  email: string
  lang: string
  check_url: string
}
export interface BackendDataResultModel {
  data: any
}

// 获取国家
export interface CountryParams {
  ip: string | undefined
}

// 退出登录
export interface LogoutParams {
  laravel_session: string
}
