export default defineNuxtPlugin(async () => {
  // eslint-disable-next-line require-await
  await useAsyncData('fixQueryParams', async (nuxtApp) => {
    delete nuxtApp?.payload?.path
    return null
  })
})
