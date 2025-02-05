<script setup lang="ts">
defineOptions({ name: 'BaseAccordion' })
const props = defineProps({
  blockData: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="home-banner text-center relative">
    Accordion测试:
    <h3>{{ blockData.title }}</h3>
    <div>
      <ul>
        <li v-for="item in blockData.items" :key="item.id">
          <h4>{{ item.key }}</h4>
          <p>{{ item.value }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
