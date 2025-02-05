export default defineNuxtRouteMiddleware(async (to) => {
  const { data: faqDetailRes } = await useApi().apiFaq.getFaqDetail(
    {
      lang: useStore.common().locale,
      route_name: to.params?.id,
    },
    { key: 'page-data' },
  )
  if (faqDetailRes.value?.cscode === 0 && faqDetailRes.value?.data) {
    faqDetailRes.value.promotion_url_type = 'faq'
    faqDetailRes.value.product_line = faqDetailRes.value?.data.category_name
  }
})
