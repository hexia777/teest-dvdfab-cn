<script setup lang="ts">
interface ListItem {
  [key: string]: any
}
const props: any = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
      }
    },
  },
  title: {
    type: String,
    default: '',
  },
  // 查看产品状态链接
  statusPage: {
    type: Object,
    default: () => {
      return {
        label: '',
        url: '',
      }
    },
  },
  // 分类产品
  items: {
    type: Object,
    default: () => {},
  },
})
const macData = useAttrs().macData || props
const selectTab = ref(0)
const locale = useStore.common().locale
const commonJson = useI18n().value.common
const currency = useStore.product().currency[locale]
const { getDefaultPriceInfo } = useProductDiffPrice()
const tabChangeHandle = (index: number) => {
  selectTab.value = index
}
const blockData: any = reactive({
  title: '',
  statusPage: {} as any,
  items: [],
})
const renderData = (os: string) => {
  let propsInfo: any = os === 'win' ? props : macData

  if (!propsInfo) {
    propsInfo = props
  }
  blockData.title = propsInfo.title
  blockData.statusPage = propsInfo.statusPage
  // for (const key in blockData) {
  //   blockData[key] = propInfo[key]
  // }
  blockData.items = propsInfo.items?.data.map((item: any) => {
    const newItem = { ...item.attributes }
    newItem.products = item.attributes.products?.data.map((pro: any) => {
      return pro.attributes
    })
    return newItem
  })
}

renderData(useOs().value)

watch(
  () => useOs().value,
  (newVal) => {
    renderData(newVal)
    // nextTick(() => {
    //   urlParamsConcat() // trackid 拼接
    // })
  },
)

// const isShow = (pid: string | number, client: string) => {
//   pid = +pid
//   if (
//     (pid < 9999 && client === 'win' && getChildPidByBundlePid(757).includes(pid)) ||
//     (client === 'mac' && getChildPidByBundlePid(1757).includes(pid))
//   ) {
//     return true
//   }
//   return false
// }
const setProInfo = (pro: any) => {
  const pid = pro.pid
  let newShow = ''
  if (pro.product_attrs?.data.length) {
    const newTag = pro.product_attrs?.data.find((tag: any) => {
      return tag.attributes.slug === 'new'
    })
    if (newTag) {
      newShow = `<span class='tag-span' >${commonJson.common_new}</span>`
    }
  }
  const productName = `<span>${pro.shortName}</span>`
  const proUrl = '/' + pro.slug
  const priceInfo = getDefaultPriceInfo(pro)
  const price = priceInfo.payment_price
  // pro.price.find((pr: any) => (pr.key = 'LFT'))
  const priceText = pid > 9999 ? commonJson.free : translatePrice(price, currency[1], locale)
  return `<a  href="${proUrl}.htm">${productName + newShow}</a><b>${priceText}</b>`
}
</script>

<template>
  <div class="block-box" :class="blockClass?.value">
    <BaseContainer>
      <div class="panel-tab-head flex flex-justify-between flex-items-center">
        <div class="font-size-36 font-bold" v-html="blockData.title"></div>
        <a
          v-if="blockData.statusPage.url"
          class="primary-link"
          :href="`${blockData.statusPage.url}`"
          v-html="blockData.statusPage.label"
        ></a>
      </div>
      <div class="panel-tab w100%">
        <div class="tab-head-wrap">
          <div class="tab-head">
            <template v-for="(item, idx) in blockData.items" :key="item.key">
              <div
                class="tab-head-item flex-center font-bold"
                :class="{ active: idx === selectTab }"
                @click="tabChangeHandle(idx)"
                v-html="item.title"
              ></div>
            </template>
          </div>
        </div>
        <div class="pros-list">
          <ul
            v-for="(item, idx) in blockData.items"
            v-show="idx == selectTab"
            :key="item.key"
            class="pros-items"
          >
            <template v-for="pro in item.products" :key="'pro' + pro.pid">
              <li class="pros-wrap">
                <div class="pros-item" :class="{ free: pro.pid > 9999 }" v-html="setProInfo(pro)"></div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.panel-tab {
  position: relative;
  margin-top: 30px;
  .tab-head {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #eeeeee;
    .tab-head-item {
      font-size: @font-size;
      position: relative;
      line-height: @title-line-height;
      height: 60px;
      cursor: pointer;
      text-align: center;
      width: 50%;
      &:hover,
      &.active {
        color: @primary-color;
        &::before {
          background-color: @primary-color;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 2px;
      }
      &::after {
        content: attr(data-num);
        margin-left: 4px;
        transform: translateY(-50%);
        white-space: nowrap;
        font-size: @font-size-xs;
        color: #ff4200;
        font-weight: bold;
      }
    }
  }
  .pros-list {
    padding: 30px 0 0 20px;
    width: 100%;
    .pros-items {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 12px;
      column-gap: 120px;
    }

    .pros-wrap {
      width: calc(50% - 120px);
      line-height: 30px;
      list-style-type: disc;
    }

    .pros-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @secondary-color;
      .free {
        color: @base-text-color;
      }
    }
    :deep(.pros-item) {
      b {
        font-weight: 500;
      }
      .tag-span {
        display: inline-block;
        margin: 0 10px;
        padding: 2px 20px;
        border-radius: @b-radius-md;
        background: @secondary-color;
        color: #fff;
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
      }
      a {
        color: @base-text-color;
        white-space: nowrap;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }
}
.tab-head-wrap {
  width: 100%;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: @primary-color;
  }
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: transparent;
  }
}
@media (max-width: 900px) {
  .panel-tab {
    .pros-list {
      .pros-wrap {
        width: 100%;
      }
    }
  }
}
@media (max-width: 768px) {
  .tab-head-wrap {
    overflow: auto;
    padding-bottom: 10px;
  }
  .panel-tab {
    .tab-head {
      gap: 10px;
      .tab-head-item {
        width: auto;
        white-space: nowrap;
        flex: none;
      }
    }
  }
}
@media (max-width: 640px) {
  .panel-tab-head {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
