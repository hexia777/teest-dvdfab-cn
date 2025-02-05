<script setup lang="ts">
const props = defineProps({
  blocks: {
    type: Array as any,
    default: () => [],
  },
})
</script>

<template>
  <div v-if="blocks && blocks.length">
    <template v-for="item in blocks" :key="item.id">
      <component
        :is="dynamicComponent(item.component_dir, item.component_file_name)"
        v-bind="{
          ...removeBlocksDataNullKey(item),
        }"
      />
    </template>
  </div>
</template>

<style scoped></style>
