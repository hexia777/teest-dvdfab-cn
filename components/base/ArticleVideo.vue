<script setup>
const props = defineProps({
  preload: {
    type: String,
    default: 'metadata',
  },
  loop: {
    type: Boolean,
    default: false,
  },
  src: {
    type: String,
    default: '',
  },
  poster: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
  controls: {
    type: Boolean,
    default: true,
  },
  disablePictureInPicture: {
    type: Boolean,
    default: true,
  },
  height: {
    type: [String, Number],
    default: 450,
  },
  videoType: {
    type: String,
    default: 'video/webm',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  videoUnSupportTips: {
    type: String,
    default: '',
  },
})

const video = ref(null)

const data = reactive({
  playTimeOut: null,
})

onMounted(() => {
  nextTick(() => {
    if (props.src) {
      // /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
      //   event: 'show',
      //   event_label: 'drm_video',
      // })
      video.value.addEventListener('ended', ended)
      video.value.addEventListener('error', error)
      video.value.addEventListener('pause', pause)
      video.value.addEventListener('play', play)
    }
  })
})

const ended = () => {
  // clearInterval(data.playTimeOut)
  // /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
  //   event: 'submit',
  //   event_label: 'drm_video',
  //   event_category: 'ended',
  //   ext_params_str_param2: video.value.duration,
  // })
  emit('ended')
}

const error = () => {
  // /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
  //   event: 'submit',
  //   event_label: 'drm_video',
  //   event_category: 'error',
  // })
  emit('error')
}

const pause = () => {
  // clearInterval(data.playTimeOut)
  // /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
  //   event: 'click',
  //   event_label: 'drm_video',
  //   event_category: 'pause',
  // })
  emit('pause')
}

const play = () => {
  // clearInterval(data.playTimeOut)
  // data.playTimeOut = setInterval(() => {
  //   /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
  //     event: 'submit',
  //     event_label: 'drm_video',
  //     event_category: 'timing',
  //     ext_params_str_param1: video.value.currentTime,
  //     ext_params_str_param2: video.value.duration,
  //   })
  // }, 5000)
  // /* Warn: Unknown source: $trace */ $vm.$trace.traceCustomEvent({
  //   event: 'click',
  //   event_label: 'drm_video',
  //   event_category: 'play',
  // })
  emit('play')
}
// 定义 emit
const emit = defineEmits(['play', 'pause', 'ended', 'error'])
</script>

<template>
  <div>
    <video
      v-if="src"
      ref="video"
      :controls="controls"
      :muted="muted"
      :width="width"
      :height="useStore.common().mobile ? 'auto' : height"
      :disablepictureinpicture="disablePictureInPicture"
      :preload="preload"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
    >
      <source :src="src" :type="videoType" />

      <div v-html="videoUnSupportTips"></div>
    </video>
  </div>
</template>
