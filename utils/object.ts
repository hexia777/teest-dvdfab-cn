/**
 * @function deepCopy
 * @description 深拷贝
 * @export
 * @returns
 * @param data
 */
// 深拷贝数据
export const deepCopy = (data: any): any => {
  // string,number,bool,null,undefined,symbol
  // object,array,date
  if (data && typeof data === 'object') {
    // 针对函数的拷贝
    if (typeof data === 'function') {
      const tempFunc = data.bind(null)
      tempFunc.prototype = deepCopy(data.prototype)
      return tempFunc
    }

    switch (Object.prototype.toString.call(data)) {
      case '[object String]':
        return data.toString()
      case '[object Number]':
        return Number(data.toString())
      case '[object Boolean]':
        return Boolean(data.toString())
      case '[object Date]':
        return new Date(data.getTime())
      case '[object Array]':
        // eslint-disable-next-line no-case-declarations
        const arr: any[] = []
        for (let i = 0; i < data.length; i++) {
          arr[i] = deepCopy(data[i])
        }
        return arr

      // js自带对象或用户自定义类实例
      case '[object Object]':
        // eslint-disable-next-line no-case-declarations
        const obj: { [k: string]: any } = {}
        for (const key in data) {
          // 会遍历原型链上的属性方法，可以用hasOwnProperty来控制 （obj.hasOwnProperty(prop)
          obj[key] = deepCopy(data[key])
        }
        return obj
    }
  } else {
    // string,number,bool,null,undefined,symbol
    return data
  }
}

/**
 * @function isObject
 * @description 判断是否为对象
 * @param obj
 */
export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断值类型
 * @param val 需判断类型的值
 * @return string (type值: string | number | boolean | object | array | undefined | null
 * | function | symbol | regExp | date)
 */
export const getValType = (val: any): string => {
  const typeFull = Object.prototype.toString.call(val) || ''
  const regex = /\s+(\w+)/
  const matchResult = typeFull.match(regex)
  const typeStr = matchResult && matchResult[1] ? matchResult[1] : ''
  const type = typeStr ? typeStr.toLowerCase() : ''

  return type
}

/**
 * 判断所给值是否为空
 */
export const isEmpty = (value: any): boolean => {
  if (!value) {
    return true
  }

  // 空对象
  if (
    (getValType(value) === 'object' && !Object.getOwnPropertyNames(value).length) ||
    (Object.getOwnPropertyNames(value).length && Object.getOwnPropertyNames(value)[0] === '__ob__')
  ) {
    return true
  } else if (getValType(value) === 'array' && !value.length) {
    // 空数组
    return true
  } else if (
    getValType(value) === 'string' &&
    (value === 'null' ||
      value === 'undefined' ||
      value === 'false' ||
      value === 'NaN' ||
      value === '0' ||
      value === '[]' ||
      value === '{}')
  ) {
    // 空字符串
    return true
  }

  return false
}
