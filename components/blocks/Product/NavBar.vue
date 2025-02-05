<script setup lang="ts">
defineOptions({ name: 'ProNavBar' })

// // 数组对象取交集
// function getArrIntersection(arr1: Array<object>, arr2: Array<object>, key1: string, key2: string) {
//   if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
//     return []
//   }
//   return arr1.filter((item1: any) => {
//     return arr2.some((item2: any) => {
//       return item1[key1] === item2[key2]
//     })
//   })
// }

// const props = defineProps({
//   items: {
//     type: Array<any>,
//     default: () => [],
//   },
//   blockClass: {
//     type: Object,
//     default: () => ({
//       value: '',
//     }),
//   },
// })
// const isMobile = useStore.common().mobile
// const { proNavList } = useProNavBar()
// // 根据产品信息过滤当前页面锚点数据
// const _proNavList: any = computed(() => {
//   const newArr = getArrIntersection(proNavList.value, props.items, 'id', 'value') || []
//   return newArr
// })
</script>

<template>
  <div></div>
</template>
