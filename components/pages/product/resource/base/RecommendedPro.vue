<script setup lang="ts">
const props = defineProps({
  pid: {
    type: String,
    default: '',
  },
  price: {
    type: String,
    default: '',
  },
  oldPrice: {
    type: String,
    default: '',
  },
  proImg: {
    type: String,
    default: '',
  },
  proImgUrl: {
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
    default: 100,
  },
  height: {
    type: [Number, String],
    default: 100,
  },
  imgAlt: {
    type: String,
    default: '',
  },
  bgImg: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="recommended-pro">
    <div class="top flex">
      <div class="pro-img mb20 text-center pr10 pt16">
        <a v-if="proImgUrl" :href="proImgUrl" class="font-s-0">
          <my-img v-if="proImg" :width="width" :height="height" :src="proImg" :alt="imgAlt" />
        </a>
      </div>
      <div class="pro-text">
        <div class="pro-name font-700 pb4">
          <a v-if="proImgUrl" :href="proImgUrl" class="font-s-0" v-html="name"> </a>
        </div>
        <p class="pro-desc font-s-14" v-html="desc"></p>
      </div>
    </div>
    <div class="pro-btn-group pt8 flex-center-col">
      <div v-if="price" class="price-box pb10">
        <span class="new-price font-s-18 font-700" v-html="translatePrice(price)"></span>
        <span v-if="oldPrice" class="old-price pl12" v-html="translatePrice(oldPrice)"></span>
      </div>
      <my-button-buy theme="border-orange" :show-icon="false" label="buy now" size="normal" os="mac" />
    </div>
  </div>
</template>

<style scoped lang="less">
.pro-name {
  a {
    color: @base-text-color;
    &:hover {
      color: @primary-color;
    }
  }
}
.recommended-pro {
  background-position: top center;
  background-color: #fff;
  .name {
    @apply inline-block text-ellipsis whitespace-nowrap font-700 pb4 w-full overflow-hidden;
    list-style-position: inside;
    width: 100%;
  }
  .desc {
    color: @text-gray-color;
  }
  .new-price {
    color: @secondary-color;
  }
  .old-price {
    color: @text-gray-color;
    text-decoration: line-through;
  }
}
</style>
