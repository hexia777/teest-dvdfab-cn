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
  descList: {
    type: Array<any>,
    default: () => [],
  },
  priceInfo: {
    type: Object,
    default: () => {
      return {
        couponCode: '',
        couponText: '',
        price: '',
        oriPrice: '',
      }
    },
  },
  imgData: {
    type: Object,
    default: () => {
      return {
        src: '',
        width: '',
        height: '',
        lazy: false,
        alt: '',
      }
    },
  },
  size: {
    type: String,
    default: '', // md sm xs
  },
  btnList: {
    type: Array<any>,
    default: () => [],
  },
  // 按钮布局样式
  btnListClass: {
    type: String,
    default: '',
  },
  // 图片位置
  imgPosition: {
    type: String,
    default: 'top', // top bottom
  },
  // 阴影位置
  shandow: {
    type: String,
    default: '', // '' up down
  },
})
const shandowMap: any = {
  up: 'up-shandow',
  down: 'down-shandow',
}
</script>

<template>
  <div
    class="itt-card-box b-radius-sm flex flex-col flex-items-center flex-justify-between"
    :class="[size ? 'card-' + size : '', shandowMap[props.shandow] || '']"
  >
    <div class="itt-top flex flex-col flex-items-center text-center">
      <div v-if="imgPosition == 'top'" class="img-box">
        <MyImg v-bind="imgData" class="mb20" />
        <div v-if="priceInfo?.couponText" class="off-box">
          <i class="iconfont-mul icon-m-off-tag"> </i>
          <span class="off-value" v-html="priceInfo?.couponText"></span>
        </div>
      </div>
      <div class="title4 mb12" v-html="title"></div>

      <div v-if="!descList.length" class="iit-desc" v-html="desc"></div>
      <div v-else class="iit-desc-list">
        <p v-for="(dItem, idx) in descList" :key="'iit-desc' + idx" v-html="dItem.value"></p>
      </div>
    </div>
    <div class="itt-bottom mt40" :class="btnListClass">
      <MyImg v-if="imgPosition == 'bottom'" v-bind="imgData" class="mb20" />
      <div v-for="(btn, idx) in btnList" :key="'btn-item' + idx" class="btn-item">
        <template v-if="btn.info.tag !== 'a' && btn.component === 'MyButtonBuy'">
          <div
            class="price-box flex flex-justify-center flex-items-baseline mb20"
            :class="{ 'has-coupon-text': btn.info.couponText }"
          >
            <span class="cur color-price font-s-32 font-bold">{{ priceInfo?.price }}</span>
            <del v-if="priceInfo?.price !== priceInfo?.oriPrice" class="ori ml-8 font-s-14 gray-color">
              {{ priceInfo?.oriPrice }}
            </del>
          </div>
          <component
            :is="btn.component"
            v-bind="{ ...btn.info }"
            v-track:click="btn.click"
            data-buy-dlg="show"
            :data-pid="btn.pid"
            :data-pname="btn.pname"
          />
        </template>
        <component
          :is="btn.component"
          v-else-if="btn.component === 'MyButtonDownload'"
          v-bind="{ ...btn.info }"
        />
        <template v-else>
          <div
            v-if="priceInfo?.price !== priceInfo?.oriPrice"
            class="price-box flex flex-justify-center flex-items-baseline mb20"
            :class="{ 'has-coupon-text': btn.info.couponText }"
          >
            <span class="cur color-price font-s-32 font-bold">{{ priceInfo?.price }}</span>
            <del class="ori ml-8 font-s-14 gray-color">{{ priceInfo?.oriPrice }}</del>
          </div>
          <component :is="btn.component" v-track:click="btn.click" v-bind="{ ...btn.info }" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.itt-card-box {
  padding: @gap-md;
  background-color: @bg-white;
  &.card-md {
    padding: @gap-30;
  }
  &.card-sm {
    padding: @gap-base;
  }
  &.card-xs {
    padding: @gap-xs;
  }
  .price-box.has-coupon-text {
    margin-bottom: 50px;
  }
}
.img-box {
  position: relative;
}
.off-box {
  position: absolute;
  top: -1%;
  left: 2%;
  line-height: 1;
  text-align: center;
  font-size: @font-size-md;
  font-weight: 700;
  z-index: 2;
  transform: rotate(-28deg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .off-value {
    position: absolute;
    color: #fff;
  }
  .icon-m-off-tag {
    font-size: 86px;
  }
}
@media (max-width: 640px) {
  .itt-card-box {
    padding: 5%;
    img {
      width: 205px;
      height: 205px;
    }
  }
  .off-box {
    .icon-m-off-tag {
      font-size: 70px;
    }
  }
}
</style>
