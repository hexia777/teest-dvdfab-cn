<script setup>
const props = defineProps({
  hasAuthorLink: {
    type: Boolean,
    default: false,
  },
  // 是否懒加载
  loading: {
    type: String,
    default: 'lazy',
  },
  article: {
    type: Object,
    default: () => {},
  },
})

const locale = useStore.common().locale
const dateForm = (str) => {
  return transformDate(str, locale)
}

const imgPath = `${useImgPath().value}/cn/articles/default_cover.png`
const formateImgUrl = (url) => {
  return url.includes('http') ? url : 'https://dvdfab.cn' + url
}
</script>

<template>
  <li class="art-item">
    <a class="art-item-link" :href="article.link"></a>
    <div class="img-box relative">
      <my-img
        :src="formateImgUrl(article.img || imgPath)"
        width="380"
        height="214"
        layout="responsive"
        :style="{ 'object-fit': article.img ? 'container' : 'cover' }"
        :alt="article.title"
        :loading="props.loading"
      />
    </div>
    <div class="p20">
      <div class="art-info pb16 flex">
        <a
          v-if="hasAuthorLink"
          :href="article.authorLink || 'javascript:;'"
          :class="article.authorLink && 'has-link'"
          class="flex-center gap8"
        >
          <i class="iconfont-sg icon-author"></i>
          <span v-html="article.author"></span>
        </a>
        <span v-else class="flex-center gap8">
          <i class="iconfont-sg icon-author"></i>
          <span v-html="article.author"></span>
        </span>
        <span class="flex-center gap8 art-time-rt">
          <i class="iconfont-sg icon-time"></i>
          <span>{{ dateForm(article.time) }}</span>
        </span>
      </div>
      <h3 class="tit tl text-ellipsis-2-lines" v-html="article.title"></h3>
      <p class="art-summary text-ellipsis-2-lines" v-html="article.summary"></p>
      <div v-if="article.tag" class="fab-tag">
        <a :href="article.tagUrl" v-html="article.tag"></a>
      </div>
    </div>
  </li>
</template>

<style lang="less" scoped>
.art-item {
  position: relative;
  width: 100%;
  max-width: 380px;
  color: @base-text-color;
  background-color: @bg-white;
  border-radius: 12px;
  overflow: hidden;
  &:hover {
    box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
    .tit {
      color: @primary-text-color;
    }
  }
  .art-item-link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .img-box {
    img {
      max-width: 380px;
      width: 100%;
      height: 214px;
      object-fit: contain;
    }
  }
  .tit {
    color: @base-text-color;
    font-size: @font-size-md;
    line-height: 32px;
    font-weight: bold;
  }
}
.art-info {
  font-size: @font-size-xs;
  color: @text-gray-color;
  i {
    color: #cccccc;
    font-size: @font-size-xs;
    line-height: 1;
  }
  a {
    cursor: initial;
    color: @text-gray-color;
    &.has-link {
      position: relative;
      z-index: 2;
      &:hover {
        color: @primary-text-color;
      }
      cursor: pointer;
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
  position: relative;
  z-index: 2;
  margin-top: 16px;
  width: fit-content;
  border: 1px solid @secondary-color;
  color: @secondary-color;
  border-radius: 4px;
  white-space: nowrap;
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
  .art-item {
    width: 100%;
    max-width: 100%;
    height: auto;
    .img-box img {
      max-width: 100%;
      height: auto;
    }
    .tit {
      font-size: 20px;
    }
  }
}
@media (max-width: 640px) {
  .art-item {
    padding: 0;
  }
}
@media (max-width: 414px) {
  .art-item .img-box img {
    height: 100%;
  }
}
</style>
