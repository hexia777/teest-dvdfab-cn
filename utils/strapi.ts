/**
 * @description 格式化block数据
 * @param {Array} blocks
 * @returns {Array}
 */
export const formatBlocksData = (blocks: any[]): any[] => {
  blocks.forEach((item: any) => {
    const componentDir = item.__component
      .split('.')[0]
      .replace(/-(\w)/g, (all: string, letter: string) => letter.toUpperCase())
      .replace(/^\w/, (c: string) => c.toUpperCase())

    const componentFileName = item.__component
      .split('.')[1]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .replace(/-(\w)/g, (all: string, letter: string) => letter.toUpperCase())
      .replace(/^\w/, (c: string) => c.toUpperCase())

    item.component_dir = componentDir
    item.component_file_name = componentFileName
  })

  return blocks
}

/**
 * @description 格式化block数据, 删除为 null 的 key，并添加 id 属性，值为 anchorId
 * @param {Array} blocks
 * @returns {Array}
 */
export const removeBlocksDataNullKey = (item: { [key: string]: any }): any => {
  const blockItem = JSON.parse(JSON.stringify(item))

  // 删除为 null 的 key
  Object.keys(blockItem).forEach((itemKey: string) => {
    if (!blockItem[itemKey]) {
      delete blockItem[itemKey]
    }
  })

  if (blockItem.anchorId) {
    blockItem.id = blockItem.anchorId
  }
  return blockItem
}

/**
 * @description 获取strapi attributes 数据
 * @param {Object}  data
 * @returns {Object}
 */
export const getStrapiData = (data: any) => {
  return data?.data?.attributes || data?.attributes || data
}

export const convertStrapiLocalesToObject = (data: any[]) => {
  if (!data || !data.length) {
    return {}
  }
  const result = {} as { [k: string]: any }
  data.forEach((item: any) => {
    result[item.key] = item.value
  })
  return result
}

export const dynamicComponent = (componentDir: string, componentFileName: string) => {
  return defineAsyncComponent({
    loader: () => {
      return import(`~/components/blocks/${componentDir}/${componentFileName}.vue`).catch((err) => {
        console.error(err)
        return h('div')
      })
    },
  })
}
