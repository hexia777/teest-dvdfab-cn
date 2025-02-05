<script setup lang="ts">
const props = defineProps({
  faqs: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  startNum: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="">
    <BaseContainer>
      <h2 class="font-size-40 text-center mb40">
        <span v-html="title"></span>
      </h2>
      <ul>
        <li v-for="(item, index) in faqs" :key="item.id" class="item">
          <a :href="`/faq/${item.route_name}.htm`" class="item-link">
            <i
              v-if="index + startNum < 3"
              class="iconfont-sg icon-more-star font-size-32 mr24"
              :class="`star_${index + 1}`"
            >
              <span class="faq-icon-num">{{ index + startNum + 1 }}</span>
            </i>
            <label v-else class="faq-num mr24">{{ index + startNum + 1 }}</label>
            <span class="line-height-28" v-html="item.title"></span>
          </a>
        </li>
      </ul>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.item {
  border-top: 2px solid #eeeeee;
  padding: 20px 32px;
  font-size: 18px;
  font-weight: 700;

  &:last-child {
    border-bottom: 2px solid #eeeeee;
  }
  &:hover {
    a {
      color: @primary-color;
    }
  }
  .item-link {
    display: flex;
    align-items: center;
    line-height: 1;
    .icon-more-star {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      .faq-icon-num {
        position: absolute;
        font-size: 16px;
        color: #fff;
        z-index: 2;
      }
    }
    .star_1 {
      color: #ff551d;
    }
    .star_2 {
      color: #ff941d;
    }
    .star_3 {
      color: #ff9000;
    }
  }
  .faq-num {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: #909090;
  }
}
</style>
