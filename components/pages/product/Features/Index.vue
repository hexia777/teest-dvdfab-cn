<script setup lang="ts">
const props = defineProps({
  hasH2Title: {
    // 是否有大标题 决定小标题是h几显示
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  imgUrl: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
    default: 600,
  },
  height: {
    type: [Number, String],
    default: 400,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  imgAlt: {
    type: String,
    default: '',
  },
  imgTitle: {
    type: String,
    default: '',
  },
  imgDesc: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
    default: () => ({
      fontSize: 32,
      bgColor: '',
    }),
  },
})
const style = computed(() => {
  return {
    paddingTitClass: '',
    fontSize: 32,
    bgColor: '',
    ...props.style,
  }
})
</script>

<template>
  <div class="features-index" :class="{ 'special-features': !title }">
    <h2 v-if="title" class="pb40 text-center features-index-title" v-html="title"></h2>
    <p v-if="desc" class="pb40 text-center features-index-desc" v-html="desc"></p>
    <div
      v-if="imgTitle || imgDesc || imgUrl"
      class="block-features"
      :class="{ reverse: reverse }"
      :style="`background:${style.bgColor}`"
    >
      <div class="block-features-text flex justify-center flex-col flex-1" :class="style.paddingTitClass">
        <!-- 存在h2大标题则显示h3 , 不存在h2大标题则显示h2 -->
        <h3
          v-if="imgTitle && hasH2Title"
          class="block-title pb30"
          :class="{
            'font-s-32': style.fontSize == 32,
            'font-s-24': style.fontSize == 24,
          }"
          v-html="imgTitle"
        ></h3>
        <h2
          v-else-if="imgTitle && !hasH2Title"
          class="block-title pb30"
          :class="[style.fontSize == 32 ? 'font-s-32' : 'font-s-24']"
          v-html="imgTitle"
        ></h2>
        <p v-if="imgDesc" class="block-desc" v-html="imgDesc"></p>
      </div>
      <div class="img">
        <my-img
          v-if="imgUrl"
          class="block-features-img text-left relative flex align-center flex-shrink-0 max-w-full h-auto"
          :width="width"
          :height="height"
          :src="imgUrl"
          :alt="imgAlt"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.block-features {
  @apply flex-center b-rd-12;
  :deep(a) {
    color: @primary-color;
    &:hover {
      text-decoration: underline;
    }
  }
  :deep(a:visited) {
    color: @primary-color;
  }
  .block-features-text {
    @apply pr40 pl0;
  }
  .img {
    @apply w-600 flex-center;
  }
}
.reverse {
  @apply flex-row-reverse;

  .block-features-text {
    @apply pl40 pr0;
  }

  .block-title {
    @apply text-left;
  }
  .triangle-title {
    @apply p40 pl0;
  }
}
@media (max-width: @screen-xl) {
  .block-features {
    @apply flex-col;
    .block-title {
      @apply text-center;
    }
    .block-features-img {
      @apply max-w-full text-center;
    }
    .block-features-text {
      @apply w-full pl0 pb30 pr0;
    }

    .img {
      @apply w-full;
    }
  }
}

@media (max-width: @screen-md) {
  .block-features {
    .block-features-text {
      padding-bottom: 12px;
    }
    .features-index-title {
      padding-bottom: 28px;
    }
  }
  .special-features {
    .block-title {
      padding-bottom: 28px;
    }
  }
}
@media (max-width: @screen-sm) {
  .block-features {
    .block-features-text {
      padding-bottom: 12px;
    }
  }
  .special-features {
    .block-title {
      --font-size-lg: 24px;
    }
    .block-features-text {
      padding-bottom: 12px;
    }
  }
}
</style>
