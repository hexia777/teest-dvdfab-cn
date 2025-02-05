<script setup lang="ts">
const props = defineProps({
  coupon: {
    type: [String, Number],
    default: '',
  },
  price: {
    type: [String, Number],
    default: '',
  },
  oldPrice: {
    type: [String, Number],
    default: '',
  },
  proImg: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  proUrl: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
    default: 220,
  },
  height: {
    type: [Number, String],
    default: 220,
  },
  btnText: {
    type: String,
    default: 'Buy Now',
  },
  btnUrl: {
    type: String,
    default: '',
  },
  blockClass: {
    type: Object,
    default: () => {},
  },
  style: {
    type: Object,
    default: () => ({
      flexClass: '',
      fontClass: 'font-s-24',
    }),
  },
  proInfo: {
    type: Object,
    default: () => ({}),
  },
})
const { locales } = useNavBar()
const locale = useStore.common().locale
const { getElkParams } = useProductDiffPrice()
</script>

<template>
  <div class="block-pro pt20 pl14 pr14 flex flex-col justify-between" :class="blockClass">
    <div class="top">
      <div class="pro-img mb20 text-center">
        <div v-if="coupon" class="off-tag">
          <div class="relative flex-center">
            <i class="iconfont-mul icon-m-off-tag absolute"></i>
          </div>
          <span
            :class="locale === 'de' ? 'font-size-20' : 'font-size-24'"
            v-html="locales.common.coupon_num.replace('{num}', coupon)"
          ></span>
        </div>
        <a
          :href="proUrl ? proUrl : 'javascript:;'"
          :class="{ 'no-link': !proUrl || proUrl === 'javascript:;' }"
        >
          <my-img v-if="proImg" :width="width" :height="height" :src="proImg" :alt="alt" />
        </a>
      </div>
      <div class="pro-text">
        <div class="pro-name font-700 pb12 text-center" :class="style.fontClass">
          <a
            :href="proUrl ? proUrl : 'javascript:;'"
            :class="{ 'no-link': !proUrl || proUrl === 'javascript:;' }"
            v-html="name"
          >
          </a>
        </div>
        <p class="pro-desc text-center" v-html="desc"></p>
      </div>
    </div>
    <div class="pro-btn-group pt40 flex-center-col" :class="style.flexClass">
      <div class="price-box pb20">
        <span
          v-if="price || oldPrice"
          class="new-price font-s-32 font-700"
          v-html="translatePrice(price || oldPrice)"
        ></span>
        <span v-if="coupon" class="old-price pl8" v-html="translatePrice(oldPrice)"></span>
      </div>
      <my-button-buy
        v-track:click="getElkParams('buy_now', proInfo, {})"
        theme="border-orange"
        :href="btnUrl"
        :label="btnText"
        size="medium"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.pro-img {
  position: relative;
  .off-tag {
    position: absolute;
    top: -3%;
    left: 36px;
    line-height: 1;
    text-align: center;
    z-index: 1;
    transform: rotate(-28deg) scale(0.8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 83px;
    }
    width: 90px;
    height: 90px;

    &::before {
      position: absolute;
      font-size: 83px;
    }
  }
  span {
    position: absolute;
    color: #fff;
  }
}
.pro-name,
.pro-img {
  a {
    color: @base-text-color;
    &:hover {
      color: @primary-color;
    }
    &.no-link {
      color: @base-text-color;
      cursor: initial;
      &:hover {
        color: @base-text-color;
      }
    }
  }
}
.pro-btn-group {
  @apply @gap-base;
  .price-box {
    @apply @gap-base;
  }
  .new-price {
    color: @secondary-color;
  }
  .old-price {
    color: @text-gray-color;
    text-decoration: line-through;
  }
}
@media (max-width: @screen-xl) {
  .block-pro {
    flex-direction: column;
    align-items: center;
  }
}
</style>
