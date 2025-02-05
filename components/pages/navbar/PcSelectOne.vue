<script setup lang="ts">
defineOptions({ name: 'NavBarPc' })
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
})
const reportTrackDatas = async (title: string) => {
  const { $trace } = useNuxtApp() as any
  const data = {
    event: 'hover',
    event_label: title?.toLowerCase(),
    event_value: title?.toLowerCase(),
    event_category: 'nav',
    event_target: { position: 'main_nav_header' },
  }
  await $trace.traceCustomEvent(data)
}
</script>

<template>
  <div class="pc-select-one">
    <a
      v-track:click.stop="{
        event: 'click',
        event_label: title?.toLowerCase(),
        event_value: title?.toLowerCase(),
        event_target: { position: 'main_nav_header' },
        event_category: 'nav',
      }"
      class="pc-select-div"
      :href="link"
      @mouseenter="reportTrackDatas(title?.toLowerCase())"
    >
      <i :class="icon"></i>
      <div>
        <div class="font-700 pro-name" v-html="title"></div>
        <div class="my-desc-p" v-html="desc"></div>
      </div>
    </a>
  </div>
</template>
<style scoped lang="less">
.pc-select-one {
  position: absolute;
  top: 88px;
  background: #ffffff;
  box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1), 0px -4px 8px 0px rgba(13, 53, 68, 0.06);
  border-radius: 12px;
  align-items: center;
  padding: 12px;
  color: #333;
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
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 40px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
  }
  &:hover {
    background: #f1fafd;
    .pro-name {
      color: #00a9f0;
    }
  }
  &:hover::before {
    border-bottom-color: #f1fafd;
  }
}
</style>
