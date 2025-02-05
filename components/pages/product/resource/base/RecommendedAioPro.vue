<script setup lang="ts">
import { getCheckoutUrl } from '~/utils/product'

const props = defineProps({
  price: {
    type: String,
    default: '',
  },
  oldPrice: {
    type: String,
    default: '',
  },

  /**
   * <span>Special Gift:</span> $99.99 DVDFab Player 6 Ultra for Mac  (Lifetime)<br>
     <span>Gift 1:</span> $30 Amazon Gift Card<br>
     <span>Gift 2:</span> 5-Computer License for Mac
   */
  width: {
    type: [Number, String],
    default: 100,
  },
  height: {
    type: [Number, String],
    default: 100,
  },

  bgImg: {
    type: String,
    default: '',
  },
  imgInfo: {
    type: Object,
    default: () => ({}),
  },
  product: {
    type: Object,
    default: () => ({}),
  },
  gifts: {
    type: Array as any,
    default: () => [],
  },
  coupon: {
    type: String,
    default: '',
  },
  bundlePrice: {
    type: [String, Number],
    default: '',
  },
  routeName: {
    type: String,
    default: '',
  },
})

const locales = useI18n().value
const locale = useStore.common().locale

// 购买链接
const getCheckOutUrl = computed(() => {
  let params: any = {}
  if (props.product?.coupon && props.product.coupon.length > 0) {
    params = {
      coupon: props.product.coupon[0].key,
    }
  }
  const query = urlParamsToString(params)
  return getCheckoutUrl(props.product.pid, 'LFT', '&' + query)
})
</script>

<template>
  <div class="recommended-aio-pro pt16 pb16 pl10 pr10">
    <div class="product">
      <div class="pro-img mb20 text-center pr10">
        <div v-if="coupon" class="off-tag">
          <div class="relative flex-center">
            <i class="iconfont-mul icon-m-off-tag absolute"></i>
          </div>
          <span
            :class="locale === 'de' ? 'font-size-14' : 'font-size-14'"
            v-html="locales.common.coupon_num.replace('{num}', coupon)"
          ></span>
        </div>
        <a v-if="product.link" :href="product.link" class="mt16 inline-block">
          <my-img
            v-if="imgInfo.url"
            :width="width"
            :height="height"
            :src="imgInfo.url"
            :alt="imgInfo.label"
          />
        </a>
      </div>
      <div class="pro-text">
        <div class="pro-name font-700 pb4">
          <a v-if="product.link" :href="product.link" class="font-s-0" v-html="product.name"> </a>
          <div>({{ locales.common.lifetime }})</div>
        </div>
        <div v-if="gifts && gifts.length">
          <div v-for="gift in gifts" :key="gift.id" class="pro-desc font-s-14" v-html="gift.value"></div>
        </div>
      </div>
    </div>
    <div class="pro-btn-group pt10 flex-center-col">
      <div v-if="price" class="price-box pb10">
        <span class="new-price font-s-18 font-700" v-html="translatePrice(price)"></span>
        <span v-if="oldPrice" class="old-price pl12" v-html="translatePrice(oldPrice)"></span>
      </div>
      <MyButtonBuy
        v-track:click="{
          event: 'buy_now',
          event_value: routeName,
          event_label: 'sidebar1',
          pids: [product.pid],
          payment_price: bundlePrice,
        }"
        :label="locales.common.buy_now"
        theme="border-orange"
        slug=""
        size="normal"
        :show-icon="false"
        :href="getCheckOutUrl"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.product {
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  display: flex;
}
.pro-img {
  position: relative;
  .off-tag {
    position: absolute;
    top: 0;
    left: 0;
    line-height: 1;
    text-align: center;
    z-index: 1;
    transform: rotate(-28deg) scale(0.8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 50px;
    }
    width: 50px;
    height: 50px;

    &::before {
      position: absolute;
      font-size: 50px;
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

// .pro-name {
//   a {
//     color: @base-text-color;
//     &:hover {
//       color: @primary-color;
//     }
//   }
// }
.recommended-aio-pro {
  background-image: url('https://c3.dvdfab.cn/images/technology/slider_bar_bg_02.png');
  background-position: top center;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  color: #fff;
  width: 100%;
  .pro-name {
    @apply inline-block text-ellipsis whitespace-nowrap font-700 pb4 w-full overflow-hidden;
    list-style-position: inside;
    width: 100%;
    a {
      color: #fff;
    }
  }
  .new-price {
    color: @secondary-color;
  }
  .old-price {
    color: @text-gray-color;
    text-decoration: line-through;
  }
}

.pro-text {
  color: #fff;
  :deep(b) {
    font-weight: 400;
    color: #f8e302;
  }
}
</style>
