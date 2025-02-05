export default defineNuxtRouteMiddleware(async (to) => {
  const { getPageData } = useProductPageRequest(to)
  return await getPageData()
})
