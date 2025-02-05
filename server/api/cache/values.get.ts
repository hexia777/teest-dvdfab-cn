import { cacheApi } from '~/cache/cache.js'

export default defineEventHandler(async (event) => {
  const { res } = event.node as { [key: string]: any }
  const uuid: string = '533079f8-a249-11ea-a575-02fcdc4e7412'
  const query = getQuery(event)

  if (query.t === uuid && query.url !== '/') {
    return await cacheApi(res, `/get?key=${query.url}&type=${query.type || 0}`)
  } else {
    return {
      status: 403,
      error: {
        message: 'Invalid parameter',
      },
    }
  }
})
