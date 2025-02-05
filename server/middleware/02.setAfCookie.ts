/**
 * Affiliate 系统（代销）过来的链接会携带 af（Affiliate ID）、ad（）、ad1（）、clientusertype（） 等参数，
 * 需要把这些参数转换成 cookie 存起来，
 * 才能做到对 Affiliate 系统的链接进行跟踪，才能给 Affiliate 结算
 */
import { newCookie } from '~/utils/cookie'

export default defineEventHandler((event) => {
  const { req, res } = event.node

  const urls = req.url?.split('?') as string[]
  if (urls.length > 1 && urls[1]) {
    const cookies = []
    const paramsArr = urls[1].split('&')
    for (const i in paramsArr) {
      const kayVal = paramsArr[i].split('=')
      const domain = req.rawHeaders[1] as string
      if (kayVal.length === 2) {
        switch (kayVal[0]) {
          case 'af':
            cookies.push(newCookie('affiliate', kayVal[1] as string, 30, domain) as string)
            break

          case 'ad':
            cookies.push(newCookie('ad', kayVal[1] as string, 180, domain) as string)
            break

          case 'ad1':
            cookies.push(newCookie('ad1', kayVal[1] as string, 180, domain) as string)
            break

          case 'clientusertype':
            cookies.push(newCookie('clientusertype', kayVal[1] as string, 30, domain) as string)
            break

          // 邮箱(暂时注释掉)
          // case 'email':
          //   cookies.push(getCookieFinalValue('email', kayVal[1] as string, 365, domain) as string)
          //   break
          //
          // case 'client_e':
          //   cookies.push(getCookieFinalValue('email', fixBase64DecodeParam(kayVal[1]), 365, domain) as string)
          //   break
          //
          // case 'client_m':
          //   cookies.push(
          //     getCookieFinalValue('elk_mac', fixBase64DecodeParam(kayVal[1]), 365, domain) as string,
          //   )
          //   break
          //
        }
      }
    }

    if (cookies.length !== 0) {
      if (res.getHeader('Set-Cookie')) {
        res.setHeader('Set-Cookie', [...cookies, ...(res.getHeader('Set-Cookie') as string)])
      } else {
        res.setHeader('Set-Cookie', cookies)
      }
    }
  }
})
