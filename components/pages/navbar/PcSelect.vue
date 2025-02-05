<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
const reportTrackDatas = async (menu: any) => {
  const { $trace } = useNuxtApp() as any
  const data = {
    event: 'hover',
    event_label: 'more',
    event_value: menu?.title?.toLowerCase(),
    event_category: 'nav',
    event_target: { position: 'main_nav_header' },
  }
  await $trace.traceCustomEvent(data)
}
</script>

<template>
  <div id="pcSelect" class="pc-select">
    <a
      v-for="(item, index) in items"
      :key="index"
      v-track:click.stop="{
        event: 'click',
        event_label: 'more',
        event_value: item?.title?.toLowerCase(),
        event_target: { position: 'main_nav_header' },
        event_category: 'nav',
      }"
      class="pc-select-div"
      :href="item?.link"
      @mouseenter="reportTrackDatas(item)"
    >
      <i :class="item?.icon"></i>
      <div>
        <div class="font-700 pro-name" v-html="item?.title"></div>
        <div class="my-desc-p" v-html="item?.desc"></div>
      </div>
    </a>
  </div>
</template>
<style scoped lang="less">
.pc-select {
  background: #ffffff;
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
  border-radius: 0px 0px 12px 12px;
  align-items: center;
  color: #333;
  padding: 12px;
  .pc-select-div {
    padding: 12px;
    width: 346px;
    display: flex;
    align-items: center;
    gap: 20px;
    i {
      width: 44px;
      flex-shrink: 0;
    }
    p {
      color: #909090;
    }
    &:hover {
      background: #f1fafd;
      border-radius: 8px;
      .pro-name {
        color: #00a9f0;
      }
    }
  }
}
</style>
