/**
 * @description 根据操作系统获取blocksData
 * @param {Object}  blocksData
 * @returns {object}
 */
export const useBlocksDataByOs = (blocksData: any) => {
  return blocksData[useOs().value] || blocksData.win
}
