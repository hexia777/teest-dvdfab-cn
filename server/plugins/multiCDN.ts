export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const cdnIndex = (url: string) => {
      // 使用字符 ASCII 码累加计算 Hash 值
      let hash = 0
      for (let i = 0; i < url.length; i++) {
        const char = url.charCodeAt(i)
        hash += char
      }

      return (hash % 6) + 1
    }

    const regex = /https:\/\/c\.dvdfab\.cn[^"'\s]*/g
    response.body = response.body.replace(regex, (match: string) => {
      /* 
      将 https://c.dvdfab.cn 的资源均摊到多个 CDN
      <link data-n-head="ssr" rel="preconnect" href="https://c.dvdfab.cn">
      <link rel="stylesheet" href="https://c.dvdfab.cn/dist/202404/_nuxt3/entry.BIYtrWJj.css">
      <link rel="modulepreload" as="script" crossorigin href="https://c.dvdfab.cn/dist/202404/_nuxt3/BnHL7H-O.js">
      <img srcset="https://c.dvdfab.cn/media/banner_dvdfab_en_deb405926b.png 1x" src="https://c.dvdfab.cn/media/banner_dvdfab_en_deb405926b.png" />
      <script src="https://c.dvdfab.cn/wow/wow.js" async></script>
      */       
      if (
        match === 'https://c.dvdfab.cn' || 
        match.includes('/_nuxt3/')
      ) {
        // _nuxt3 下面的系统 css 及 js 暂不替换，替换后在客户端仍会再次加载，出现问题
        return match
      }

      const idx = cdnIndex(match)
      return match.replace('c.dvdfab.cn', `c${idx}.dvdfab.cn`)
    })
  })
})
