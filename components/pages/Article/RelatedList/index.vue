<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  recommendArticleList: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const $t = useI18n().value
</script>

<template>
  <div class="related-articles pt16 pb20 pl20 pr20">
    <div v-if="title" class="rel-title flex gap16 pb16 mb20">
      <div class="line"></div>
      <div class="font-bold title color-primary" v-html="title"></div>
    </div>
    <div class="articles-list-box">
      <ul class="articles-list">
        <li v-for="(item, index) in recommendArticleList" :key="'articles' + index" class="art-itm mb20">
          <div class="art-img fl">
            <a :href="item.link" class="art-title">
              <my-img width="160" height="112" layout="responsive" :src="item.img" :alt="item.imgAlt" />
            </a>
          </div>
          <div class="art-txt">
            <a :href="item.link" class="art-title">
              <strong class="text-ellipsis-2-lines font-bold mb12" v-html="item.title"></strong>
            </a>
            <p class="desc text-ellipsis-2-lines" v-html="item.summary"></p>
            <a :href="item.link" class="art-more" v-html="item.btnText || $t.common.learn_more"></a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less">
.related-articles {
  .rel-title {
    border-bottom: 1px solid @border-gray;
    .title {
      font-size: @font-size;
      color: @base-text-color;
      line-height: 28px;
    }
  }
  .recommend-title,
  .rel-title {
    position: relative;
    > div {
      line-height: initial;
    }
    .line {
      position: absolute;
      top: 0;
      left: -20px;
      width: 4px;
      height: 28px;
      background-color: @primary-color;
      box-shadow: -3px 0px 5px 0px rgba(0, 169, 240, 0.3);
    }
  }
  .answer {
    box-sizing: border-box;
    height: 0;
    overflow: hidden;
    transition: height 0.5s;
  }
  .art-itm {
    display: flex;
    gap: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .art-title {
    display: block;
  }
  .art-img {
    width: 160px;
    height: 112px;
    img {
      max-width: 160px;
    }
  }
  .art-txt {
    position: relative;
    flex: 1;
    overflow: hidden;
    strong {
      color: #3b5159;
      font-size: @font-size;
      &:hover {
        color: @primary-color;
      }
    }
    .desc {
    }
    .art-more {
      float: right;
      color: @btn-primary-color;
      cursor: pointer;
      font-size: @font-size-sm;
      line-height: @base-line-height;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
@media (max-width: 768px) {
  .related-articles {
    // padding-bottom: 20px;
    // .art-itm {
    //   gap: 18px;
    //   flex-direction: column;
    // }
    // .art-img,
    // .art-img img {
    //   width: 100%;
    //   height: auto;
    //   max-width: initial;
    // }
    // .art-img {
    //   margin: 0;
    // }
    // strong {
    //   display: block;
    // }
  }
}
</style>
