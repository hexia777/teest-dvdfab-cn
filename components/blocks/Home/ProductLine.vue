<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  blockClass: {
    type: Object,
    default: () => {},
  },
})

const productLine: any = props.items
</script>

<template>
  <div class="block-box" :class="blockClass && blockClass.value ? blockClass.value : 'has-bg'">
    <BaseContainer>
      <h2 class="text-center wow fadeInDown" v-html="title"></h2>
      <div class="tab-box">
        <div class="tab-content wow fadeInUp">
          <template v-for="(item, index) in productLine" :key="'tab-title-list' + index">
            <div>
              <div :id="'tab-content-' + index" class="tab-content-box">
                <div
                  :style="{ backgroundImage: `url(${item?.media?.data?.attributes?.url})` }"
                  :class="'title-content-bg title-bg-' + index"
                >
                  <div class="time-text" v-html="item.title"></div>
                </div>
                <div class="tab-content-list">
                  <div
                    v-for="(i, n) in item.home_product_card?.data?.attributes?.items"
                    :key="'tab-title-item' + n"
                    class="tab-content-item"
                  >
                    <div class="product-block">
                      <a
                        :href="i.iconLink?.url ? i.iconLink?.url : ' javascript:;'"
                        :target="i.iconLink?.target ? i.iconLink?.target : '_self'"
                        class="product-icon"
                        :class="{ 'no-link': !i.iconLink?.url }"
                      >
                        <my-img
                          :width="i.media?.data?.attributes?.width"
                          :height="i.media?.data?.attributes?.height"
                          :src="i.media?.data?.attributes?.url"
                          :alt="i.mediaAlt"
                        />
                      </a>
                      <div class="product-info-box">
                        <div class="title line-height-1 pt20">
                          {{ i.title }}
                        </div>
                        <div class="desc">{{ i.desc }}</div>
                        <my-button
                          v-if="!i.items || !i.items.length"
                          class="tab-btn"
                          :href="i.iconLink?.url"
                          :target="i.iconLink?.target ? i.iconLink?.target : '_self'"
                          :label="i.iconLink?.label + ' >'"
                          size="normal"
                          theme="border"
                        />
                      </div>
                    </div>
                    <div v-if="i.items && i.items.length" class="link-box">
                      <my-button
                        v-for="(itm, idx) in i.items"
                        :key="'link' + idx"
                        class="link-item"
                        :href="itm.url"
                        :target="i.iconLink?.target ? i.iconLink?.target : '_self'"
                        :label="itm.label + ' >'"
                        size="normal"
                        theme="border"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
<!-- <style lang="less" src="@/assets/style/sprite/index_1x.less"></style> -->
<style scoped lang="less">
.title-content-bg {
  max-width: 862px;
  width: 90%;
  height: 55px;
  margin: 0 auto 10px;
  position: relative;
  .time-text {
    position: absolute;
    // left: 49%;
    // transform: translateX(-50%);
    top: 35px;
    font-size: 18px;
    color: @base-text-color;
  }
}
.title-bg-0 {
  // background: url('@{imgPath}/index/img_new/dvdfab_line.png?t=20230112') no-repeat top center;
  background-repeat: no-repeat;
  background-position: top center;
  .time-text {
    left: 406px;
  }
}
.title-bg-1 {
  // background: url('@{imgPath}/index/img_new/playerfab_line.png?t=20230112') no-repeat top center;
  background-repeat: no-repeat;
  background-position: top center;
  .time-text {
    left: 388px;
  }
}
.title-bg-2 {
  // background: url('@{imgPath}/index/img_new/streamfab_line.png?t=20230112') no-repeat top center;
  background-repeat: no-repeat;
  background-position: top center;
  .time-text {
    left: 392px;
  }
}
.title-bg-3 {
  // background: url('@{imgPath}/index/img_new/ai_line.png?t=20230112') no-repeat top center;
  background-repeat: no-repeat;
  background-position: top center;
  .time-text {
    left: 416px;
  }
}

.tab-content-box {
  margin-top: 60px;
}
.tab-content > .tab-content-box {
  margin-top: 0;
}
.tab-content-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }
}
.tab-content-item {
  width: 49%;
  background: #fff;
  border-radius: 20px;
  padding: 0 0 20px;
  position: relative;
  margin-top: 30px;
  .product-block {
    display: flex;
    justify-content: flex-start;
    text-align: left;
    align-items: center;
  }
  .product-icon {
    flex-shrink: 0;
    transform: scale(0.7);
    img {
      width: 100%;
      height: auto;
    }

    @media (max-width: 768px) {
      width: 98px;
      height: 98px;
      transform: scale(1);
    }
  }
  .no-link {
    img {
      cursor: auto;
    }
  }

  .title {
    margin-bottom: 18px;
    font-size: 24px;
    line-height: 1.2;
  }
  .desc {
    line-height: 22px;
    padding-right: 10px;
  }
  .tab-btn {
    margin-top: 20px;
  }
  .link-box {
    padding: 0 16px;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    .link-item {
      margin-right: 14px;
      margin-bottom: 16px;
      flex-shrink: 0;
      &:hover {
        background: @primary-color;
        .name,
        .icon {
          color: #fff;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .name {
      font-size: 14px;
    }
  }
}
@media (max-width: 900px) {
  .title-content-bg {
    .time-text {
      font-size: 1rem;
      top: 38px;
    }
  }
  .tab-content > .tab-content-box {
    padding-top: 3.75rem;
  }
  .title-bg-0 .time-text {
    left: 47%;
  }
  .title-bg-1 .time-text {
    left: 45%;
  }
  .title-bg-2 .time-text {
    left: 45%;
  }
  .title-bg-3 .time-text {
    left: 48%;
  }
  .banner {
    margin-bottom: 0;
  }
  .title-block {
    font-size: 2.125rem;
    padding-bottom: 1.5rem;
  }

  .tab-title-item {
    min-width: 8rem;
    height: auto;
    padding: 10px 5px;
    &.active {
      background: linear-gradient(-41deg, #009ef0 0%, #06b6ff 100%);
      border-radius: 85px;
      color: #fff;
    }
    .product {
      font-size: 1.25rem;
    }
  }
  .tab-content-list {
    flex-wrap: wrap;
  }
  .tab-content-item {
    width: 93%;
    height: auto;
    margin: 0 auto 1.5rem;
    &:last-child {
      margin-bottom: 0;
    }
    i {
      margin-bottom: 0.5rem;
    }
    .product-icon {
      width: 10rem;
      padding-right: 10px;
    }
    .link-box {
      padding-left: 10rem;
      text-align: left;
      justify-content: flex-start;
      .link-item {
        margin-top: 15px;
        margin-right: 14px;
        text-align: center;
      }
      .link-item:last-child {
        margin-top: 15px;
      }
    }
  }

  .tab-content-item .title {
    font-size: 1.2rem;
  }
}

@media (max-width: 640px) {
  .title-content-bg {
    transform: scale(0.8);
    background-size: cover;
  }

  .title-bg-0 .time-text {
    left: 44%;
  }
  .title-bg-1 .time-text {
    left: 39%;
  }
  .title-bg-2 .time-text {
    left: 40%;
  }
  .title-bg-3 .time-text {
    left: 46%;
  }
}
</style>
