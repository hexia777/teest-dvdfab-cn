<script setup>
const props = defineProps({
  contact: {
    type: Object,
    default: () => ({
      title: '',
      desc: '',
    }),
  },
})
</script>

<template>
  <div>
    <!-- contact us  -->
    <h4 class="title4 contact-us-title text-center mb20" v-if="contact.title" v-html="contact.title"></h4>
    <div class="contact-us-con flex-center">
      <i class="iconfont-sg icon-contact"></i>
      <p v-html="contact.desc"></p>
    </div>
  </div>
</template>

<style scoped lang="less">
//contact
.contact-us-title {
  color: @base-text-color;
}
.contact-us-con {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 100px;
  gap: 40px;
  i {
    font-size: 153px;
    line-height: 153px;
    color: @primary-color;
  }
  :deep(p) {
    flex: 1;
    font-size: @font-size-sm;
    line-height: @base-line-height;
    > a {
      color: @primary-text-color;
    }
  }
}
@media (max-width: 768px) {
  .contact-us-con {
    padding: 20px;
    gap: 20px;
  }
}
@media (max-width: 460px) {
  .contact-us-con {
    padding-left: 24px;
  }
}
@media (max-width: 414px) {
  .contact-us-con {
    flex-wrap: wrap;
    justify-content: center;
    p {
      font-size: @font-size-sm;
      width: 100%;
      margin-top: 23px;
      flex: auto;
      padding-left: 0;
    }
  }
}
</style>
