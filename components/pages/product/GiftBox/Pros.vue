<script setup lang="ts">
const props = defineProps({
  // 子产品列表
  pros: {
    type: Array as any,
    default: () => [],
  },
})
const commomJson = useI18n().value.common
const locale = useStore.common().locale
const currency = useStore.product().currency[locale]
</script>

<template>
  <div class="country-price-box">
    <!-- 不同国家的产品 -->
    <div class="country-content">
      <ul>
        <li v-for="item in pros" :key="item.key">
          <div class="pros-box">
            <div class="lt">
              <a v-if="item.url" :href="item.url" class="country-content-a">
                <span class="price-txt" :class="{ free: item.pid > 9999 }" v-html="item.name"> </span>
              </a>
              <span v-else class="price-txt" :class="{ free: item.pid > 9999 }" v-html="item.name"> </span>
              <span v-if="item.hot" class="aio-off-icon ml4" v-html="commomJson.hot"></span>
            </div>
            <div class="rt">
              <span v-if="item.free" v-html="commomJson.free"></span>
              <span v-else v-html="translatePrice(item.price, currency[1], locale)"></span>
              <del
                class="pl12"
                :class="{ 'old-price-none': item.free }"
                v-html="translatePrice(item.free ? pros[1]?.oldPrice : item.oldPrice, currency[1], locale)"
              ></del>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.old-price-none {
  visibility: hidden;
}
.country-price-box {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin: 24px auto;
  padding: 24px;
  padding-bottom: 10px;
  .country-tit {
    font-size: 20px;
    color: #3b5159;
    font-weight: bold;
  }
  .country-sel-box {
    margin-top: 25px;
    .sel-tit {
      color: #3b5159;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #e4eaeb;
      white-space: nowrap;
      .txt {
        margin-right: 40px;
        padding-bottom: 15px;
        cursor: pointer;
        display: inline-block;
      }
      .txt.sel {
        color: #00a9f0;
        border-bottom: 2px solid #00a9f0;
      }
    }
  }
  .country-content {
    font-size: 14px;
    &:after,
    &:before {
      content: ' ';
      display: table;
      clear: both;
    }

    li {
      position: relative;
      width: 46%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 14px;
      display: inline-block;
      line-height: 1;
      margin-bottom: 20px;
      &:nth-of-type(2n) {
        margin-left: 8%;
      }
      a:hover {
        color: #ffffff;
        text-decoration: underline;
      }
      .price-txt {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
        width: 100%;
        b {
          font-weight: normal;
        }
      }
      .price-txt.free {
        color: #ffffff;
      }
      &:after {
        content: ' ';
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 48%;
        background: #ffffff;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      .old-price {
        opacity: 0.5;
        text-decoration: line-through;
        padding-left: 12px;
      }
      .old-price-none {
        visibility: hidden;
        padding-left: 12px;
      }
    }
  }
}
.country-content-a {
  display: inline-block;
}
.aio-off-icon {
  width: fit-content;
  border-radius: 45px 60px 60px 0;
  color: #fff;
  padding: 3px 6px;
  font-size: 14px;
  display: inline-block;
  background: linear-gradient(270deg, #f71637, #ff4250);
  line-height: 1;
}
.pros-box {
  @apply flex flex-between;
}
.rt {
  @apply flex;
  del {
    opacity: 0.5;
  }
}
.theme-playerfab {
  .country-price-box {
    .country-content {
      li {
        position: relative;
        width: 49%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 14px;
        display: inline-block;
        line-height: 1;
        &:nth-of-type(2n) {
          margin-left: 2%;
        }
        a:hover {
          color: #ffffff;
          text-decoration: underline;
        }
        &:after {
          content: ' ';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 48%;
          background: #ffffff;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }
  @media (max-width: 1200px) {
    .country-price-box {
      .country-content {
        & li:nth-of-type(2n) {
          padding-right: 16px;
          margin-left: 0;
        }
        li {
          width: 100%;
          box-sizing: border-box;
          padding-right: 16px;
          .price-txt {
            display: flex;
          }
        }
      }
    }
  }
}
@media (max-width: 1200px) {
  .icon_coupon {
    top: 20px;
  }
  .sale-desc-box {
    display: inline-block;
    width: 100%;
    li {
      float: none;
      width: 100%;
    }
  }
  .pri-bottom {
    display: block;
    text-align: center;
    margin: 0 auto;
    .r_le {
      padding-right: 0;
    }
  }
  .pri-bot-box {
    margin-bottom: 10px;
  }
  .switch-box a {
    margin-right: 80px;
  }

  .title {
    font-size: 32px;
  }

  .country-price-box {
    .country-sel-box {
      .sel-tit {
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
      }
    }
    .country-content {
      & li:nth-of-type(2n) {
        padding-right: 16px;
        margin-left: 0;
      }
      li {
        width: 100%;
        box-sizing: border-box;
        padding-right: 16px;
        .price-txt {
          display: flex;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  // .time-count {
  //   padding-left: 25px;
  // }
  .switch-box a {
    margin-right: 50px;
  }
  .banner .left .img-box i {
    transform: scale(0.8);
  }
  .btn-icon-group + .btn-icon-group {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .icon_coupon {
    top: 6px;
  }
  .coupon-tips {
    padding-left: 0.5625rem;
  }
  .alarm-clock-box {
    padding-bottom: 20px;
  }
  .sale-desc-box {
    padding-bottom: 0;
  }
  .iframe-box {
    width: 100%;
    height: auto;
    padding: 0;
  }
  .banner .left .img-box i {
    left: 6%;
    top: -15%;
  }
  .promotion-text {
    width: 100%;
    margin-top: 40px;
    i {
      left: 0;
    }
  }
  .promotion-text-block {
    padding-right: 10px;
  }
  .banner {
    padding: 40px 0;
    .icon_off {
      top: -19%;
      left: 25.5%;
      transform: scale(0.8);
    }
    .container {
      display: block;
      .fl,
      .col-xs-12 {
        float: none;
      }
      .left {
        width: 100%;
        max-width: 26.875rem;
        margin-left: auto;
        margin-top: 20px;
        margin-right: auto;
        .img-box {
          padding: 0 4.875rem;
          position: relative;
        }
      }
      .right {
        padding: 0;
        text-align: center;
        .title {
          font-size: 1.25rem;
          text-align: center;
          margin-top: 1rem;
        }
        .sale-desc {
          display: inline-block;
          text-align: left;
        }
        p,
        .title-sub,
        .gift-list {
          display: none;
        }
        .right-center {
          .item-1 {
            text-align: center;
            & > div {
              display: block;
            }
            .price-box {
              text-align: center;
              font-size: 1.5rem;
              padding: 15px 0;
              .price {
                font-size: 1.5rem;
              }
            }
            .btn-box {
              margin: 0;
              margin-bottom: 15px;
            }
          }
        }
        .version-box {
          margin: 16px auto 0;
          .win.selected {
            background-size: 5rem;
            background-position: 1.25rem -72.65rem;
          }
          .mac {
            background-size: 5rem;
            background-position: 1.25rem -99.8125rem;
          }
        }
      }
    }
  }
  .guarantee-outer {
    padding: 0;
  }
  .block,
  .block-content {
    .container {
      .title {
        font-size: 24px;
      }
      .tc,
      .desc {
        font-size: 1rem;
      }
    }
  }

  .block-4 {
    margin-top: 180px;
  }
  .use-guide-detail {
    font-size: 1rem;
    margin: 1rem 0;
  }
  .content {
    width: 95%;
  }

  .contact-box {
    span {
      display: block;
    }
    .btn {
      margin-top: 15px;
      margin-left: 0;
    }
  }

  .btn-bottom-icons {
    & > span {
      display: block;
      padding: 5px 0;
      font-size: 14px;
      &:last-child {
        margin-left: 0;
      }
    }
  }
  .off-icon {
    left: 100px !important;
  }
  .guarantee-box {
    text-align: center;
    margin-top: 1rem;
    padding-top: 50px;
    padding-left: 40px;
    border-radius: 0;
    .content .title {
      text-align: center;
    }
    .img-box {
      position: initial;
    }
  }
}

@media (max-width: 660px) {
  .banner .left .img-box i {
    transform: scale(0.6);
    left: 9%;
    top: -17%;
  }
  .icon_coupon {
    top: 0.75rem;
    left: 1rem;
  }
  .coupon-tips {
    line-height: 1.25rem;
    padding-left: 3.75rem;
    text-align: left;
  }
}
@media (max-width: 414px) {
  .country-price-box .country-content li {
    padding-left: 10px;
    padding-right: 0;
    &:nth-of-type(2n) {
      padding-right: 0;
    }
    .old-price {
      padding-left: 4px;
    }
  }
  .hot-tip {
    font-size: 10px;
    margin-left: 2px;
  }
  .off-icon {
    top: -18px !important;
  }
  .banner .left .img-box {
    min-height: unset;
  }
  .pri-bottom {
    flex-direction: column;
    align-items: center;
    .r_le:last-of-type {
      margin-top: 10px;
    }
  }
}
@media (max-width: 360px) {
  .banner .left .img-box i {
    top: -21%;
  }
  .country-price-box {
    padding-left: 7px;
    padding-right: 7px;
  }
}
</style>
