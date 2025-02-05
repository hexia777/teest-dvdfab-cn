<script setup lang="ts">
defineOptions({ name: 'NavBarPc' })
const props = defineProps({
  link: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="free-drop-menu">
    <a class="nohover free-drop-menu-a" :href="link">
      <div class="font-700 title" v-html="title"></div>
      <div class="desc" v-html="desc"></div>
    </a>
  </div>
</template>
<style scoped lang="less">
.free-drop-menu {
  .free-drop-menu-a {
    display: block;
    border-radius: 8px;
    padding: 12px;
  }
  &:hover {
    .free-drop-menu-a {
      background: #f1fafd;
    }
    .title {
      color: #00a9f0;
    }
  }
  .desc {
    font-size: 14px;
    color: #909090;
  }
}
</style>
