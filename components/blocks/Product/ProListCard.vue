<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'no-bg',
      }
    },
  },
  // h 标题
  title: {
    type: String,
    default: '',
  },
  // h 标题
  desc: {
    type: String,
    default: '',
  },
  // 数组
  items: {
    type: Array<any>,
    default: () => [],
  },
  // 数组
  dvdfabDesc: {
    type: Array<any>,
    default: () => [],
  },
  // 数组
  streamfabDesc: {
    type: Array<any>,
    default: () => [],
  },
  // 数组
  unifabDesc: {
    type: Array<any>,
    default: () => [],
  },
  // 数组
  softwares: {
    type: Array<any>,
    default: () => [],
  },
})

const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commonLocale = useI18n().value.common
// 获取产品信息
const getProductInfo = (product: any) => {
  const _product = getStrapiData(product)
  const price = _product.price?.length ? _product.price.find((pr: any) => pr.key === 'LFT') : 0
  return {
    name: _product.name,
    shortName: _product.shortName,
    price: translatePrice(price.value, `<span>${currency[1]}</span>`, locale),
    productLine: _product.productLine,
    productLineName: _product.productLine.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
  }
}
// 获取图片
const getMeidaInfo = (media: any) => {
  return getStrapiData(media)
}

// 获取描述信息
const getDescInfo = (product: any) => {
  const _product = getProductInfo(product)
  let descList = []
  switch (_product.productLine) {
    case 'dvdfab12':
      descList = props.dvdfabDesc
      break
    case 'streamfab':
      descList = props.streamfabDesc
      break
    case 'unifab':
      descList = props.unifabDesc
      break
    default:
      break
  }
  return descList
}
</script>

<template>
  <div class="block-box" :class="blockClass.value">
    <base-container>
      <h2 class="title text-center mb-40" v-html="title"></h2>
      <p v-if="desc" class="mb40 text-center" v-html="desc"></p>
      <div class="pro-list">
        <div v-for="pro in items" :key="pro.id" class="pro-list-item bg-normal">
          <div class="top-group">
            <MyImg
              class="card-image mb20"
              :loading="'lazy'"
              :src="getMeidaInfo(pro?.media).url"
              width="100"
              height="100"
              :alt="pro?.mediaAlt || getProductInfo(pro?.product)?.name"
            />
            <div class="title4 text-center mb16">{{ getProductInfo(pro?.product)?.name }}</div>
            <div class="price mb24 color-price" v-html="getProductInfo(pro?.product)?.price"></div>
            <ul class="desc-list">
              <li
                v-for="proDesc in getDescInfo(pro?.product)"
                :key="'desc' + proDesc.id"
                v-html="proDesc.value"
              ></li>
            </ul>
          </div>
          <div class="btn-group mt40">
            <my-button
              class="more-link"
              :href="pro.link"
              :label="commonLocale.learn_more + ' >'"
              size="normal"
              theme="border"
            />
          </div>
        </div>
      </div>
      <div class="soft-list bg-normal mt16">
        <a v-for="soft in softwares" :key="'soft' + soft.id" :href="soft.link" class="soft-list-item">
          <div class="info-group">
            <MyImg
              class="card-image mr12"
              :loading="'lazy'"
              :src="getMeidaInfo(soft?.media).url"
              width="40"
              height="40"
              :alt="soft?.mediaAlt || getProductInfo(soft?.product)?.name"
            />
            <div class="name">
              {{ getProductInfo(soft?.product)?.productLineName }}
            </div>
          </div>
          <div class="price" v-html="getProductInfo(soft?.product)?.price"></div>
        </a>
      </div>
    </base-container>
  </div>
</template>

<style scoped lang="less">
.pro-list {
  display: flex;
  gap: 16px;
  .price {
    font-size: 34px;
    font-weight: bold;
  }
  :deep(.price) {
    span {
      font-size: 20px;
    }
  }
  .desc-list {
    padding-left: 16px;
    li {
      list-style-type: disc;
    }
  }
}
.top-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pro-list-item {
  width: 33.333333%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 32px 24px;
  transition: 0.2s linear;
  &:hover {
    background: #ffffff;
    box-shadow: 0 0 50px 0 #c2edff;
  }
}

.soft-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px 20px;
  padding: 10px 20px;
  border-radius: 20px;
}
.soft-list-item {
  width: 48%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333333;
  transition: background-color 0.2s linear;
  &:hover {
    background-color: #ffffff;
    border-radius: 12px;
  }
  .info-group {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 900px) {
  .pro-list {
    flex-direction: column;
    .pro-list-item {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .soft-list {
    padding: 10px;
  }
  .soft-list-item {
    padding: 10px;
  }
}
@media (max-width: 640px) {
  .soft-list-item {
    width: 100%;
  }
}
</style>
