<script setup>
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg bg-normal' }
    },
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  contactInfo1: {
    type: String,
    default: '',
  },
  contactInfo2: {
    type: String,
    default: '',
  },
  contactInfo3: {
    type: String,
    default: '',
  },
  button: {
    type: Object,
    default: () => {},
  },
  media: {
    type: Object,
    default: () => {},
  },
})
const imageData = getStrapiData(props.media) || {}
const commomJson = useI18n().value.common
</script>

<template>
  <div class="contact-out block-box" :class="blockClass.value">
    <BaseContainer>
      <div class="assistant">
        <h2 class="title2 mb20 text-center" v-html="title"></h2>
        <div class="assistant-desc mb60 text-center" v-html="desc"></div>
        <div class="assist-flex flex">
          <div class="assist-lf flex-1">
            <div class="contact-flex flex justify-around text-center mr35">
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-date font-size-80"></i>
                <div class="contact-info-item" v-html="contactInfo1"></div>
              </div>
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-time48 font-size-80"></i>
                <div class="contact-info-item" v-html="contactInfo2"></div>
              </div>
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-message font-size-80"></i>
                <div class="contact-info-item" v-html="contactInfo3"></div>
              </div>
            </div>
            <div class="contact-btn-con flex-center text-center mt40">
              <a
                href="/contact.htm"
                class="contact-btn w280 h66 flex-center"
                v-html="commomJson.contact_us"
              ></a>
            </div>
          </div>
          <div v-if="imageData.url" class="assist-rt">
            <my-img
              :src="imageData.url"
              width="367px"
              height="auto"
              layout="responsive"
              :alt="imageData.alternativeText"
              class="contact-img"
            />
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.icon-date {
  color: #fe8659;
}
.icon-time48 {
  color: @primary-color;
}
.icon-message {
  color: #f67381;
}
.contact-out {
  padding-bottom: 0px !important;
  color: @base-text-color;
  .assistant-desc {
    font-size: @font-size-sm;
    line-height: @base-line-height;
  }
  .assist-flex {
    .assist-lf {
      .contact-flex {
        .contact-flex-1 i {
          line-height: 80px;
        }
        .contact-info-item {
          margin: auto;
          margin-top: 20px;
          width: 160px;
          font-size: @font-size-sm;
          color: @base-text-color;
          line-height: @base-line-height;
        }
        @media screen and (max-width: 640px) {
          margin: auto;
          flex-direction: column;
          .contact-flex-1 {
            margin-top: 20px;
            i {
              scale: 0.85;
            }
          }
        }
      }
    }
    .assist-rt {
      padding-top: 14px;
      @media screen and (max-width: 1024px) {
        display: none;
      }
    }
  }
  .contact-btn {
    background: @btn-primary-color;
    color: @text-white-color;
    border-radius: 60px;
    font-size: @font-size;
    line-height: 28px;
    &:hover {
      background: @btn-primary-color-h;
    }
  }
}
@media (max-width: 1024px) {
  .contact-out {
    padding-bottom: 80px !important;
  }
}

@media (max-width: 640px) {
  .contact-out {
    .assistant-desc {
      margin-bottom: 20px;
    }
  }
}
</style>
