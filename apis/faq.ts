import Http from '~/utils/request'

enum FaqApi {
  search = '/faq/search',
  faqCategory = '/faq/get_faq_list_by_category',
  faqTypes = '/faq/get_types',
  faqDetail = '/faq/get',
  faqRelate = '/faq/relate',
}

export default new (class Faq extends Http {
  public searchFaq(body: any, options?: any) {
    return this.phpPost<any>(FaqApi.search, body, {
      ...options,
      // _cache: true,
    })
  }

  public getFaqCategory(params: any, options?: any) {
    return this.phpGet<any>(FaqApi.faqCategory, params, {
      ...options,
      _cache: true,
    })
  }

  public getFaqTypes(params: any, options?: any) {
    return this.phpGet<any>(FaqApi.faqTypes, params, {
      ...options,
      _cache: true,
    })
  }

  public getFaqDetail(params: any, options?: any) {
    return this.phpGet<any>(FaqApi.faqDetail, params, {
      ...options,
      _cache: true,
    })
  }

  public getFaqRelate(params: any, options?: any) {
    return this.phpGet<any>(FaqApi.faqRelate, params, {
      ...options,
      _cache: true,
    })
  }
})()
