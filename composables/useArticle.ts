import type { ArticleResource, ArticleProductInfo, ArticleCategory } from '~/apis/interface/article'

import baseConfig from '@/config/base'

type ILocale = 'en' | 'de' | 'fr' | 'ja' | 'zh'

const VITE_PACK_ENV = import.meta.env.VITE_PACK_ENV
const formatHTML = (content: string, locale: ILocale, format_img: boolean, format_iframe: boolean) => {
  // 替换
  if (
    VITE_PACK_ENV === 'company' ||
    VITE_PACK_ENV === 'home' ||
    VITE_PACK_ENV === 'dev' ||
    (process.env.LOCATION && process.env.LOCATION.includes('pre'))
  ) {
    const url = 'https://' + (baseConfig.web_domain[locale] ? baseConfig.web_domain[locale] : 'www.dvdfab.cn')
    content = content.replace(/"\/upload\//g, '"' + url + '/upload/') // 替换成绝对路径
  }

  // 清除占位标签
  content = content.replace(/(<h2>&nbsp;<\/h2>)|(<h3>&nbsp;<\/h3>)/g, '')

  // 替换文章模板 icon class名
  content = content.replace(/security_icon/g, 'icon_save')
  content = content.replace(/refund_icon/g, 'icon_30day')
  content = replaceImgWithTag(content, 'img')
  if (format_iframe) {
    // iframe 替换成 amp-iframe
    content = content.replace(/<iframe([^>]*)><\/iframe>/gi, (match, sub) => {
      return `<iframe ${sub} layout="responsive" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`
    })
  }
  content = content.replace(/<iframe([^>]*)><\/iframe>/gi, (match, sub) => {
    const re_h = /height="(.*?)"/gi
    const re_w = /width="(.*?)"/gi
    let h = 470
    let w = 860
    let paddingTop = 54.65
    if (sub.match(re_h) && sub.match(re_w)) {
      h = sub.match(re_h)[0].match(/\d+/) && sub.match(re_h)[0].match(/\d+/)[0]
      w = sub.match(re_w)[0].match(/\d+/) && sub.match(re_w)[0].match(/\d+/)[0]
      paddingTop = (h / w) * 100
    }
    const arr = sub.match(/src="(.*?)"/gi)
    let src = ''
    if (arr && arr.length > 0) {
      src = arr[0].replace('src="', '').replace('"', '')
    }
    src +=
      (src.includes('autoplay') ? '' : src.includes('?') ? '&autoplay=1' : '?autoplay=1') +
      '&loop=1' +
      (src.includes('vimeo.com') ? '&muted=1' : '') // 添加muted属性，点击以后可以自动播放
    let backgroundImage = 'https://c.dvdfab.cn/images/ico/logo.png'
    try {
      if (src.includes('youtube.com')) {
        const index = src.split('/')[4].indexOf('?')
        backgroundImage =
          'https://i.ytimg.com/vi_webp/' +
          (index > 0 ? src.split('/')[4].substring(0, index) : src.split('/')[4]) +
          '/sddefault.webp'
      } else if (src.includes('metacafe.com')) {
        const arr = src.split('/')
        const index = arr[4].indexOf('?')
        const code = index > 0 ? arr[4].substr(0, index) : arr[4]
        backgroundImage =
          'https://cdn.mcstatic.com/contents/videos_screenshots/' +
          code.substring(0, 5) +
          '000/' +
          code +
          '/830x467/1.jpg'
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }

    const srcdoc =
      // eslint-disable-next-line max-len
      "<style>*{padding:0;margin:0;overflow:hidden}img:first-child{position:absolute;top:calc(50vh - 36px);left:calc(50vw - 36px);z-index:1;}img:nth-child(2){width:100%;height:auto;position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);}</style><a href='" +
      src +
      // eslint-disable-next-line max-len
      "'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAA8FBMVEUAAAAAAADq6ur6+voAAAAuLi4GBgYAAABfX18AAAD19fUAAACenp7z8/Pw8PBOTk4REREAAAAAAAAAAADc3Nyvr69mZmZHR0cAAAAAAAAAAAAWFhYMDAwAAACjo6Nvb29sbGz8/Pzs7Ozp6emxsbFAQEAmJibQ0NDNzc3CwsK8vLyZmZkpKSkAAAAAAAAAAAAAAAAAAAAAAAAAAACgoKA7OzvHx8fFxcWAgIDm5uZYWFhUVFRLS0snJycODg4AAAAAAADl5eXY2NjExMSWlpaVlZUAAAAAAAAAAAAAAACoqKgAAACDg4MyMjIAAAD///9SmF7MAAAAT3RSTlOzAPf9Br20lMqn+7Dc+vnFt6yjgfHhy8NoR0G4tizezs3++Pbiwrvt7Ofm2rxYUU4lGxML3MDq6dP1x8fEvLZ8MfXw6NnZmolgPN+g0757xSwr/gAAA8RJREFUeAGtmGdT21oXhVdUJKsIW+7YuBcKpmBsTIeXlwtJSLL+/7+5xxLMBaxyRPx8Y0bzDPvI2mfvhW8JHG9+/2O++ID/Yv75vnmc9GysaHp0Z+ET1t3RNJtIazwjGqfU0KRFpwdFBOgdd7es2KStlHfdjo6A4sGplEg7DEu6rCj8hFK5DEs81NJFrScIxu6AkQzcMQRPrRSRVg9KqqhcYp/td2vjAlAY17r7ZzaXqJWgxLqWJDoxARRmvaCO9rWBDxjX7QEFvVkBgHkSL7q3AFQVCrZzBiIwctsUKFUA1n2cqOEAWz8p2MkjlvwOBT+3AKcRLdoEMHkg2e8gkU6f5MMEwGaU6IcDjPok95pIoblHsj8CnB+ropYD1DxS/QUJfqmkVwOc1mfRiQXMbdK+ghR5j7TngHXyUaSZwFghN0aQZLRBKmPA1D6I6sBtmbRHkGZkk+VboP5e1AJQIdUrZOBKJYcAWu9EJlAleY5MnJOsAuZ/okOgoJB7yMgeqRSAwzfRqQXMSKWJjDQVcgZYp6+iA0DvkVVkpkr2dOAgFGnF4KR38AV2gvMuaoGoAdyoZB5fIE+qN0AjEJUAl9zGl9gmXaC0FE0dGBtkDqv8X0caOXLDgDMVoqO3v1ah+s8WEgn+h0vgSIhKwVG3EQHJ/+WQTJusACUh8oFBzFFzSUp9eXIA+BqOAZ20jVhRSn2GTeoQmk2gQ54hXpRS3xnZgdDUAZfcTxCl1LdPuhCaErBLdlNECfV1yV3gDibwQNZSRAn11cgyYKIYvLRxiiihvjHZB4rwAY8spIgS6iuQNuBDoJJIESXVRxICJ5PoYlVkvIqsLKU9RpTWfC3tRf6wFzoimISHLf/6L1Jev+wP8jH5B1lCHZilfyKL1E9E6qO9kPloJdrIY2Ib8V7biOYDSlJjW6Q2NgXwtbRWeyHbalOa/6NM88+FzX+K2OtoIXsdYSpE356B2V9ekM9vV/ZkLVe2VgSG6xgi/nKs+Q0cvBu02l8dtNqAdbqu0W/9w2gwHg+zjsf5t/E4YmD35pBm7kUM7MEKMdnIskLMl09PAFNbXWpGWZeaUbDUxK1ZUid+HrtmhYvfXJFf/JR5sPjFraJlkv0uEun2SZZjV1HZ5fh6h4LhLeA0pNZ1RCK1rr8FCO0eBYPZaoDghgFCOwwQJCKNocol3kJEGnrTMJq6iDQWHpeow99hpCEVsty4CiNR3BsInu7XHvvIB1F9mz3vQjqIyh6NyYd1JR+f8EtZw7oQTcSHd2bRB/yieSfiQy3h4X8BIjMI7XNyKGoAAAAASUVORK5CYII=' alt='Play'><img src='" +
      backgroundImage +
      "' alt='Thumbnail'></a>"

    return `<div style="margin: 0 auto;width: 100%;position: relative;max-width: ${w}px;
    padding-top: ${paddingTop}%;"><iframe
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        srcdoc="${srcdoc}"
        style="width: 100%;height: 100%;position: absolute;top: 50%;left: 50%;
        transform: translateX(-50%) translateY(-50%);" ${sub.replace(
          'sandbox="allow-scripts allow-same-origin allow-popups"',
          '',
        )}></iframe></div>`
  })

  return content || ''
}

const findDep = (node: any[] = [], first = false) => {
  let directoryHTML = ''
  for (const item of node) {
    directoryHTML += '<ul class="' + (first ? 'first' : '') + '">'
    directoryHTML +=
      '<li class="directory-li"><a class="directory-link" href="#' +
      item.hid +
      '">' +
      item.content +
      '</a>' +
      (item.nodes && item.nodes.length && first
        ? '<i class="directory-arrow-i iconfont-sg icon-arrow_line_dwon sid-open-n" ></i>'
        : '') +
      '</li>'
    if (item.nodes) {
      directoryHTML += '<li class="no-list-style">' + findDep(item.nodes) + '</li>'
    }
    directoryHTML += '</ul>'
  }
  return directoryHTML
}

const handleArticleContent = (content: string, locale: ILocale, catalog: any, directoryTitle: string) => {
  // 处理目录
  if (content.includes('{{DIRECTORY}}')) {
    let directoryHTML = ''
    if (typeof catalog !== 'string') {
      directoryHTML =
        '<div class="directory-list"><p class="title" id="table-tit">{{directory-title}}' +
        '<i class="directory-arrow-i iconfont-sg icon-arrow_line_dwon table-tit-icon cont-open-n"></i>' +
        '</p>' +
        findDep(catalog, true) +
        '</div>'
    }
    content = content.replace('{{DIRECTORY}}', directoryHTML)
  }
  content = formatHTML(content, locale, true, true)

  content = content.replace('{{directory-title}}', directoryTitle)
  return content
}

/**
 * @function replaceImgWithTag
 * @description 将img标签替换为自定义标签
 * @param html
 * @param newTagName
 */
export const replaceImgWithTag = (html: string, newTagName: string) => {
  // 正则表达式匹配 img 标签及其属性
  const imgRegex = /<img\s+([^>]*)>/gi

  const replacer = (match: any, attrs: string) => {
    const srcMatch = attrs.match(/src="([^"]+)"/)
    const src = srcMatch ? srcMatch[1] : ''
    const srcset = `${src} 1x, ${src} 2x`

    // 获取width
    const widthMatch = attrs.match(/width="([^"]+)"/)
    const width = widthMatch ? widthMatch[1] : '700'
    // 获取height
    const heightMatch = attrs.match(/height="([^"]+)"/)
    const height = heightMatch ? heightMatch[1] : '400'

    return `<${newTagName} ${attrs} data-class="1" width="${width}" height="${height}" 
    onError="this.setAttribute('data-error', 1)"  loading="lazy" srcset="${srcset}" data-nuxt-img="">`
  }

  return html.replace(imgRegex, replacer)
}
export const useArticlePageRequest = (route: any) => {
  const locale = useStore.common().locale
  // const articleCategory = ref()
  // const apiParams = ref({})
  const getArticlePageData = async (category: ArticleCategory) => {
    let params: any = {
      url: route.params?.id,
      // url: route.name.replace(/_/g, '-'),
      lang: locale,
    }
    if (category === 'resource') {
      const type = route.params?.type || ''
      params.type = type.replace(/-/g, '_')
    }
    if (category === 'drmdownloader') {
      params.type = 'downloader'
    }
    if (category === 'topic') {
      params = {
        url: route.params?.id,
        lang: locale,
        len: 2,
        product_url: category,
      }
    }
    if (category === 'tips') {
      const v = route.query?.ver
      if (v) {
        params.v = decodeURIComponent(v)
      }
    }

    const { data: articleRes } = await useApi().apiArticle.getArticleDetailNew(category, params, {
      key: 'page-data',
    })
    // console.log('articleRes=================================articleRes', articleRes.value)
    if (
      !articleRes.value ||
      !articleRes.value.data ||
      !articleRes.value.data.resource ||
      !articleRes.value.data.resource.content
    ) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
    const { resource, product_info } = articleRes.value?.data ?? {}
    if (
      product_info &&
      product_info[resource.product + ''] &&
      product_info[resource.product + ''].product_line
    ) {
      articleRes.value.product_line = product_info[resource.product + ''].product_line
    }
    articleRes.value.promotion_url_type = 'article'
  }
  return {
    getArticlePageData,
  }
}
export const useArticlePage = () => {
  const state = reactive<any>({})
  const locale = useStore.common().locale
  const { data: articleRes } = useNuxtData('page-data')
  const { resource, product_info } = articleRes.value?.data ?? {}

  const directoryTitle = useI18n().value.article.catalog
  if (resource && resource.content) {
    resource.content = handleArticleContent(resource.content, locale, resource.catalog, directoryTitle)
  }
  const { recommend_products, category_article, recommend_article_list, related_tips, related_resource } =
    articleRes.value?.data ?? {}
  return {
    ...toRefs(state),

    recommendProducts: (recommend_products || []) as object[],
    categoryArticle: (category_article || []) as object[],
    resource: resource as ArticleResource,
    productInfo: product_info as ArticleProductInfo,
    recommendArticleList: (recommend_article_list || []) as object[],
    relatedTips: (related_tips || []) as object[],
    relatedResource: (related_resource || []) as object[],

    // getArticlePageData,
  }
}

/** 文章目录动效相关 start */
const expandAnimation = function (e: any) {
  // 当前h2标题下面的h3
  // const h3Containers = e.target.offsetParent.parentNode.getElementsByClassName('no-list-style')[0]
  const h3Containers = e.target.getElementsByClassName('no-list-style')[0]
  const directoryLi = e.target.getElementsByClassName('directory-li')[0]
  if (!h3Containers || !h3Containers.childNodes) {
    return
  }
  const totalHeight =
    h3Containers &&
    h3Containers.childNodes &&
    Array.from(h3Containers.childNodes).reduce((prev, next: any) => {
      return prev + next.clientHeight
    }, 0)

  h3Containers.style.height = `${totalHeight}px` // 盒子总高=元素高度*元素数量
  if (directoryLi) {
    const directoryArrowI = directoryLi.querySelector('.directory-arrow-i') // 箭头 所在行
    if (directoryArrowI) {
      directoryArrowI.className = directoryArrowI?.className.replace(/sid-open-n/, 'sid-close-n')
    }
  }
}

const closeAnimation = (e: any) => {
  // 当前h2标题下面的h3
  // const h3Containers = e.target.offsetParent.parentNode.getElementsByClassName('no-list-style')[0]
  const h3Containers = e.target.getElementsByClassName('no-list-style')[0]
  const directoryLi = e.target.getElementsByClassName('directory-li')[0]
  // const isExpand = !e.target.classList.contains('sid-open-n') // true:已展开
  if (!h3Containers || !h3Containers.childNodes) {
    return
  }

  h3Containers.style.height = '0' // 盒子总高=元素高度*元素数量
  if (directoryLi) {
    const directoryArrowI = directoryLi.querySelector('.directory-arrow-i') // 箭头 所在行
    if (directoryArrowI) {
      directoryArrowI.className = directoryArrowI?.className.replace(/sid-close-n/, 'sid-open-n')
    }
  }
}

const expandTableOfContent = () => {
  const tableCON = document.getElementById('table-tit') as any
  const tableUL: any = document.querySelectorAll('.first')
  const titleArrow = tableCON.querySelector('.table-tit-icon') as any

  if (!tableCON) {
    return
  }
  const isExpand = !titleArrow?.classList.contains('cont-open-n')

  for (let j = 0; j < tableUL.length; j++) {
    if (isExpand) {
      tableUL[j].style.height = 'auto'
      titleArrow.className = titleArrow?.className.replace(/cont-close-n/, 'cont-open-n')
    } else {
      tableUL[j].style.height = 0
      titleArrow.className = titleArrow?.className.replace(/cont-open-n/, 'cont-close-n')
      tableUL[j].style.overflow = 'hidden'
    }
  }
}

// 文章目录标题展开收起交互
const handleArticleExpand = () => {
  const tableCON = document.getElementById('table-tit')
  const parentDom = document.querySelectorAll('.directory-list')[0]
  if (!parentDom && !tableCON) {
    return
  }
  if (parentDom) {
    // const arrowDoms = parentDom.querySelectorAll('.directory-arrow-i') // 箭头 所在行
    const arrowDoms = parentDom.querySelectorAll('.directory-li') // 箭头 所在行

    for (let i = 0; i < arrowDoms.length; i++) {
      arrowDoms?.[i]?.parentNode?.addEventListener('mouseenter', expandAnimation)
      arrowDoms?.[i]?.parentNode?.addEventListener('mouseleave', closeAnimation)
    }
  }
  if (tableCON) {
    tableCON.addEventListener('click', expandTableOfContent)
  }
}

// 移除箭头点击事件监听
const handleEventArticleRemove = () => {
  const tableCON = document.getElementById('table-tit')
  if (!tableCON) {
    return
  }
  tableCON.removeEventListener('click', expandTableOfContent)
  const parentDom = document.querySelectorAll('.directory-list')[0]
  if (!parentDom) {
    return
  }
  const arrowDoms = parentDom.querySelectorAll('.directory-li') // 箭头 所在行
  for (let i = 0; i < arrowDoms.length; i++) {
    arrowDoms[i].removeEventListener('mouseenter', expandAnimation)
    arrowDoms[i].removeEventListener('mouseleave', closeAnimation)
  }
}

// 文章目录标题展开收起交互
export const useHandleArticleExpand = () => {
  onMounted(() => {
    nextTick(() => {
      if (useStore.common().mobile) {
        setTimeout(() => {
          handleArticleExpand()
        }, 1000)
      } else {
        handleArticleExpand()
      }
    })
  })

  onBeforeUnmount(() => {
    handleEventArticleRemove()
  })
}

/** 文章目录动效相关 end */

const ArticleAuthors: any = {
  de: ['jasmin', 'sammi', 'vesna', 'luisa', 'stephanie', 'christine', 'mia', 'emilia', 'marcia', 'erika'],
  fr: ['wk', 'zs', 'ambre', 'gabrielle', 'marcia', 'erika'],
  ja: [
    'kinkin',
    'lan',
    'nabei',
    'okawareiko',
    'tetsuko',
    'riko',
    'ushin',
    'higa',
    'melody',
    'nazo',
    'rai',
    'yuriko',
    'marcia',
    'erika',
  ],
  zh: ['roy', 'marcia', 'erika'],
  other: [
    'alice',
    'jacob',
    'mark',
    'diana',
    'amber',
    'nicole',
    'jessie',
    'echo',
    'lucas',
    'john',
    'erika',
    'phoebe',
    'wenny',
    'marcia',
  ],
}
export const useAuthorAvatarByAuthorName = (authorName: string, locale: any) => {
  if (!authorName) {
    return `https://c.dvdfab.cn/images/article/author/default.png`
  }
  const lowerCaseName = authorName.toLowerCase()
  const langAuthors = ArticleAuthors[locale] || ArticleAuthors.other
  if (langAuthors.includes(lowerCaseName)) {
    return `https://c.dvdfab.cn/images/article/author/${locale}/${lowerCaseName}.png`
  }
  return `https://c.dvdfab.cn/images/article/author/default.png`
}
