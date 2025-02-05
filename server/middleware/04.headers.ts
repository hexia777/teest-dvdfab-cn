/**
 * 限制同源策略，防止被嵌入到其他网站
 */
export default defineEventHandler((event) => {
  const { res } = event.node
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
})
