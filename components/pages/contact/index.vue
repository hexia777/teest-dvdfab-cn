<script setup>
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'has-bg bg-normal' }
    },
  },
  contact: {
    type: Object,
    default: () => {},
  },
})
</script>

<template>
  <div class="contact-out block-box" :class="blockClass.value">
    <BaseContainer>
      <div class="assistant">
        <h2 class="title2 mb20 text-center" v-html="contact.title"></h2>
        <div class="assistant-desc mb60 text-center" v-html="contact.desc"></div>
        <div class="assist-flex flex">
          <div class="assist-lf flex-1">
            <div class="contact-flex flex justify-around text-center mr35">
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-date font-size-80"></i>
                <div class="contact-info-item" v-html="contact.contactInfo1"></div>
              </div>
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-time48 font-size-80"></i>
                <div class="contact-info-item" v-html="contact.contactInfo2"></div>
              </div>
              <div class="contact-flex-1">
                <i class="iconfont-sg icon-message font-size-80"></i>
                <div class="contact-info-item" v-html="contact.contactInfo3"></div>
              </div>
            </div>
            <div class="contact-btn-con flex-center text-center mt40">
              <a
                :href="contact.buttonLink"
                class="contact-btn w280 h66 flex-center"
                v-html="contact.button"
              ></a>
            </div>
          </div>
          <div v-if="contact.img" class="assist-rt">
            <my-img
              :src="contact.img"
              :width="contact.imgWidth"
              :height="contact.imgHeight"
              layout="responsive"
              :alt="contact.imgAlt"
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
        @media screen and (max-width: 600px) {
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
    border-radius: @b-radius-md;
    font-size: @font-size;
    line-height: 28px;
    &:hover {
      background: @btn-primary-color-h;
    }
  }
  @media screen and (max-width: 600px) {
    padding-top: 40px;
    .assistant-desc {
      margin-bottom: 20px;
    }
  }
}
</style>
