import type { HomeResultModel } from './interface/home'
import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  index = '/page-home',
}

export default new (class home extends Http {
  /**
   * @description: 获取首页信息
   */
  public index(params?: any, option?: HttpOption<HomeResultModel>) {
    return this.get<HomeResultModel>(Api.index, params, { ...option, _cache: true })
  }
})()
