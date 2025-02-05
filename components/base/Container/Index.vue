<script setup lang="ts">
defineOptions({ name: 'BaseContainer' })
</script>

<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 5%;
  }
}
</style>
