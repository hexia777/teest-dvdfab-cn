<script lang="ts" setup>
const props = defineProps({
  downloadUrl: { type: String, default: '' },
  learnMoreUrl: { type: String, default: '' },
  content: { type: String, default: '' },
  title: { type: String, default: '' },
  type: {
    type: String,
    default: 'resource',
  },

  summaryPid: {
    type: [String, Number],
    default: '',
  },
  btnList: {
    type: Array<any>,
    default: () => [],
  },
})

const isMobile = useStore.common().mobile
</script>
<template>
  <div class="download-descs resource-summary">
    <div class="liner-bg" :class="{ 'liner-bg-m': isMobile }">
      <div class="product-desc">
        <div class="summary_title" v-html="title"></div>
        <div class="summary_content" v-html="content"></div>
      </div>

      <div class="btn-group">
        <div
          v-for="(btn, idx) in btnList"
          :key="'btn-item' + idx"
          class="btn-item"
          :class="{ 'first-btn': idx === 0 }"
        >
          <component
            :is="btn.component"
            v-if="btn.component == 'MyButtonDownload'"
            v-bind="{ ...btn.info }"
          />
          <component :is="btn.component" v-else v-track:click="btn.click" v-bind="{ ...btn.info }" />
          <div v-if="btn.tipText" class="flex-center mt16">
            <i :class="btn.tipIconClass" class="success-color"></i>
            <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.resource-summary {
  margin-top: 20px;
  position: relative;
  background-image: linear-gradient(0deg, rgb(231, 225, 255) 0%, rgb(225, 249, 255) 100%);
  margin-bottom: 20px;

  .liner-bg {
    // background: url('@{imgPath}/resource/summary_bg.png');
    background: img_url('/resource/summary_bg.png');
    background-size: 100% 100%;
  }

  .liner-bg-m {
    background: none;
  }

  .product-desc {
    font-weight: bold;
    font-size: 18px;
    padding: 10px 30px 20px;
    line-height: 36px;
    :deep(.summary_title) {
      min-height: 36px;
      font-size: 18px;
      line-height: 28px;
      padding-bottom: 12px;
      margin-top: 10px;
      text-align: center;
    }
    :deep(.summary_content) {
      font-size: @font-size-sm;
      line-height: 24px;
      .span-desc {
        padding-top: 6px;
        font-weight: 400;
        line-height: 1.5;
        display: block;
        font-size: @font-size-sm;
      }
      p {
        padding-left: 10px;
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          position: absolute;
          border-radius: 5px;
          left: -1px;
          top: 10px;
          width: 5px;
          height: 5px;
          background: #3b5159;
        }
      }
      li {
        word-break: break-word;
        & + li {
          margin-top: 4px;
        }
      }
      li.color-white {
        color: @base-text-color;
      }
      p.color-white {
        color: @base-text-color;
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
    padding: 10px 30px 30px;
    gap: 40px;
    text-align: center;
    .btn-item {
      &.first-btn {
        //
      }
    }
  }

  @media (max-width: 640px) {
    .btn-group {
      flex-direction: column;
      .btn-item {
        text-align: center;
      }
    }
  }
}
</style>
