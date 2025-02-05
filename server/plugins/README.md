## 服务端插件
```javascript
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    const { req } = event.node
    const url: string | undefined = req.url
    let uri = url?.split('/')[1]

    if (url?.includes('.htm')) {
      uri = uri ? uri.split('.')[0] : ''
    } else {
      uri = uri ? uri.split('?')[0] : ''
    }

    const host: string = getHeader(event, 'host') || ''
    let locale = 'en'
    if (host.includes('de')) {
      locale = 'de'
    } else if (host.includes('ja')) {
      locale = 'ja'
    } else if (host.includes('zh')) {
      locale = 'zh'
    } else if (host.includes('fr')) {
      locale = 'fr'
    }

    response.body = modifyHtml(req, response.body, locale, uri, host)
  })
})
```