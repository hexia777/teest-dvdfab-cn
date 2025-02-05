// stub - block nuxt getSSRProps error
export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('track', {})
  vueApp.directive('track-label', {})
})
