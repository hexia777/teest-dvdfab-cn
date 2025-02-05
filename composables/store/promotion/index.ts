import promotionBasicInfo from '~/config/promotion/basic_info.json'
interface State {
  productLine: string
  cookieSuffix: string
}
export const promotion = defineStore('promotion', {
  state: () => {
    return {
      productLine: 'common', // 活动产品线
      cookieSuffix: 'default', // 活动入口cookie后缀
    } as State
  },
  actions: {
    setProductLine(productLine: string) {
      if (productLine) {
        // 其他产品线映射
        productLine = productLine.toLocaleLowerCase()
        const proLineMaps = promotionBasicInfo.typeMaps as { [key: string]: string }
        if (proLineMaps[productLine]) {
          productLine = proLineMaps[productLine]
        }
        this.productLine = productLine
      }
    },
    setCookieSuffix(cookieSuffix: string) {
      if (cookieSuffix) {
        this.cookieSuffix = cookieSuffix
      }
    },
  },
  getters: {},
})
