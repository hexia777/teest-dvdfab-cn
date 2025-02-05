<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array<any>,
    default: () => {},
  },
})
</script>

<template>
  <div class="product-card-list gap40 flex flex-justify-center">
    <template v-for="(pro, idx) in list" :key="'pcard' + idx">
      <div
        class="pcl-item b-radius-sm w100% flex flex-col flex-items-center flex-justify-between"
        :style="pro.style"
        :class="{ active: pro.active }"
      >
        <div class="pcl-top text-center">
          <div class="title4 mb12 min-h-64" v-html="pro.title"></div>
          <div class="iit-desc min-h-48" v-html="pro.desc"></div>
        </div>
        <div class="pcl-mid mt24">
          <span v-if="!pro.active" class="color-price font-size-32 font-bold">{{
            translatePrice(pro.price)
          }}</span>
          <template v-else>
            <div class="product-info pl32 pr32 font-s-18">
              <p class="flex flex-justify-between mb16">
                <span v-html="pro.tipInfo.standard_label"></span>
                <del v-html="translatePrice(pro.tipInfo.standard_price)"></del>
              </p>
              <p class="flex flex-items-center flex-justify-between">
                <span v-html="pro.tipInfo.final_label"></span>
                <span
                  class="product-info-price ml3 font-size-32 color-price2 font-bold line-h-title"
                  v-html="translatePrice(pro.tipInfo.final_price)"
                ></span>
              </p>
            </div>
            <div class="gift-info flex flex-justify-center mt24 b-radius-sm">
              <span class="gift-icon flex-center pl20 pr20">
                <i class="iconfont-sg icon-gift2 font-s-18 color-price"></i>
              </span>
              <ul class="gift-list">
                <li v-for="(gift, idx) in pro.tipInfo.giftInfo" :key="idx" v-html="gift"></li>
              </ul>
            </div>
          </template>
        </div>
        <div class="pcl-bottom mt40">
          <div v-for="(btn, idx) in pro.btnList" :key="'btn-item' + idx" class="btn-item">
            <component :is="btn.component" v-bind="{ ...btn.info }" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.product-card-list {
  .pcl-item {
    padding: @gap-md;
    max-width: 580px;
    background-color: @bg-white;
    border: 3px solid @primary-color;
    &.active {
      border: unset;
      color: @text-white-color;
    }
  }
  .gift-info {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .gift-icon {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
  .gift-list {
    padding: 16px 20px 16px 40px;
    li {
      list-style-type: disc;
    }
  }
}

@media (max-width: 768px) {
  .product-card-list {
    flex-direction: column;
    align-items: center;
    .pcl-item {
      max-width: 500px;
    }
  }
}
@media (max-width: 414px) {
  .product-card-list {
    .product-info {
      padding: 0 16px;
    }
  }
}
</style>
