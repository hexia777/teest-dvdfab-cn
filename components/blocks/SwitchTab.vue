<script setup lang="ts">
// const props = defineProps({
//   tabs: {
//     type: Array,
//     default: () => [],
//   },
//   activeTab: {
//     type: String,
//     default: '',
//   },
// })
const activeTab = 'DVD'

const tabs = [
  { name: 'DVD', href: '/resource/dvd' },
  { name: 'Blu-ray', href: '/resource/blu-ray' },
  { name: 'Video', href: '/resource/video' },
  { name: 'Cinavia', href: '/resource/cinavia' },
  { name: 'DRM', href: '/resource/drm' },
  { name: '4K Media', href: '/resource/4k-media' },
  { name: '8K Media', href: '/resource/8k-media', disabled: true },
  { name: 'Image', href: '/resource/image' },
  { name: 'Downloader Topics', href: '/downloader-topics.htm' },
  { name: '8K Media', href: '/resource/8k-media' },
  { name: 'YouTube MP3', href: '/resource/youtube-mp3' },
  { name: 'Topic', href: '/topic.htm' },
]
</script>

<template>
  <ul class="switch-class-list">
    <li
      v-for="item in tabs"
      v-show="!item.disabled"
      :key="item.name"
      :class="{ active: activeTab === item.name }"
    >
      <a :href="item.href" v-html="item.name"></a>
    </li>
  </ul>
</template>

<style scoped>
.switch-class-list {
  height: auto;
  background: #cac4c4;
  padding: 0 20px;
  li {
    display: inline-block;
    font-size: 18px;
    margin-right: 55px;
    line-height: 60px;
    a {
      font-weight: 400;
      color: #3b5159;
    }
  }
  .active {
    border-bottom: 2px solid @primary-color;
    a {
      color: @primary-color;
    }
  }
}
</style>
