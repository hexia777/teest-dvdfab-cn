import accessLog from 'access-log'

export default defineEventHandler((event) => {
  const { req, res } = event.node
  accessLog(req, res, {
    format:
      // eslint-disable-next-line max-len
      ':Xip - :userID [:clfDate] ":method :host :url :protocol/:httpVersion" :statusCode :contentLength :delta ":referer" ":userAgent"',
  })
})
