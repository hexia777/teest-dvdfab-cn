<script setup lang="ts">
enum RecommandDiffCardType {
  new = 'new', // 新用户
  upgrade = 'upgrade', // 升级
  complement = 'complement', // 补全
}

const props = defineProps({
  type: {
    type: String,
    default: 'new', // new (新用户) upgrade(升级) complement(补全)
  },
  title: {
    type: String,
    default: '',
  },
  // 新用户的list
  newDescList: {
    type: Array<any>,
    default: () => [],
  },
  // productList 升级补全用户的产品情况list
  productList: {
    type: Array<any>,
    default: () => [],
  },
  // 升级补全价格信息
  priceGiftInfo: {
    type: Object,
    default: () => {},
  },
  btnList: {
    type: Array<any>,
    default: () => [],
  },
})

const showDesc = ref(0)
const checkDetail = (index: number) => {
  if (index === showDesc.value) {
    showDesc.value = 0
    return
  }
  showDesc.value = index
}
</script>

<template>
  <div
    class="recommand-diff-card flex-center flex-col"
    :class="type !== RecommandDiffCardType.new ? 'old' : ''"
  >
    <div class="title2 text-center mb32" v-html="title"></div>
    <div v-if="type == RecommandDiffCardType.new" class="rdc-content text-center max-w-800">
      <div
        v-for="(item, idx) in newDescList"
        :key="'new-c-list' + idx"
        class="new-c-list flex-col flex-center mb40"
      >
        <div class="title b-radius-md mb12" v-html="item.title"></div>
        <div class="desc" v-html="item.desc"></div>
      </div>
    </div>
    <div v-else class="rdc-content text-center flex-center flex-col max-w-800 mb24">
      <div class="mb40">
        <div
          v-for="(item, idx) in productList"
          :key="'old-c-list' + idx"
          class="old-c-list flex pos-relative"
        >
          <span class="mr15" v-html="item.title"></span>
          <div class="detail" @mouseenter="checkDetail(idx + 1)" @mouseleave="showDesc = 0">
            {{ item.btnText }}
            <ul v-if="showDesc === idx + 1">
              <li v-for="proName in item.proList" :key="proName" v-html="proName"></li>
            </ul>
          </div>
        </div>
      </div>
      <PagesProductGiftBox
        v-bind="{ ...priceGiftInfo, splitLine: { show: true, color: 'rgba(255, 144, 0, 0.2)' } }"
      />
    </div>

    <div class="btn-group flex flex-justify-center gap40">
      <div v-for="(btn, idx) in props.btnList" :key="'btn-item' + idx" class="btn-item">
        <component :is="btn.component" v-bind="{ ...btn.info }" />
        <div v-if="btn.tipText" class="flex flex-justify-center flex-items-center mt16">
          <i :class="btn.tipIconClass"></i>
          <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.recommand-diff-card {
  background-color: #eefaff;
  padding: @gap-md;
  &.old {
    background-color: #fff9f2;
  }
}
.new-c-list {
  .title {
    color: @primary-color;
    background-color: rgba(0, 169, 240, 0.1);
    padding: 2px 16px;
  }
}

.detail {
  width: 60px;
  color: @secondary-color;
  text-decoration-line: underline;
  cursor: pointer;
  ul {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    z-index: 4;
    left: 0;
    transform: translateX(50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    cursor: default;
    text-align: left;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #a2aeb2;
    }
    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: transparent;
    }
  }
}

@media (max-width: 640px) {
  .recommand-diff-card {
    padding: 30px 20px;
  }
  .btn-group {
    gap: 10px;
    :deep(.btn) {
      &.large {
        min-width: 100%;
      }
    }
  }
}
@media (max-width: 414px) {
  .recommand-diff-card {
    padding: 30px 20px;
  }
  .btn-group {
    width: 100%;
    gap: 20px;
    flex-direction: column;
  }
}
</style>
