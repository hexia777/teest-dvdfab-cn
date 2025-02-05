<script setup lang="ts">
defineOptions({ name: 'HIconTextsList' })
const props = defineProps({
  // 外框class
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  // 大标题
  title: {
    type: String,
    default: '',
  },
  product: {
    type: Object,
    default: () => {
      return {}
    },
  },
  items: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const macData = useAttrs().macData || props
const targetProduct = computed(() => {
  return (
    props.product.filter((item: any) => {
      return item.system === useOs().value
    })[0] ||
    props.product[0] ||
    {}
  )
})

const systemRequirement = computed(() => {
  const data: any = useOs().value === 'mac' ? macData : props

  if (data.items && data.items.length) {
    return data.items
  }
  return targetProduct.value.client_info?.data?.attributes?.systemRequirement || []
})
</script>

<template>
  <div class="block-box" :class="[blockClass.value]">
    <BaseContainer>
      <h2 class="font-s-40 mb-40 text-center" v-html="title"></h2>
      <ul v-if="systemRequirement && systemRequirement.length" class="m-a max-w-screen-sm">
        <li v-for="(item, index) in systemRequirement" :key="index">
          <i class="iconfont-sg icon-star"></i>
          <span v-if="item.value" class="ml-5" v-html="item.value"></span>
        </li>
      </ul>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less"></style>
