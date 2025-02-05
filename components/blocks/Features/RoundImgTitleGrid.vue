<script setup lang="ts">
defineOptions({ name: 'RoundImgTitleGrid' })
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => ({
      id: '0',
      value: 'has-bg bg-normal',
    }),
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  items: {
    type: Array<any>,
    default: () => [],
  },
  bottomDesc: {
    type: String,
    default: '',
  },
})

const iconBgArr = [
  'linear-gradient( 135deg, #85C7FF 0%, #5BB4FF 50%, #85C7FF 100%)',
  'linear-gradient( 135deg, #FFD58A 0%, #FFC35A 50%, #FFD58A 100%)',
  'linear-gradient( 135deg, #FF87C1 0%, #FF61AE 50%, #FF87C1 100%)',
  'linear-gradient( 135deg, #71EABB 0%, #3EDB9E 50%, #71EABB 100%)',
  'linear-gradient( 135deg, #AB8CFF 0%, #9A74FF 50%, #AB8CFF 100%)',
  'linear-gradient( 135deg, #FFA883 0%, #FF8F61 50%, #FFA883 100%)',
]

const getImgData = (item: any) => {
  return getStrapiData(item?.media) || {}
}
</script>

<template>
  <div class="block-box" :class="[props?.blockClass?.value, props.bottomDesc ? 'pb0!' : '']">
    <BaseContainer>
      <h2 v-if="props.title" class="title2 break-words text-center" v-html="props.title"></h2>
      <p v-if="props.desc" class="text-center pt-20" v-html="props.desc"></p>
      <ul v-if="props?.items?.length" :class="[!props.title && !props.desc ? '' : 'pt-40']" class="grid-box">
        <li v-for="(item, index) in props.items" :key="item.id" class="grid-item b-radius-sm">
          <div
            class="grid-icon-bg w100 h100"
            :style="{
              background: `${iconBgArr[index]}`,
            }"
          >
            <MyImg
              :src="getImgData(item).url"
              layout="responsive"
              :alt="item.mediaAlt || item.title || ''"
              class="grid-icon w100% h100%"
            />
          </div>
          <div v-if="item.title" class="title title4 mt-40 text-center" v-html="item.title"></div>
          <p v-if="item.desc" class="desc mt-12 text-center" v-html="item.desc"></p>
        </li>
      </ul>
    </BaseContainer>

    <div v-if="props.bottomDesc" class="desc-box mt80">
      <BaseContainer>
        <p class="text-center py-20" v-html="props.bottomDesc"></p>
      </BaseContainer>
    </div>
  </div>
</template>

<style scoped lang="less">
.grid-box {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.grid-item {
  position: relative;
  width: calc((100% - 60px) / 3);
  padding: 30px;
  margin-top: 50px;
  background: #fff;

  .grid-icon-bg {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .grid-icon {
    z-index: 10;
  }

  .grid-icon-bg {
    box-shadow: 0px 4px 12px 0px rgba(13, 53, 68, 0.1);
    border: 2px solid #ffffff;
    border-radius: 50%;
  }
}

.desc-box {
  .bg-black-opacity(0.03);
}

// 移动端兼容
@media screen and (max-width: @screen-xl) {
  .grid-item {
    width: 100%;
    margin-bottom: 10px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>

<style lang="less">
.block-box.pb0\! {
  & + .block-box {
    padding-top: @gap-lg;
  }
}
</style>
