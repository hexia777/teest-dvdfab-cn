import type { ArticleCategory } from '~/apis/interface/article'

export default defineNuxtRouteMiddleware(async (to) => {
  const { getArticlePageData } = useArticlePageRequest(to)
  let category = 'resource' as ArticleCategory
  if (to.name === 'topic-id') {
    category = 'topic'
  } else if (to.name === 'tips-id') {
    category = 'tips'
  } else if (to.name === 'resource-type-id') {
    category = 'resource'
  } else if (
    to.matched &&
    to.matched.length &&
    to.matched[0].components &&
    to.matched[0].components.default &&
    to.matched[0].components.default.__name === 'entry_drm_article'
  ) {
    category = 'drmdownloader'
  } else {
    console.error(`unknown router ${String(to.name)}`)
  }

  return await getArticlePageData(category)
})
