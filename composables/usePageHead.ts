import type { Seo } from '~/apis/interface/seo'
import { routes as languageLimitedRoutes } from '~/config/redirect/languageLimitedRoutes'
import { routes as productSpecialRoutes } from '~/config/route/productSpecialRoutes'
import { pages as noindexPages } from '~/config/seo/noindex_pages'
import { pages as rating_pages } from '~/config/ratingPages'

// 全局head
const script = () => {
  const lang = useStore.common().locale as 'en'
  const script: any[] = [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${useAppConfig().ga_ids[lang]}`,
      async: true,
      tagPriority: 9999,
    },
    {
      innerHTML: ` window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${useAppConfig().ga_ids[lang]}');
      gtag('config', 'AW-663387220');`, // AW-663387220 谷歌广告追踪,且订单信息添加给谷歌广告
      tagPriority: 10000,
    },
  ]

  return script
}

const link = () => {
  const routeName = useRoute().name as string
  // 特殊产品页路由
  let isSpecialProduct = false
  let defaultRoute = ''
  if (productSpecialRoutes[routeName]) {
    defaultRoute = routeName
    isSpecialProduct = true
  } else {
    for (const route in productSpecialRoutes) {
      if (Object.values(productSpecialRoutes[route]).includes(routeName)) {
        defaultRoute = route
        isSpecialProduct = true
        break
      }
    }
  }
  const alternate: any[] = []
  // 动态路由和语种不全的页面不加hreflang, 特殊产品页除外
  if (!(languageLimitedRoutes[routeName] || routeName?.includes('-')) || isSpecialProduct) {
    const locales = useStore.common().locales
    for (const locale of locales) {
      let path = isSpecialProduct ? `/${defaultRoute.replace(/_/g, '-')}.htm` : useRoute().path
      if (isSpecialProduct && productSpecialRoutes[defaultRoute][locale]) {
        path = `/${productSpecialRoutes[defaultRoute][locale].replace(/_/g, '-')}.htm`
      }
      if (locale === 'en') {
        alternate.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: 'https://' + useAppConfig().web_domain.en + path,
        })
      }
      // 语种不全的页面不加hreflang
      alternate.unshift({
        rel: 'alternate',
        hreflang: locale === 'zh' ? 'zh-Hant' : locale,
        href: 'https://' + (useAppConfig().web_domain as Record<string, string>)[locale] + path,
      })
    }
  }

  const result = [
    {
      rel: 'canonical',
      href: useRequestURL().origin + useRoute().path,
    },
  ]

  if (useRoute().name !== 'resource-detail') {
    return result.concat(alternate)
  }

  return result
}

export const usePageHead = () => {
  const locale = useStore.common().locale
  return useHead({
    htmlAttrs: {
      lang: locale,
      class: `lang-${locale}`,
    },
    script: script(),
    link: link(),
  })
}

const hashUrlToNum = (urlcode: string) => {
  // 定义url hash 到数据
  let hash = 0
  for (let i = 0; i < urlcode.length; i++) {
    const char = urlcode.charCodeAt(i)
    hash += char
  }
  return (hash % 6) + 1 // 如果为6返回0到5的数字,c.dvdfab.cn 为转用懒加载图片
}
const cdnNumChange = (href: string) => {
  let newStr = href
  const regex = /https:\/\/c\.dvdfab\.cn[^"'\s]*/g
  newStr = newStr.replace(regex, function (match) {
    const hash = hashUrlToNum(match)
    return match.replace('c.dvdfab.cn', `c${hash}.dvdfab.cn`)
  })
  return newStr
}

export const usePageOtherHead = (pageHead: { [key: string]: any }) => {
  if (pageHead?.script) {
    for (const item of pageHead?.script) {
      if (item.src) {
        item.src = cdnNumChange(item.src)
      }
    }
  }
  if (pageHead?.link) {
    for (const item of pageHead?.link) {
      if (item.href) {
        item.href = cdnNumChange(item.href)
      }
    }
  }
  if (pageHead?.noscript) {
    for (const item of pageHead?.noscript) {
      if (item.src) {
        item.src = cdnNumChange(item.src)
      }
    }
  }
  return useHead({
    link: [...(pageHead?.link || [])],
    script: [...(pageHead?.script || [])],
    noscript: [...(pageHead?.noscript || [])],
  })
}

export const usePageSeo = (seoData: Seo) => {
  if (seoData) {
    const structuredDataScript = []
    if (Array.isArray(seoData.structuredData)) {
      for (const item of seoData.structuredData) {
        structuredDataScript.push({
          type: 'application/ld+json',
          innerHTML: item,
        })
      }
    } else if (seoData.structuredData && JSON.stringify(seoData.structuredData) !== '{}') {
      structuredDataScript.push({
        type: 'application/ld+json',
        innerHTML: seoData.structuredData,
      })
    }
    const locale = useStore.common().locale
    const _head: Array<any> = []
    // noindex
    if (noindexPages[useRoute().path] && noindexPages[useRoute().path].includes(locale)) {
      _head.push({
        hid: 'robots',
        name: 'robots',
        content: 'noindex',
      })
    }
    return useHead({
      title: seoData.title,
      meta: [
        {
          name: 'description',
          content: seoData.metaDescription,
        },
        // {
        //   name: 'keywords',
        //   content: seoData.keywords,
        // },
        ..._head,
        ...(seoData.meta || []),
      ],
      script: [...structuredDataScript, ...(seoData.script || [])],
    })
  }
}

const handleArticleStructureData = (resource: any) => {
  const url = useRequestURL()
  const first_img_src = 'https://c.dvdfab.cn/images/article/streamfab_img.jpg'
  return {
    '@context': 'http://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.origin + url.pathname,
    },
    headline: resource.title,
    author: {
      '@type': 'Person',
      name: resource.author,
    },
    dateModified: resource.time,
    datePublished: resource.create_time,
    publisher: {
      '@type': 'Organization',
      name: 'StreamFab',
      logo: {
        '@type': 'ImageObject',
        url: 'https://c.dvdfab.cn/images/article/article_favicon.png',
        width: 16,
        height: 16,
      },
    },
    image: {
      '@type': 'ImageObject',
      url: first_img_src,
      height: 1200,
      width: 1200,
    },
  }
}

export const useArticlePageHead = (resource: any) => {
  const locale = useStore.common().locale
  const route = useRoute()
  const url = useRequestURL()
  const shareUrl = url.origin + url.pathname
  const content = resource.content
  // 第一个图片处理
  // "\"/upload/drmdownloader/best-kung-fu-movies-on-netflix-pJA0.jpeg\""
  const matchsSrc = content.match(/<img.+? src="(.+?)"/) || []
  const matchsWidth = content.match(/<img.+? width="(.+?)"/) || []
  const matchsHeight = content.match(/<img.+? height="(.+?)"/) || []
  const firSrc = matchsSrc && matchsSrc.length >= 2 ? matchsSrc[1] : ''
  const imgWd = matchsWidth && matchsWidth.length >= 2 ? matchsWidth[1] : ''
  const imgHt = matchsHeight && matchsHeight.length >= 2 ? matchsHeight[1] : ''

  const structuredData = handleArticleStructureData(resource)
  let rating = {}
  if (locale === 'ja' && rating_pages.includes(route.path)) {  // TODO: 由 CMS 侧维护
    rating = {
      name: 'rating',
      content: 'adult',
    }
  }
  const description = resource.description || ''
  const meta = [
    rating,
    {
      hid: 'description',
      name: 'description',
      content: description,
    },
    { property: 'og:site_name', content: 'DVDFab' },
    { property: 'og:image', content: firSrc },
    { property: 'og:image:width', content: imgWd },
    { property: 'og:image:height', content: imgHt },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: resource.title },
    { property: 'og:url', content: shareUrl },
    { property: 'og:description', content: description },
  ]

  if (resource.keywords) {
    meta.push({
      hid: 'keywords',
      name: 'keywords',
      content: resource.keywords || '',
    })
  }
  return useHead({
    title: resource.title,
    meta,

    script: [{ type: 'application/ld+json', innerHTML: structuredData }],
    // link: link(),
  })
}
