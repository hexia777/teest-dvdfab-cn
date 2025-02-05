const apiCommon = useApi().apiCommon

export const useCommonPageData = async (params: any) => {
  const { data: pageRes, error } = await apiCommon.getCommonPageData(params)
  if (error.value) {
    throw createError({ statusCode: 500, statusMessage: 'Server Error' })
  }

  if (pageRes.value && pageRes.value.data.length && pageRes.value.data[0].attributes) {
    let blocks = pageRes.value.data[0].attributes.blocks
    if (blocks) {
      blocks = formatBlocksData(blocks)
    }
    return { ...pageRes.value.data[0].attributes, blocks }
  }
  return {}
}
