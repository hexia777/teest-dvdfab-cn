import { defineComponent, shallowRef } from 'vue'
import type { Slot } from 'vue'

function camelCase(string: string) {
  return string
    .replace(/\W+(.)/g, function (match: any, chr) {
      return chr.toUpperCase()
    })
    .replace(/\s+/g, '')
    .replace(/^(.)/, function (match: any, chr: string) {
      return chr.toLowerCase()
    })
}

// 将横线命名转大小驼峰
function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj) {
    newObj[camelCase(key)] = obj[key]
  }
  return newObj
}
export const useTemplate = () => {
  const render = shallowRef<Slot | undefined>()

  const DefineTemplate = defineComponent({
    setup(_, { slots }) {
      return () => {
        // 将复用模板的渲染函数内容保存起来
        render.value = slots.default
      }
    },
  })

  const ReuseTemplate = defineComponent({
    setup(_, { attrs, slots }) {
      return () => {
        // 还没定义复用模板，则抛出错误
        if (!render.value) {
          throw new Error('你还没定义复用模板呢!')
        }
        // 执行渲染函数，传入 attrs、slots
        const vnode = render.value({ ...keysToCamelKebabCase(attrs), $slots: slots })
        return vnode.length === 1 ? vnode[0] : vnode
      }
    },
  })
  return {
    DefineTemplate,
    ReuseTemplate,
  }
}
