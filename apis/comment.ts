import type { CommentCreateParams, CommentListParams, CommentResultModel } from './interface/comment'
import Http from '~/utils/request'

enum Api {
  comment = '/comments',
}

export default new (class Comment extends Http {
  public getCommentData(params: CommentListParams, option?: any) {
    return this.get<CommentResultModel>(
      Api.comment,
      {
        'populate[reply][populate]': '*',
        ...params,
      },
      option,
    )
  }

  public addCommentData(params: CommentCreateParams, option?: any) {
    return this.post<CommentResultModel>(Api.comment, params, option)
  }
})()
