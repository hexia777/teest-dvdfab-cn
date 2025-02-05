export default function getComponentsName(label: string, labelLink = false): string {
  if (!label) {
    console.warn('param label is required')
    return ''
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { proxy: ctx } = getCurrentInstance()

  if (!ctx) {
    console.error('Component context is not defined')
    return ''
  }

  // label是否是链接
  if (labelLink) {
    // 删除参数、删除第一个/，删除最后一个/、删除锚点、删除后缀
    label = label
      .replace(/\?.*$/, '')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/#.*$/, '')
      .replace(/\..*$/, '')
  }
  // 大写字母转为下划线分割，然后转为小写, 如：myComponent => my_component
  label = label
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')

  let parent = ctx.$parent
  const componentsName = []

  while (parent) {
    if (parent?.name === 'default') {
      break
    }
    if (
      parent?.$options?.name &&
      !parent.$options.name.startsWith('El') &&
      parent.$options.name !== 'AsyncComponentWrapper'
    ) {
      componentsName.push(parent.$options.name)
    }
    parent = parent.$parent
  }

  if (ctx.$options?.name) {
    componentsName.push(`${ctx.$options.name}_${label}`)
  } else {
    componentsName.push(label)
  }

  // 以大写字母开头的转为下划线分割，如：MyComponent => my_component，然后转为小写
  componentsName.forEach((name, index) => {
    componentsName[index] = name.replace(/-/g, '_')
  })

  return componentsName.join('_')
}
