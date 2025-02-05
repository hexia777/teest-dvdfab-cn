<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  priceInfo: {
    type: Object,
    default: () => {
      return {
        label: '',
        price: '',
      }
    },
  },
  proIconlist: {
    type: Array,
    default: () => [],
  },
})

// 是否展示 mycombo 弹窗
const showCombonModal = ref<boolean>(false)

const myComboData = {
  title: 'Customize StreamFab MyCombo  (Lifetime)',
}
const osText = computed(() => {
  return useOs().value
})
// 方法
const showCombonModalHandle = () => {
  showCombonModal.value = true
}
</script>

<template>
  <div class="mycombo-card-box flex flex-items-center flex-between gap40 p40">
    <div class="mcb-left">
      <div class="font-bold font-s-20 mb12" v-html="title"></div>
      <div class="mb10" v-html="desc"></div>
      <div class="flex gap20">
        <i
          v-for="(icon, idx) in proIconlist"
          :key="'pro-icon' + idx"
          class="iconfont-sg c-white"
          :class="icon"
        ></i>
      </div>
    </div>
    <div class="mcb-right">
      <div class="flex-center mb24">
        <span class="mr16" v-html="priceInfo.label"></span>
        <span class="font-bold font-size-28" v-html="priceInfo.price"></span>
      </div>
      <MyButtonBuy
        tag="div"
        theme="white"
        :show-icon="false"
        :label="'Customize Now'"
        @click="showCombonModalHandle"
      />
    </div>
    <PagesDialogCheckMyCombo v-model="showCombonModal" :os="osText" :title="myComboData.title" />
  </div>
</template>

<style scoped lang="less">
.mycombo-card-box {
  color: @text-white-color;
  background-color: @primary-color;
  border-radius: @b-radius-md;
}

@media (max-width: 900px) {
  .mycombo-card-box {
    flex-direction: column;
  }
}
@media (max-width: 640px) {
  .mycombo-card-box {
    padding: @gap-base;
    .mcb-left {
      text-align: center;
    }
  }
}
</style>
