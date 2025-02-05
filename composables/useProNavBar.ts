export const useProNavBar = () => {
  const locales = useI18n().value

  // 锚点列表
  const proNavList = [
    {
      href: '#overview',
      id: 'overview',
      label: locales.common.overview,
      event_label: 'overview',
      hide: false,
    },
    {
      href: '#features',
      id: 'features',
      label: locales.common.features,
      event_label: 'features',
      hide: false,
    },
    {
      href: '#guide',
      id: 'guide',
      label: locales.common.guide,
      event_label: 'guide',
      hide: false,
    },
    {
      href: '#tech_specs',
      id: 'tech_specs',
      label: locales.common.tech_specs,
      event_label: 'tech_specs',
      hide: false,
    },
  ]

  const state = reactive<{
    proNavList: any[]
    isFixed: boolean
  }>({
    proNavList,
    isFixed: false,
  })

  return {
    ...toRefs(state),
  }
}
