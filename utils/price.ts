/**
 * @function translatePrice
 * @param price
 * @param currency
 * @param locale
 */
export function translatePrice(price: number | string, currency?: string, locale?: string): string | number {
  const lang = locale || useStore.common().locale
  const _currency = currency || useStore.product().currency[lang][1]
  const langArr = ['de', 'fr']
  if (!price) {
    return price
  }

  let outputPrice = ''

  const reg = /(<[a-zA-Z]+.*?>)([\s\S]*?)(<\/[a-zA-Z]*?>)/

  let priceNum = price as any
  if (reg.test(<string>price)) {
    priceNum = price.match(reg)[2]
  }

  if (!/,/.test(priceNum)) {
    // 价格中不含逗号
    priceNum = priceNum ? Number(priceNum) : priceNum

    // 日语进位处理
    if (lang === 'ja') {
      /** 近似规则：个位数取整后再做一次判断，使最后个位数统一为0。最后一位数四舍五入取整
       ≥5的向上进位尾数变成0；
       <5的向下舍位尾数变成0。

       例如：
       8023.3——8023——8020
       8024.9——8025——8030
       ***/
      priceNum = priceNum.toFixed(0)
      const num = priceNum % 10
      priceNum = num >= 5 ? +priceNum + (10 - num) : priceNum - num
    } else {
      priceNum = priceNum ? (Math.round(priceNum * 100) / 100).toFixed(2) : priceNum
    }
    // 处理9.90 转成9.9
    if (priceNum < 10) {
      priceNum = +priceNum
    }

    if (langArr.includes(lang)) {
      // de, fr
      priceNum = String(priceNum)
      if (reg.test(<string>price)) {
        const temp = priceNum.replace('.', ',')
        outputPrice = String(price).replace(reg, '$1' + temp + '$3') + _currency
      } else {
        outputPrice = priceNum.replace('.', ',') + _currency
      }
    } else {
      // !de, fr
      priceNum = String(priceNum)
      if (reg.test(<string>price)) {
        outputPrice = _currency + String(price).replace(reg, '$1' + priceNum + '$3')
      } else {
        outputPrice = _currency + priceNum
      }
    }
  } else {
    // 价格中含逗号
    // eslint-disable-next-line no-lonely-if
    if (langArr.includes(lang)) {
      // de, fr
      priceNum = String(priceNum)
      if (reg.test(<string>price)) {
        outputPrice = String(price).replace(reg, '$1' + priceNum + '$3') + _currency
      } else {
        outputPrice = priceNum + _currency
      }
    }
  }

  return outputPrice
}
