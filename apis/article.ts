import type {
  ArticleDetailNewResultModel,
  GetArticleFirstImgParams,
  GetArticleFirstImgRes,
  ArticleCategory,
  ArticleCategoryListParams,
  subCategoryArtistListParams,
  ArticleCategoryListRes,
  ResourceDataRes,
  AuthorArticleListParams,
  Author,
} from './interface/article'
import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  getFirstImgUrl = '/article/first_img',
  articleSubscribe = '/article/subscribe',
  tipsProducts = '/article/tips/product_list',
  searchTipsArticle = '/article/tips',
  articleCategory = `/article/resource/category`,
  resourceType = `/article/resource/more_new`,
  resourceSubType = `/article/resource/type`,
  resource = `/article/resource_new`,
  topic = `/article/topic/list`,
  downloader = `/article/drmdownloader/list`,
  authorList = `/article/author_list`,
  authorArticleList = `/article/author_article_new`,
}

enum ArticleDetailApi {
  drmdownloader = `/article/drmdownloader/detail_new`,
  topic = `/article/topic/detail_new`,
  resource = `/article/resource/detail_new`,
  tips = `/article/tips/detail_new`,
  translate_resource = `/article/translate_resource/detail_new`,
}

export default new (class Article extends Http {
  /**
   * @description: 获取首页信息
   */

  public getFirstImgUrl(params: GetArticleFirstImgParams, options: any) {
    return this.phpPost<GetArticleFirstImgRes>(Api.getFirstImgUrl, params, options)
  }

  public subscribeNewsletter(params: any) {
    return this.phpPost(Api.articleSubscribe, params)
  }

  public getArticleDetailNew(
    type: ArticleCategory,
    params?: any,
    option?: HttpOption<ArticleDetailNewResultModel>,
  ) {
    return this.phpGet<ArticleDetailNewResultModel>(ArticleDetailApi[type], params, {
      ...option,
      _cache: true,
    })
  }

  public getTipsProducts(params: any, option?: any) {
    return this.phpGet(Api.tipsProducts, params, {
      ...option,
      _cache: true,
    })
  }

  public searchTipsArticle(params: any, option?: any) {
    return this.phpGet(Api.searchTipsArticle, params, {
      ...option,
      // _cache: true,
    })
  }

  public getArticleCategory(params: ArticleCategoryListParams, option?: any) {
    return this.phpGet<ArticleCategoryListRes>(Api.articleCategory, params, {
      ...option,
      _cache: true,
    })
  }

  public getTopicData(params: ArticleCategoryListParams, option?: any) {
    return this.phpGet<ResourceDataRes>(Api.topic, params, {
      ...option,
      _cache: true,
    })
  }

  public getDownloadData(params: ArticleCategoryListParams, option?: any) {
    return this.phpGet<ResourceDataRes>(Api.downloader, params, {
      ...option,
      _cache: true,
    })
  }

  public getResourceData(params: ArticleCategoryListParams, option?: any) {
    return this.phpGet<ResourceDataRes>(Api.resource, params, {
      ...option,
      _cache: true,
    })
  }

  public getResourceCateData(params: subCategoryArtistListParams, option?: any) {
    return this.phpGet<ResourceDataRes>(Api.resourceType, params, {
      ...option,
      _cache: true,
    })
  }

  public getResourceSubCateData(params: subCategoryArtistListParams, option?: any) {
    return this.phpGet<ResourceDataRes>(Api.resourceSubType, params, {
      ...option,
      _cache: true,
    })
  }

  public getAuthorList(params: ArticleCategoryListParams, option?: any) {
    return this.phpGet<Author[]>(Api.authorList, params, {
      ...option,
      _cache: true,
    })
  }

  public getAuthorArticleList(params: AuthorArticleListParams, option?: any) {
    return this.phpGet<any[]>(Api.authorArticleList, params, {
      ...option,
      _cache: true,
    })
  }
})()
