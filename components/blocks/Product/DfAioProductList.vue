<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  items: {
    type: Object,
    default: () => {
      return {
        data: [] as any,
      }
    },
  },
})

const macData: any = useAttrs().macData || props
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]

const blockData = reactive({
  os: '',
  title: '',
  list: [] as any,
})

const renderData = (osText: string) => {
  blockData.os = osText
  const data = osText === 'mac' && macData ? macData : props
  blockData.title = data.title
  blockData.list = data.items?.data?.map((item: any) => {
    const products = item.attributes.products?.data.map((pro: any) => {
      const lftPrice = pro.attributes.price?.find((pr: any) => pr.key === 'LFT')
      const price = lftPrice ? translatePrice(lftPrice.value, currency[1], locale) : ''
      return { ...pro.attributes, lftPrice: price }
    })
    return {
      name: item.attributes.title,
      products,
    }
  })
}
renderData(useOs().value)

watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal)
  },
)
</script>

<template>
  <div class="content-bg">
    <BaseContainer>
      <div>
        <div class="products-tit" v-html="blockData.title"></div>
        <div class="products-box" :class="[blockData.os]">
          <div
            v-for="(item, index) in blockData.list"
            :key="'products-list' + index"
            class="products-list win"
            :class="[blockData.os]"
          >
            <div class="tit" v-html="item.name"></div>
            <div v-for="(productItem, i) in item.products" :key="'product' + index + i" class="product">
              <a
                v-if="productItem.slug"
                :href="'/' + productItem.slug + '.htm'"
                class="product-name"
                v-html="productItem.shortName"
              ></a>
              <span v-else class="product-name" v-html="productItem.shortName"></span>
              <span class="product-price" v-html="productItem.lftPrice"></span>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.content-bg {
  background-color: #f4f8f9;
}
.products-tit {
  font-size: 20px;
  padding: 30px 0 16px 0;
  font-weight: 700;
}
.products-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 30px;
  border-top: 1px solid #e4eaeb;

  &.win {
    vertical-align: top;
    overflow: hidden;
  }
}
.products-list {
  padding-top: 10px;
  width: 33.33%;
  padding-right: 5%;
  &.mac {
    padding-right: 3%;
  }
  // &:last-child {
  //   position: absolute;
  //   right: 0;
  //   bottom: 40px;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: flex-end;
  // }
  .tit {
    color: #3b5159;
    font-size: 18px;
    padding: 15px 0 10px;
    font-weight: 700;
  }
  .product {
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    .product-name {
      color: #3b5159;
      padding-left: 20px;
      position: relative;

      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #3b5159;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 8px;
      }
    }
    a.product-name {
      &:hover {
        color: #00baff;
      }
    }
    .product-price {
      color: #f8752b;
    }
  }
}

@media screen and (max-width: 1060px) {
  .products-box.win {
    display: flex;
    flex-wrap: wrap;
  }
  .products-list.win {
    float: unset;
    width: 45%;
  }
}
@media screen and (max-width: 768px) {
  .products-list.win {
    width: 100%;
  }
}
</style>
