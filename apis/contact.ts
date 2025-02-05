import type {
  ContactConditionParams,
  ContactConditionResultModel,
  TicketAddParams,
  TicketAddResultModel,
} from './interface/contact'
import Http from '~/utils/request'

enum Api {
  condition = '/condition',
  config = '/config',
  addTicket = '/ticket/add',
}

export default new (class Article extends Http {
  /**
   * @description: 获取contact option 信息
   */

  public getConditionData(params: ContactConditionParams, option?: any) {
    return this.get<ContactConditionResultModel>(
      useRuntimeConfig().public.API_TICKET + Api.condition,
      params,
      option,
    )
  }

  public getConfigData(params: ContactConditionParams, option?: any) {
    return this.get<ContactConditionResultModel>(
      useRuntimeConfig().public.API_TICKET + Api.config,
      params,
      option,
    )
  }

  public addTicketData(params: TicketAddParams, option?: any) {
    return this.post<TicketAddResultModel>(
      useRuntimeConfig().public.API_TICKET + Api.addTicket,
      params,
      option,
    )
  }
})()
