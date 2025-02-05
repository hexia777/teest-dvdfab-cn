<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="article-content-2 pt80 bg-normal">
    <BaseContainer>
      <h2 v-if="title" class="title2 article-title mb40 text-center" v-html="title"></h2>
      <ul class="article-ul flex gap30 pb30">
        <li v-for="(item, key) in list" :key="key" class="art-item">
          <div class="img-box relative">
            <my-img :src="item.img" width="380" height="250" layout="responsive" :alt="item.imgAlt" />
          </div>
          <div class="p20">
            <div class="art-info pb16 flex">
              <span class="flex-center gap8">
                <i class="iconfont-sg icon-more-star"></i>
                <a :href="item.authorLink"><span v-html="item.author"></span></a>
              </span>
              <span class="flex-center gap8 art-time-rt">
                <i class="iconfont-sg icon-more-star"></i>
                <span>{{ item.time }}</span>
              </span>
            </div>
            <a :href="item.link"><h3 class="tit tl text-ellipsis-2-lines" v-html="item.title"></h3></a>
            <p class="art-summary text-ellipsis-2-lines" v-html="item.desc"></p>
            <div v-if="item.tag" class="fab-tag">
              <a :link="item.tagUrl" v-html="item.tag"></a>
            </div>
          </div>
        </li>
      </ul>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.article-content-2 {
  .article-ul {
    flex-wrap: wrap;
    .art-item {
      position: relative;
      width: calc((100% - 30px * 2) / 3);
      color: @base-text-color;
      background-color: @bg-white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
      .img-box {
        padding-top: calc(250 / 400 * 100%);
        img {
          position: absolute;
          left: 0;
          top: 0;
          max-width: 380px;
          width: 100%;
          height: 100%;
        }
      }
    }
    .tit {
      color: @base-text-color;
      font-size: @font-size-md;
      line-height: 32px;
      font-weight: bold;
      &:hover {
        color: @primary-text-color;
      }
    }
  }
}
.art-info {
  font-size: @font-size-xs;
  color: @text-gray-color;
  i {
    font-size: @font-size-xs;
    line-height: 1;
  }
  a {
    color: @text-gray-color;
    &:hover {
      color: @primary-text-color;
    }
  }
}
.art-summary {
  color: @base-text-color;
  font-size: @font-size-sm;
  line-height: @base-line-height;
  padding-top: 12px;
}
.fab-tag {
  border: 1px solid @secondary-color;
  color: @secondary-color;
  border-radius: 4px;
  white-space: nowrap;
  margin-top: 16px;
  width: fit-content;
  &:hover {
    background: rgba(255, 144, 0, 0.1);
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0 8px;
    color: @secondary-color;
    cursor: pointer;
  }
}
.art-time-rt {
  padding-left: 30px;
}
.break-line-2 {
  word-break: break-word;
  padding: 15px 0 0;
  margin: 0 20px;
}
@media (max-width: 1024px) {
  .article-content-2 .article-ul .art-item {
    width: 100%;
    height: auto;
    .img-box img {
      max-width: 100%;
    }
    &:not(:nth-child(3n + 1)) {
      margin-left: 0;
    }
  }
  .article-content-2 {
    padding-top: 38;
    .article-ul {
      .tit {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 640px) {
  .article-content-2 .article-ul .art-item {
    padding: 0;
  }
}
</style>
