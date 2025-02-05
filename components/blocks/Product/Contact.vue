<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg' }
    },
  },
})
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <BaseContainer>
      <!-- contact us -->
      <!-- <h2 v-if="title" class="title2 contact-us-title text-center mb40" v-html="title"></h2> -->
      <div class="contact-us-con flex-center pl100 pr100 pt40 pb40" :class="!title ? 'pt40 pb40' : ''">
        <i class="iconfont-sg icon-contact"></i>
        <p class="desc" v-html="desc"></p>
      </div>
    </BaseContainer>
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
  gap: 40px;
  justify-content: space-between;
  i {
    font-size: 153px;
    line-height: 153px;
    color: @primary-color;
  }
  :deep(.desc) {
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
@media (max-width: 640px) {
  .contact-us-con {
    flex-wrap: wrap;
    flex-direction: column;
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
