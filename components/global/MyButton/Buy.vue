<script setup lang="ts">
const props = defineProps({
  theme: {
    type: String,
    default: 'primary', // primary(橙色)、blue、yellow、border(蓝色)、border-orange
  },
  showIcon: {
    type: Boolean,
    default: true, // show icon
  },
  size: {
    type: String,
    default: 'medium', // large:278*66, medium:220*48, small:180*48,  normal:170*40, mini:pl15 pr15
  },
  transition: {
    type: Boolean,
    default: true, // 是否显示hover动画
  },
  label: {
    type: String,
    default: '', // buy now 按钮文案
  },
  href: {
    type: String,
    default: '', //
  },
  price: {
    type: [Number, String],
    default: '',
  },
  elkParams: {
    type: Object,
    default: () => ({}),
  },
  showLine: {
    type: Boolean,
    default: true,
  },
  couponText: {
    type: String,
    default: '', //
  },
  couponTextMobileHide: {
    type: Boolean,
    default: true, // 是否在移动端(640px)显示conpouText
  },
})
const _attrs = useAttrs()
const attrs = computed(() => {
  const newAttrs: any = {}
  for (const key in _attrs) {
    if (!key.startsWith('data-')) {
      newAttrs[key] = _attrs[key]
    }
  }
  return newAttrs
})
</script>

<template>
  <component :is="$attrs.tag || 'a'" :href="props.href" class="relative flex-center">
    <MyButton
      v-bind="attrs"
      :theme="props.theme"
      :is-self="false"
      :class="{
        [`buy-button--${theme}`]: theme,
        transition: !transition,
        [`${theme}`]: theme,
      }"
      :size="props.size"
      :target="''"
      :tag="'div'"
    >
      <slot>
        <span class="my-btn flex-center">
          <i v-if="showIcon" class="iconfont-sg icon-shop-cart v-mid pr-8"></i>
          <span class="font-700" v-html="label"></span>
          <template v-if="price">
            <span v-if="showLine" class="line ml-10 mr-10 w-1 inline-flex h-22"></span>
            <span v-html="translatePrice(price)"></span>
          </template>
        </span>
      </slot>
    </MyButton>
    <template v-if="couponText">
      <span class="coupon-text" :class="{ hide: couponTextMobileHide }" v-html="couponText"></span>
    </template>
  </component>
</template>

<style lang="less" scoped>
.coupon-text {
  position: absolute;
  right: 0;
  max-width: 200px;
  background: #ff3b30;
  border-radius: 26px 26px 26px 0;
  padding: 4px 16px;
  top: 12px;
  font-size: 14px;
  transform: translateY(-100%);
  text-align: left;
  color: #fff;
  z-index: 1;
}
.buy-button--primary {
  @apply c-white;
  background: @btn-secondary-color;
}
.buy-button--blue {
  @apply c-white;
  background: @primary-color;
  border: none;
  :hover {
  }
}

.buy-button--white {
  background: @bg-white;
  color: @secondary-color;
  &:hover {
    background: @btn-secondary-color-h;
    @apply c-white;
  }
  &::before {
    transform: none;
  }
}
.buy-button--border {
  background: none;
  color: @btn-secondary-color !important;
  border: 2px solid @btn-secondary-color;
  .line {
    background-color: @btn-primary-color;
  }
  &:hover {
    @apply !c-white;
    background: @btn-secondary-color;
    .line {
      background-color: #fff;
    }
  }
}
.buy-button--yellow {
  background: @price-color;
  color: #f85a14;
  border: 2px solid @price-color;
  &:hover {
    box-shadow: 0px 8px 16px 0px rgba(120, 59, 215, 0.5);
    color: #f85a14;
  }
}

.buy-button--yellow2 {
  background: none;
  color: #fde800;
  border: 2px solid #fde800;
  &:hover {
    // box-shadow: 0px 8px 16px 0px rgba(120, 59, 215, 0.5);
    @apply !c-white;
    background: #fdb900;
    border-color: transparent;
  }
}
@media (max-width: @screen-sm) {
  .coupon-text.hide {
    display: none;
  }
}
</style>
