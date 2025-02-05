<script setup lang="ts">
const props = defineProps({
  author: { type: String, default: '' },
  authorDesc: { type: String, default: '' },
  authorAvatar: {
    type: String,
    default: '',
  },
})
const locale = useStore.common().locale

const more = useI18n().value.common.more
</script>
<!-- 作者介绍板块 -->
<template>
  <div v-if="author && authorDesc" class="author-intro">
    <span class="author-lf">
      <span class="avatar-con">
        <i :style="'background-image: url(' + authorAvatar + '?t=202102021620);'" class="avatar-img"></i>
      </span>
    </span>
    <span class="author-rt">
      <div class="mb12">
        <span class="author-name">{{ author }}</span>
      </div>
      <div class="author-desc">
        {{ authorDesc }}
      </div>
      <div class="read-more-con">
        <a :href="'/author/' + author.toLowerCase() + '.htm'" class="desc-rd-more"> {{ more }}&nbsp;> </a>
      </div>
    </span>
  </div>
</template>
<style scoped></style>
<style lang="less">
.author-intro {
  display: flex;
  position: relative;
  padding-top: 20px;
  .author-lf {
    width: 150px;
    text-align: center;
  }
  .author-rt {
    flex: 1;
    padding-left: 10px;
  }
  &::before {
    // content: '';
    // position: absolute;
    // top: 0;
    // left: 20px;
    // right: 20px;
    // height: 1px;
    // background-color: #f3f3f3;
  }
}

.avatar-img {
  display: inline-block;
  width: 110px;
  height: 110px;
  background-repeat: no-repeat;
  background-size: cover;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
}
.author-name {
  line-height: 24px;
  font-weight: bold;
  color: @base-text-color;
}
.author-desc {
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  font-weight: 400;
  color: #808a8d;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.read-more-con {
  // padding-top: 5px;
  text-align: right;
  .desc-rd-more {
    color: @primary-color;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
