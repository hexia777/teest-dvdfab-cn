<script setup lang="ts">
interface GiftItem {
  value: string
  // 可以根据实际需求添加其他字段
}
defineProps({
  theme: {
    type: String,
    default: '', // '' upgrade clear
  },
  // 常规价格或平均价格
  standardLabel: {
    type: String,
    default: '',
  },
  standardPrice: {
    type: String,
    default: '',
  },
  // 优惠价格
  specialLabel: {
    type: String,
    default: '',
  },
  specialPrice: {
    type: String,
    default: '',
  },
  // 最终价格
  finalLabel: {
    type: String,
    default: '',
  },
  finalPrice: {
    type: String,
    default: '',
  },
  finalPriceStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 均价数值
  avgPriceText: {
    type: String,
    default: '',
  },
  giftIcon: {
    type: String,
    default: 'icon-gift',
  },
  // 礼物盒子
  giftList: {
    type: Array as PropType<GiftItem[]>,
    default: () => [],
  },
  // 分割线配置
  splitLine: {
    type: Object,
    default: () => {
      return {
        show: true,
        color: 'rgba(0, 169, 240, 0.1)',
      }
    },
  },
})
</script>

<template>
  <div
    class="product-info flex flex-justify-center flex-items-stretch"
    :class="[{ 'no-gift': !giftList.length }, 'pi-theme-' + theme]"
  >
    <div class="price-box flex flex-1 flex-col self-start">
      <p v-if="standardLabel || standardPrice" class="standard-price flex flex-between mb15">
        <span v-if="standardLabel" v-html="standardLabel"></span>
        <del v-if="standardPrice" class="ml10 w56 text-right" v-html="standardPrice"></del>
      </p>
      <p v-if="specialLabel" class="flex flex-between mb15">
        <span v-html="specialLabel"></span>
        <del class="ml10 w56 text-right" v-html="specialPrice"></del>
      </p>
      <p class="flex flex-between font-s-18 flex-items-center mb4">
        <span v-html="finalLabel"></span>
        <span
          class="product-info-price ml10 font-size-28 color-price font-bold"
          :style="finalPriceStyle"
          v-html="finalPrice"
        ></span>
      </p>
      <div v-if="avgPriceText" class="text-right">
        <span class="font-s-14 pro-per-price" v-html="avgPriceText"></span>
      </div>
    </div>
    <div
      v-if="splitLine.show && giftList.length"
      class="split-line"
      :style="{ backgroundColor: splitLine?.color }"
    ></div>
    <div v-if="giftList.length" class="product-info-right flex flex-col gap24 max-w-50%">
      <div v-for="(gift, idx) in giftList" :key="idx" class="flex">
        <span class="gift-icon flex-center flex-none mr12">
          <i class="iconfont-sg font-s-24" :class="giftIcon"></i>
        </span>
        <span class="text-left" v-html="gift.value"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.product-info {
  padding: @gap-24;
  background: rgba(255, 255, 255, 0.4);
  border-radius: @b-radius-sm;
  &.primary {
    background: rgba(255, 144, 0, 0.05);
  }
  &.pi-theme-clear {
    padding: 0;
    background-color: transparent;
    .split-line {
      background-color: transparent;
    }
    .gift-icon {
      background-color: transparent;
      color: @secondary-color;
    }
  }
  &.no-gift {
    justify-content: flex-start;
    .price-box {
      max-width: 330px;
    }
  }
}
.split-line {
  width: 1px;
  margin: 0 @gap-24;
}

.gift-icon {
  width: 24px;
  height: 24px;
  border-radius: @b-radius-lg;
  background-color: @secondary-color;
  color: @text-white-color;
}

@media (max-width: 640px) {
  .product-info {
    flex-direction: column;
    // width: 100%;
    max-width: 100%;
  }
  .split-line {
    height: 1px;
    min-height: 1px;
    width: 100%;
    margin: @gap-24 0;
  }
  .price-box {
    align-self: center;
  }
  .product-info-right {
    max-width: 80%;
  }
}

@media (max-width: 414px) {
  .product-info-right {
    max-width: 100%;
  }
}
</style>
