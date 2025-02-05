<script setup lang="ts">
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return {
        value: 'has-bg bg-normal',
      }
    },
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 描述信息
  desc: {
    type: String,
    default: '',
  },
  listHead: {
    type: Object,
    default: () => {},
  },
  items: {
    type: Object,
    default: () => {},
  },
  // 第一列宽d的比例
  firstWidthRate: {
    type: Number,
    default: 3 / 4,
  },
  gTrackInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})

const { getDefaultPriceInfo, getElkParams, getBuyUrl } = useProductDiffPrice()
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
const commomJson = useI18n().value.common
const macData = useAttrs().macData || props
// 计算表格列的宽度
const n = Object.keys(props.listHead).length
const otherColumnWidth = 100 / (n + props.firstWidthRate)
const firstColumnWidth = props.firstWidthRate * otherColumnWidth
const routeName = useRoute().name as string

const blockInfo = reactive({
  tableList: [] as any,
})

const renderInfoHandle = (os: string) => {
  const propsInfo: any = os === 'win' ? props : macData

  const tableList = propsInfo.items.data.map((item: any) => {
    const newItem: any = { ...item }
    let showTipInfo = false
    let showPriceInfo = false
    const isSmallTable = item.attributes.items.length <= 3
    const subItem = item.attributes.items.map((subItem: any) => {
      const newSubItem = { ...subItem }
      const linkBtns = ['proDlgBtn', 'checkoutBtn', 'linkBtn']
      let proInfo = getStrapiData(newSubItem.product)
      if (os === 'mac') {
        proInfo = getStrapiData(proInfo.related_products?.data[0]) || proInfo
      }
      if (linkBtns.includes(newSubItem.type)) {
        const goCheckUrl = newSubItem.type !== 'proDlgBtn'
        const priceInfo: any = proInfo.price?.length
          ? getDefaultPriceInfo(proInfo, newSubItem.priceKey || 'LFT')
          : {}
        const href = goCheckUrl
          ? newSubItem.type === 'checkoutBtn'
            ? getBuyUrl(proInfo, propsInfo, priceInfo as any, {})
            : '/' + proInfo.slug + '.htm?open=true&dlg_pid=' + proInfo.pid
          : ''
        if (newSubItem.priceTip) {
          showTipInfo = true
        }
        if (Object.keys(priceInfo).length) {
          showPriceInfo = true
        }
        newSubItem.btnInfo = {
          info: {
            href: goCheckUrl ? href : '',
            showIcon: true,
            label: commomJson.buy_now,
            size: isSmallTable ? 'large' : 'small',
            theme: 'primary',
            slug: proInfo.slug,
            tag: goCheckUrl ? 'a' : 'div',
          },
          priceInfo: showPriceInfo
            ? {
                tip: newSubItem.priceTip,
                price: translatePrice(priceInfo.payment_price, currency[1], locale),
                oriPrice: priceInfo.off_num
                  ? translatePrice(priceInfo.origin_price, currency[1], locale)
                  : '',
              }
            : {},
          pid: proInfo.pid,
          pname: proInfo.name,
          click: goCheckUrl
            ? getElkParams('buy_now', proInfo, {})
            : {
                event: 'click',
                event_category: 'show_buy_window',
                event_label: 'compare_btn',
                pids: [proInfo.pid],
              },
          component: 'MyButtonBuy',
        }

        // mac_blu_ray_player特殊处理
        if (routeName === 'mac_blu_ray_player') {
          newSubItem.btnInfo.priceInfo.price = translatePrice(priceInfo.origin_price, currency[1], locale)
          newSubItem.btnInfo.priceInfo.oriPrice = ''
          newSubItem.btnInfo.info.href = newSubItem.btnInfo.info.href
            .split('coupon')[0]
            .substr(0, newSubItem.btnInfo.info.href.split('coupon')[0].length - 1)
        }
      } else if (newSubItem.type === 'downloadBtn') {
        newSubItem.btnInfo = {
          info: {
            href: proInfo.downloadUrl?.[0].url,
            size: isSmallTable ? 'large' : 'small',
            showIcon: true,
            label: commomJson.free_download,
            theme: 'primary',
            slug: proInfo.slug,
            icon: 'icon-download',
            'data-warden-ck-parm': base64Encode({
              event_label: 'productpage_freeversion',
              pids: [proInfo.pid],
            }),
          },
          priceInfo: {
            tip: '',
            price: '',
            oriPrice: '',
          },
          component: 'MyButtonDownload',
        }
      }
      return newSubItem
    })
    newItem.showTipInfo = showTipInfo
    newItem.showPriceInfo = showPriceInfo
    newItem.attributes.items = subItem
    return newItem
  })
  blockInfo.tableList = tableList
}

renderInfoHandle(useOs().value)

watch(
  () => useOs().value,
  (newVal) => {
    renderInfoHandle(newVal)
  },
)
</script>

<template>
  <div class="block-box" :class="[blockClass.value]">
    <BaseContainer>
      <div class="flex flex-col flex-items-center flex-justify-center">
        <h2 class="text-center" :class="desc ? 'mb20' : 'mb40'" v-html="title"></h2>
        <p v-if="desc" class="mb-desc mb40 text-center" v-html="desc"></p>
        <div class="table-content w100%">
          <table class="c-table">
            <!-- 头部 -->
            <thead class="bg-normal">
              <tr class="head-tr bg-black-0.03">
                <th v-for="(key, idx) in Object.keys(listHead)" :key="'tbh-th' + idx">
                  <div v-html="listHead[key].value"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in blockInfo.tableList" :key="'tbl-tr' + idx" class="bg-normal">
                <template v-for="(tdItem, itemIdx) in item.attributes.items" :key="'tbh-th' + itemIdx">
                  <th v-if="tdItem?.itemLabel" :width="firstColumnWidth + '%'">
                    <div v-html="tdItem.itemLabel"></div>
                  </th>
                  <td
                    v-else-if="tdItem?.type === 'desc'"
                    :width="otherColumnWidth + '%'"
                    v-html="tdItem.desc"
                  ></td>
                  <td v-else :width="otherColumnWidth + '%'">
                    <template
                      v-if="['downloadBtn', 'proDlgBtn', 'checkoutBtn', 'linkBtn'].includes(tdItem.type)"
                    >
                      <div class="mt8 mb8 pro-flex">
                        <template v-if="item.showPriceInfo && tdItem.btnInfo.priceInfo">
                          <div
                            v-if="item.showTipInfo"
                            class="flex-center color-price mb4 font-size-12 h28"
                            v-html="tdItem.btnInfo.priceInfo.tip"
                          ></div>
                          <div class="flex-center color-price gap10 mb16 h32">
                            <span
                              class="font-size-24 font-bold"
                              v-html="tdItem.btnInfo.priceInfo.price"
                            ></span>
                            <del
                              v-if="tdItem.showPrice"
                              class="font-size-14 font-500 gray-color"
                              v-html="tdItem.btnInfo.priceInfo.oriPrice"
                            ></del>
                          </div>
                        </template>
                        <template
                          v-if="tdItem.btnInfo.info.tag !== 'a' && tdItem.btnInfo.component === 'MyButtonBuy'"
                        >
                          <component
                            :is="tdItem.btnInfo.component"
                            v-track:click="tdItem.btnInfo.click"
                            v-bind="{ ...tdItem.btnInfo.info }"
                            data-buy-dlg="show"
                            :data-pid="tdItem.btnInfo.pid"
                            :data-pname="tdItem.btnInfo.pname"
                          />
                        </template>
                        <component
                          :is="tdItem.btnInfo.component"
                          v-else-if="tdItem.btnInfo.component === 'MyButtonDownload'"
                          v-bind="{ ...tdItem.btnInfo.info }"
                        />
                        <component
                          :is="tdItem.btnInfo.component"
                          v-else
                          v-track:click="tdItem.btnInfo.click"
                          v-bind="{ ...tdItem.btnInfo.info }"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <div v-if="tdItem.type == 'icon'">
                        <i
                          class="iconfont-sg font-size-26 success-color"
                          :class="tdItem.iconClass"
                          :style="tdItem.style"
                        ></i>
                      </div>
                      <div v-else-if="tdItem.type == 'text'" v-html="tdItem.text"></div>
                    </template>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.table-content {
  padding: 5px;
  background-color: #ffffff;
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thum {
    height: 10px;
    width: 100px;
    border-radius: 4px;
    background: #949296;
  }
  &::-webkit-scrollbar-track {
    background: #f3f3f3;
    height: 10px;
  }
  .pro-flex {
    display: inline-block;
  }
  .c-table {
    background-color: @bg-white;
    width: 100%;
    th {
      font-weight: bold;
      height: 50px;
    }
    .icon-c-succ {
      font-weight: bold;
    }
    td,
    th {
      text-align: center;
      &:not(:last-child) {
        border-right: 1px solid @border-gray1;
      }
    }
    tr:not(.head-tr) {
      th:nth-child(1) {
        padding: 16px;
        text-align: left;
      }
      &:nth-child(odd) {
        background: #ffffff;
      }
    }
    td {
      padding: 16px;
    }
  }
}
</style>
