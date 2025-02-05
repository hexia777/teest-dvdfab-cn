<script setup lang="ts">
const props = defineProps({
  imgPath: { type: String, default: () => '' },
  imgWidth: { type: Number, default: () => 600 },
  imgHeight: { type: Number, default: () => 400 },
  subTitleHeight: { type: Number, default: 0 },
  imgBoxHeight: { type: Number, default: 0 },
  alt: { type: String, default: () => '' },
  title: { type: String, default: () => '' },
  desc: { type: String, default: () => '' },
  isMobile: { type: Boolean, default: () => false },
})
const emits = defineEmits(['getSubTitleHeight', 'getImgBoxHeight'])

const imgBox = ref<any>(null)
const scrollBar = ref<any>(null)
const topContent = ref<any>(null)
const subTitle = ref<any>(null)
// const imgBoxHeight = ref(0)
// const topContentHeight = ref(0)
const spacePaddingHeight = ref(40)

onMounted(() => {
  nextTick(() => {
    handleViewHeight()
  })
  window.addEventListener('resize', handleViewHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleViewHeight)
})

const handleViewHeight = () => {
  if (imgBox.value && subTitle.value) {
    // imgBoxHeight.value = imgBox.value.offsetHeight
    // imgBoxHeight.value = imgBox.value.offsetHeight
    // topContentHeight.value = topContent.value.offsetHeight
    emits('getSubTitleHeight', subTitle.value.offsetHeight)
    emits('getImgBoxHeight', imgBox.value.offsetHeight)
  }
}

const itemMouseover = () => {
  // if (imgBox.value) {
  //   imgBoxHeight.value = imgBox.value.offsetHeight
  // }
  scrollBar.value.style.transform = `translateY(-${props.imgBoxHeight}px)`
  subTitle.value.style.padding = `20px 0`
}

const itemMouseleave = () => {
  scrollBar.value.style.transform = `translateY(0)`
  subTitle.value.style.padding = `0`
}
</script>

<template>
  <div v-if="!isMobile">
    <div
      class="card-item"
      :style="{ maxHeight: `${subTitleHeight + spacePaddingHeight + imgBoxHeight}px` }"
      @mouseover="itemMouseover"
      @mouseleave="itemMouseleave"
    >
      <div ref="scrollBar" class="scroll-bar">
        <div ref="topContent">
          <div ref="imgBox" class="flex-center" style="background-color: #ebf9ff">
            <my-img
              :style="{ minHeight: `${imgBoxHeight}px` }"
              :src="imgPath"
              :width="imgWidth ? imgWidth : 600"
              :height="imgHeight ? imgHeight : 400"
              layout="responsive"
              :alt="alt || imgPath"
              class="lazy-loading-status img"
            />
          </div>
          <div class="sub-title">
            <h3
              ref="subTitle"
              class="sub-title-text"
              :style="{ minHeight: `${subTitleHeight}px` }"
              v-html="title"
            ></h3>
          </div>
        </div>
        <div class="card-desc" :style="{ height: `${imgBoxHeight - 10 - 40}px` }">
          <div class="card-desc2" v-html="desc"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="fts-m-1">
    <h3 class="fts-m-title" v-html="title"></h3>
    <div class="fts-m-desc" v-html="desc"></div>
    <div class="fts-m-img">
      <my-img
        :src="imgPath"
        :width="imgWidth ? imgWidth : 600"
        :height="imgHeight ? imgHeight : 400"
        layout="responsive"
        :alt="alt || imgPath"
        class="lazy-loading-status img"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-item {
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background-color: @primary-color;
  .scroll-bar {
    transition: transform 1s;
    img {
      max-width: 100%;
      height: auto;
      aspect-ratio: 3/2;
      object-fit: contain;
    }
  }
}

.card-desc {
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, #ffffff 100%);
  margin: 0px 10px 0px 10px;
  color: @base-text-color;
  padding: 20px 0;
  border-radius: 0 0 10px 10px;
}

.sub-title {
  min-height: 108px;
  padding: 20px;
  background-color: @primary-color;

  .sub-title-text {
    box-sizing: content-box;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    transition: all 1s;
    line-height: 1.2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.card-desc2 {
  padding: 0 20px;
  // padding-top: 20px;
  max-height: 100%;
  overflow-y: auto;
  :deep(a) {
    color: @primary-color;
    &:hover {
      text-decoration: underline;
    }
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    width: 234px;
    border-radius: 15px;
    background: #a9eaff;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #fff;
  }
}
.card-desc3 {
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px;
  padding-top: 60px;
  text-align: center;
}

.fts-s1 {
  padding-bottom: 80px;
  .container {
    background-position: center;
    background-size: cover;
  }
}
.fts-m-1 {
  .fts-m-desc {
    :deep(a) {
      color: @primary-color;
    }
  }
}
.fts-special-1 {
  background-color: #5bc4f4;
}
.s1-tit {
  padding-top: 30px;
  font-size: 40px;
  font-weight: bold;
  color: @base-text-color;
  padding-bottom: 40px;
  text-align: center;
}
.s1-mobile-tit {
  text-align: center;
  color: @base-text-color;
}

// 移动端样式
.fts-m-1 {
  text-align: center;
  // background-color: #fff;
  padding-top: 30px;
  .fts-m-title {
    color: @base-text-color;
    margin-bottom: 30px;
    font-weight: 700;
    line-height: 1.4;
    padding-top: 30px;
    font-size: 32px;
  }
  .fts-m-desc {
    margin-bottom: 30px;
    line-height: 1.625;
  }
}
.fts-m-img {
  margin: 0 auto;
  img {
    max-width: 100% !important;
    height: auto !important;
  }
}
@media (max-width: 768px) {
  .fts-m-img img {
    height: auto !important;
  }

  .s1-tit {
    font-size: 30px;
  }
}
@media (max-width: 768px) {
  .fts-m-1 {
    padding-top: 1%;
    padding-bottom: 1%;
  }
}
@media (max-width: 640px) {
  .fts-m-1 {
    .fts-m-title {
      font-size: 1.125rem;
      text-align: left;
    }
    .fts-m-desc {
      text-align: left;
    }
    .fts-m-img {
      // padding: 0 5%;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
