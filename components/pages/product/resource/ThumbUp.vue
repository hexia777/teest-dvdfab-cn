<script setup lang="ts">
const props = defineProps({
  cookiesName: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const { $trace } = useNuxtApp() as any
const emits = defineEmits(['update'])
const setCookie = (evt, text, disabled) => {
  if (props.cookiesName || disabled) {
    return
  }
  const time = parseInt(new Date().getTime() / 1000 + '') + '' // 获取当前时间戳
  const thumbsItem = { createTime: time, url: route?.params?.id, thumbs: text }
  const thumbs = localStorage.getItem('resource_thumbs_up')
  if (thumbs && JSON.parse(thumbs).length) {
    const thumbsList = JSON.parse(thumbs)
    thumbsList.push(thumbsItem)
    localStorage.setItem('resource_thumbs_up', JSON.stringify(thumbsList))
  } else {
    localStorage.setItem('resource_thumbs_up', JSON.stringify([thumbsItem]))
  }
  if (text === 'up') {
    $trace.traceCustomEvent({
      event: 'click',
      xargs_event_category: 'rate',
      event_label: 'thumb_up',
    })
  } else if (text === 'down') {
    $trace.traceCustomEvent({
      event: 'click',
      xargs_event_category: 'rate',
      event_label: 'thumb_down',
    })
  }
  emits('update')
}
</script>

<template>
  <div class="thumbs-up p30 flex-center-col">
    <div class="thumbs-title pb20 text-center" v-html="title"></div>
    <template v-if="!cookiesName">
      <div class="icon-box">
        <div
          class="up-box"
          :class="{ disable: cookiesName === 'down', active: cookiesName === 'up', cookiesName }"
          @click="setCookie($event, 'up', cookiesName === 'down')"
        >
          <i class="iconfont-sg icon-like"></i>
        </div>
        <div
          class="down-box"
          :class="{ disable: cookiesName === 'up', active: cookiesName === 'down' }"
          @click="setCookie($event, 'down', cookiesName === 'up')"
        >
          <i class="iconfont-sg icon-unlike"></i>
        </div>
      </div>
    </template>
    <template v-if="cookiesName">
      <div class="icon-box">
        <div
          class="up-box"
          :class="{ disable: cookiesName === 'down', active: cookiesName === 'up' }"
          @click="setCookie($event, 'up', cookiesName === 'down')"
        >
          <i class="iconfont-sg icon-like"></i>
        </div>
        <div
          class="down-box"
          :class="{ disable: cookiesName === 'up', active: cookiesName === 'down' }"
          @click="setCookie($event, 'down', cookiesName === 'up')"
        >
          <i class="iconfont-sg icon-unlike"></i>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
@up-bg-color: #ffedc4;
@up-bg-disable-color: #e7e7e7;
@up-bg-hover-color: #ff9600;
@up-color: @secondary-color;
@up-disable-color: #bcbcbc;
@up-hover-color: #fff;
@down-bg-color: #eaf9ff;
@down-color: @primary-color;
@down-bg-hover-color: #00b5f8;

.radius-box {
  border-radius: 50%;
  @apply w84 h84 flex-center;
}
.thumbs-up {
  background: #fff;
  .icon-box {
    gap: 40px;
    @apply flex;
  }
  .up-box {
    background-color: @up-bg-color;
    i {
      color: @up-color;
    }
    &:hover {
      background-color: @up-bg-hover-color;
      i {
        color: @up-hover-color;
      }
    }
    &.active {
      background-color: @up-bg-hover-color;
      i {
        color: @up-hover-color;
      }
    }
  }
  .down-box {
    background-color: @down-bg-color;
    i {
      color: @down-color;
    }
    &:hover {
      background-color: @down-bg-hover-color;
      i {
        color: @up-hover-color;
      }
    }
    &.active {
      background-color: @down-bg-hover-color;
      i {
        color: @up-hover-color;
      }
    }
  }
  .up-box,
  .down-box {
    .radius-box;
    cursor: pointer;
    i {
      @apply font-size-26;
    }
    &.disable {
      cursor: no-drop;
      background-color: @up-bg-disable-color;
      i {
        color: @up-disable-color;
      }
    }
  }
}
</style>
