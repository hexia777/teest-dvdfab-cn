<script setup lang="ts">
const props = defineProps({
  // 是否懒加载
  loading: {
    type: String,
    default: 'lazy',
  },
  src: {
    type: String,
    default: '',
  },
  // 设置倍图, 如可设置 "x1 x2"
  densities: {
    type: String,
    default: 'x1',
  },
})
const hashUrlToNum = (urlcode: string) => {
  // 定义url hash 到数据
  let hash = 0
  for (let i = 0; i < urlcode.length; i++) {
    const char = urlcode.charCodeAt(i)
    hash += char
  }
  return (hash % 6) + 1 // 如果为6返回0到5的数字,c.dvdfab.cn 为转用懒加载图片
}
const newSrc = computed(() => {
  let newStr = props.src || ''
  const regex = /https:\/\/c\.dvdfab\.cn[^"'\s]*/g
  newStr = newStr.replace(regex, function (match) {
    const hash = hashUrlToNum(match)
    return match.replace('c.dvdfab.cn', `c${hash}.dvdfab.cn`)
  })
  return newStr
})
</script>

<template>
  <nuxt-img
    v-if="newSrc"
    v-bind="{ ...props, ...$attrs, src: newSrc, loading: loading ? loading as any : undefined }"
  />
</template>

<style scoped lang="less"></style>
