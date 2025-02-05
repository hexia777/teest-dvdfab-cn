<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as any,
    default: () => [],
  },
  elkParams: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="sub-items">
    <div v-for="(subObj, idx) in items" :key="idx" class="sub-items-box">
      <template v-if="subObj.title">
        <div v-if="subObj.title" class="font-700" v-html="subObj.title"></div>
        <div v-for="item in subObj.items" :key="item.id" class="item bg-normal">
          <a
            v-track:click="{
              ...elkParams,
              event_value: item.title.toLowerCase().replace(/\s+/g, '_'),
            }"
            :href="item.link"
            class="pname-box-a text-hover-color"
          >
            <div class="pname-box">
              <span class="font-700 pname" v-html="item.title"></span>
              <span v-if="item.off" class="coupon">{{ item.off }}</span>
            </div>
            <div class="desc" v-html="item.desc"></div>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.sub-items {
  .sub-items-box {
    margin-bottom: 20px;
  }
  .item {
    padding: 16px;
    border-radius: 8px;
    width: 280px;
    margin-top: 12px;
  }
  .pname-box {
    @apply flex items-center;
  }
  .pname-box-a {
    display: block;
  }
  .desc {
    @apply pt8;
    font-size: 14px;
    color: #909090;
  }
  .coupon {
    padding: 0.125rem 0.25rem;
    background: #ff3b30;
    border-radius: 0.1875rem 0.1875rem 0.1875rem 0;
    font-size: 0.625rem;
    color: #fff000;
    margin-left: 0.25rem;
  }
}
</style>
