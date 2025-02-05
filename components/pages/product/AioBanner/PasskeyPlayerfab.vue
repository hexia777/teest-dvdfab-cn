<script setup lang="ts">
const props = defineProps({
  osText: { type: String, default: 'win' },
  skeletonLoading: { type: Boolean, default: false },
  hasMac: { type: Boolean, default: false },
  // 是否展示 gift
  giftShow: {
    type: Boolean,
    default: true,
  },
  reloadBtnData: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // box 图片
  bannerInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const commomJson = useI18n().value.common
</script>
<template>
  <div class="aio-banner-content">
    <div class="container-content">
      <div class="left">
        <h1 class="mobile-show title text-center c-white mb40" v-html="bannerInfo.title"></h1>
        <!-- 盒子图 -->
        <div class="img-box" :class="{ 'opacity-full': skeletonLoading }">
          <img
            width="510"
            height="510"
            layout="responsive"
            style="max-width: 510px"
            :src="bannerInfo.boxImg?.url"
            :alt="bannerInfo.boxImg?.alternativeText || bannerInfo.title"
          />
          <!-- 折扣 -->
          <div class="off_1 aio-off-icon">
            <span
              v-if="bannerInfo.type != 'upgrade'"
              class="off-value z-2"
              v-html="bannerInfo.couponText"
            ></span>
            <span v-else class="upgrade-off" v-html="commomJson.upgrade_off"></span>
          </div>
        </div>
        <div
          v-if="giftShow && bannerInfo.giftImgs?.length"
          class="gift-box"
          :class="{ 'opacity-full': skeletonLoading }"
        >
          <div class="icon_gift_1 git-tip-icon">
            <i class="iconfont-sg icon-gift"> </i>
          </div>
          <template v-for="(gItem, idx) in bannerInfo.giftImgs" :key="'gift-img-' + idx">
            <template v-if="idx == 2">
              <div
                v-if="bannerInfo.type !== 'upgrade'"
                :class="[`icon_gift_${idx + 2}`]"
                class="gift-icon"
                :style="`background-image: url('${gItem}')`"
              ></div>
            </template>
            <div
              v-else
              :class="[`icon_gift_${idx + 2}`]"
              class="gift-icon"
              :style="`background-image: url('${gItem}')`"
            ></div>
          </template>
        </div>
      </div>
      <div class="right col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <h1 class="title mobile-hide" v-html="bannerInfo.title"></h1>
        <p class="desc-p mt10" v-html="bannerInfo.desc"></p>
        <PagesProductGiftBoxPros
          v-if="bannerInfo.childPros?.length"
          :pros="bannerInfo.childPros"
          class="pros"
          :class="{ 'opacity-full': skeletonLoading }"
        />
        <div class="right-bottom-box" :class="{ 'opacity-full': skeletonLoading }">
          <p v-if="bannerInfo.type == 'upgrade'" class="upgrade-desc" v-html="bannerInfo.upgradeDesc"></p>
          <div class="price-gift-box">
            <div v-if="bannerInfo.priceGiftInfo" class="price-box">
              <p class="pr32">
                <span v-html="bannerInfo.priceGiftInfo.finalLabel"></span>
                <span
                  class="product-info-price ml10 font-size-32 color-price font-bold"
                  :style="bannerInfo.priceGiftInfo.finalPriceStyle"
                  v-html="bannerInfo.priceGiftInfo.finalPrice"
                ></span>
              </p>
              <p class="flex flex-between">
                <span
                  v-if="bannerInfo.priceGiftInfo.standardLabel"
                  v-html="bannerInfo.priceGiftInfo.standardLabel"
                ></span>
                <b
                  v-if="bannerInfo.priceGiftInfo.standardPrice"
                  class="ml10 w56 text-right"
                  v-html="bannerInfo.priceGiftInfo.standardPrice"
                ></b>
              </p>
              <p v-if="bannerInfo.priceGiftInfo.specialLabel" class="flex flex-between">
                <span v-html="bannerInfo.priceGiftInfo.specialLabel"></span>
                <del class="ml10 w56 text-right" v-html="bannerInfo.priceGiftInfo.specialPrice"></del>
              </p>

              <div v-if="bannerInfo.priceGiftInfo.avgPriceText" class="text-right">
                <span class="font-s-14 pro-per-price" v-html="bannerInfo.priceGiftInfo.avgPriceText"></span>
              </div>
            </div>
          </div>
          <div class="right-center">
            <div v-if="reloadBtnData.value" class="btn-group">
              <div
                v-for="(btn, idx) in bannerInfo.btnList"
                :key="'btn-item' + idx"
                class="btn-item"
                :class="{ 'first-btn': idx === 0 }"
              >
                <component
                  :is="btn.component"
                  v-if="btn.component === 'MyButtonBuy' && reloadBtnData.reloadOs[osText]"
                  v-track:click="btn.click"
                  v-track:exposure="btn.exposure"
                  v-bind="{ ...btn.info }"
                />
                <component :is="btn.component" v-else v-bind="{ ...btn.info }" />
                <div v-if="btn.tipText" class="flex flex-center mt16">
                  <i :class="btn.tipIconClass"></i>
                  <span class="font-s-14 tip-text" v-html="btn.tipText"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-if="hasMac" class="version-box mt50">
            <BaseSwitchOs class="mb18" @tab-click="switchClick" />
          </div> -->
        </div>
        <div v-if="bannerInfo.bottomTips" :class="{ 'opacity-full': skeletonLoading }">
          <div class="line"></div>
          <div class="bottom-tips">
            <div class="bottom-tips-lt">
              <i class="iconfont-sg icon-bell"></i>
              <span v-html="bannerInfo.newProductDesc"></span>
            </div>
            <div class="bottom-tips-rt">
              <MyButton v-bind="{ ...bannerInfo.btnInfo }" class="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-skeleton :loading="skeletonLoading" animated>
      <template #template>
        <div class="flex gap80 skeleton-content">
          <div class="skeleton-imgbox">
            <el-skeleton-item variant="image" class="w340! h340!" />
          </div>
          <div class="w100% flex flex-col">
            <div class="title title1 mobile-hide opacity-full" v-html="bannerInfo.title"></div>
            <div class="desc-p mt10 opacity-full" v-html="bannerInfo.desc"></div>
            <el-skeleton-item variant="text" class="w100%! h32! mb24 mt24" />
            <el-skeleton-item variant="text" class="w100%! h32! mb24" />
            <el-skeleton-item variant="text" class="w100%! h32! mb74" />
            <div class="flex gap20 sc-mobile">
              <el-skeleton-item variant="button" class="w100%! max-w-240 h66! b-rd-66!" />
              <el-skeleton-item variant="button" class="w100%! max-w-240 h66! b-rd-66!" />
            </div>
            <el-skeleton-item v-if="bannerInfo.bottomTips" variant="text" class="w100%! h32! mt24" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style lang="less" scoped>
.mobile-show {
  display: none;
}
.mobile-hide {
  display: block;
}
@media (max-width: 640px) {
  .mobile-show {
    display: block;
  }
  .mobile-hide {
    display: none;
  }
  .desc-p {
    display: none;
  }
}

.icon-bell {
  color: #f9e600;
  margin-right: 8px;
}
.aio-off-icon {
  width: fit-content;
  border-radius: 60px 60px 60px 0;
  color: #ffeb00;
  padding: 4px 12px 5px 9px;
  font-size: 1.25rem;
  display: inline-block;
  background: linear-gradient(270deg, #f71637, #ff4250);
}
.aio-banner-content {
  position: relative;
  .el-skeleton {
    padding-top: 35px;
    position: absolute;
    width: calc(100% - 80px);
    top: 0;
    :deep(.el-skeleton__image) {
      svg {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    .skeleton-content {
      width: 100%;
      .opacity-full {
        opacity: 0;
      }
      .skeleton-imgbox {
        width: 45% !important;
        max-width: 340px !important;
      }
    }
    .el-skeleton__image {
      width: 100% !important;
    }
  }
}
.container-content {
  display: flex;
  .opacity-full {
    opacity: 0;
  }
}
.banner-box {
  padding: 80px 0;
  .off_1 {
    position: absolute;
    top: -10px;
    left: 17%;
    text-align: center;
    font-size: @font-size-md-s;
    font-weight: 700;
    color: #ffeb00;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .upgrade-off {
      position: absolute;
      font-size: @base-font-size;
      // line-height: @base-line-height;
    }
    .icon-m-off-tag {
      font-size: 90px;
    }
  }
  .left {
    max-width: 363px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 2.25rem;
    .img-box {
      padding: 0 30px;
      position: relative;
      img {
        /* max-width: 100%; */
        width: 100%;
        height: auto;
      }
    }
    .gift-box {
      width: 18.75rem;
      height: 6.5rem;
      max-width: 100%;
      padding: 0 30px;
      background: hsla(0, 0%, 100%, 0.08);
      border-radius: 8px;
      border: 1px dashed hsla(0, 0%, 100%, 0.3);
      -webkit-backdrop-filter: blur(6px);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .gift-icon {
        vertical-align: middle;
        text-align: center;
        position: relative;
        padding: 0 5px;
        height: 80px;
        &:last-child {
          border: 0;
          background-size: 50%;
        }
        img {
          max-width: 100%;
        }
      }
      .icon_gift_1 {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #f8c92e;
        text-align: center;
        line-height: 26px;
        color: #fff;
        position: absolute;
        right: -14px;
        top: -10px;
        border: 0;
      }
    }
  }
  .right {
    overflow: hidden;
    color: #fff;
    h1,
    h2 {
      text-align: left;
      font-weight: bold;
    }
    .blob {
      font-size: 22px;
    }
    .title-sub {
      font-size: 20px;
      padding: 25px 0 5px;
      font-weight: bold;
    }
    .price-box {
      display: inline-block;
      .price {
        font-size: 32px;
        color: #ffe82a;
        b {
          font-size: 18px;
        }
      }
      .original-price {
        font-size: 18px;
        color: #fff;
        text-decoration: line-through;
      }
      .hasVat {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        text-align: right;
      }
    }
    .buy-btn i {
      margin-right: 10px;
      vertical-align: middle;
    }
    .right-center {
      display: flex;
      .btn-group {
        display: flex;
        gap: 50px;
        // .first-btn {
        //   margin-right: 50px;
        // }
      }
    }

    .playerfab-times {
      width: 666px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 2px 5px 9px 0px rgba(0, 0, 0, 0.31);
      border-radius: 4px;
      padding: 12px 18px;
      margin-top: 21px;
      .count-down-box span {
        width: 31px;
      }
      .count-down-box {
        .time-box {
          width: 275px;
          background: img_url('/product/1x_m/en/all_in_one/count_down_bg.png') no-repeat center;
          span {
            width: 31px;
            font-size: 27px;
            color: #ffe82a;
          }
        }
        .info-box {
          width: 275px;
          color: #fff;
        }
      }
      .times_text {
        margin-top: 21px;
      }
      .times-show-box {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .times-rt {
        .player-title {
          font-size: 18px;
        }
        .free-text {
          color: #ffe82a;
          font-size: 28px;
          text-transform: uppercase;
        }
        .player-price {
          text-decoration: line-through;
        }
      }
    }
    .price-gift-box {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-bottom: 34px;
      .price-box {
        @apply flex-center;
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .gift-list {
        padding-top: 0;
        li {
          position: relative;
          padding-left: 35px;
          line-height: 28px;
          .icon_gift_box {
            position: absolute;
            left: 0;
            top: 3px;
          }
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background: #fff;
    opacity: 0.1;
    margin: 20px 0;
  }
  .bottom-tips {
    @apply flex-center;
    gap: 30px;
    .icon-notice {
      color: #ffeb00;
      padding-right: 8px;
    }
    .bottom-tips-lt {
      @apply flex-center;
    }
  }
  .upgrade-desc {
    margin-top: 20px;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;
    :deep(span) {
      color: #ffe82a;
    }
  }
  .product-desc {
    font-size: 14px;
    color: #ffffff;
    :deep(span) {
      color: #ffe82a;
    }
  }
}
:deep(.product-info) {
  .pro-per-price {
    color: #ffe82a;
  }
}
.product-bgm {
  background: linear-gradient(180deg, #065f96, #038bd2);
}
.btn-bottom-icons {
  color: #fff;
  padding-top: 18px;
  i {
    margin-right: 10px;
    vertical-align: middle;
  }
  span:first-child {
    margin-right: 115px;
  }
}
.icon_gift_2,
.icon_gift_3,
.icon_gift_4 {
  width: 100%;
  background-size: contain !important;
  background-repeat: no-repeat;
  background-position: center;
}
.icon_gift_2 {
  height: 59px;
}
.icon_gift_3 {
  height: 52px;
}
.icon_gift_4 {
  height: 67px;
}

@media (max-width: 1024px) {
  .banner-box {
    // .container-content {
    //   display: block;
    // }
    .bottom-tips {
      flex-direction: column;
      gap: 16px;
    }
    .right {
      .playerfab-times {
        width: 100%;
        .times-show-box {
          align-items: flex-start;
          flex-direction: column;
          justify-content: flex-start;
        }
      }
      .right-center .btn-group {
        flex-wrap: wrap;
        gap: 20px;
      }
    }
  }
  .skeleton-content {
    gap: 50px;
  }
  :deep(.skeleton-content) {
    .el-skeleton__image {
      width: 240px !important;
      height: 240px !important;
    }
  }
}

@media (max-width: 768px) {
  .version-box {
    display: flex;
    justify-content: center;
  }
  .aio-banner-content {
    .el-skeleton {
      padding-top: 85px;
      .skeleton-content {
        .skeleton-imgbox {
          width: 100% !important;
          max-width: 240px !important;
        }
      }
    }
  }
  .skeleton-content {
    flex-direction: column;
    align-items: center;
    .sc-mobile {
      flex-direction: column;
      align-items: center;
    }
  }
  .banner-box {
    .container-content {
      display: block;
      .fl,
      .col-xs-12 {
        float: none;
      }
      .left {
        width: 100%;
        max-width: 26.875rem;
        margin: 0 auto;
        .img-box {
          padding: 0 4.875rem;
          position: relative;
        }
      }
      .right {
        padding: 0;
        .title {
          font-size: 1.25rem;
          text-align: center;
          margin-top: 1rem;
        }
        .right-center {
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }

  .imgs-box {
    display: block;
    padding: 0 20px;
    overflow-x: scroll;
  }

  .content {
    width: 95%;
  }

  .list-box,
  .tc,
  .clearfix {
    display: flex;
    flex-direction: column;
  }

  .banner-box .left .img-box .off_1 {
    top: -10%;
    left: 22%;
  }
  .desc span {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .aio-banner-content {
    .el-skeleton {
      width: 90%;
    }
  }
  .banner-box {
    .left {
      .img-box {
        img {
          width: 180px;
        }
        .off_1 {
          .icon-m-off-tag {
            font-size: 70px;
          }
          .upgrade-off {
            font-size: 12px;
          }
          .off-value {
            font-size: 18px;
          }
        }
      }
    }
  }

  .banner-box {
    .right {
      .right-center {
        .btn-group {
          display: flex;
          flex-direction: column;
          .first-btn {
            margin-right: 0;
            // margin-bottom: 16px;
          }
        }
      }
    }
  }
  .list-img-box {
    transform: scale(0.7);
  }
}
@media (max-width: 440px) {
  .banner-box .right .price-gift-box .price-box {
    flex-direction: column;
    width: 100%;
    p {
      padding-right: 0;
    }
  }
}
</style>
<style lang="less">
.currency {
  font-size: 18px;
}
</style>
