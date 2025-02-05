<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: 'my-iframe',
  },
  src: {
    type: String,
    default: '',
  },
})
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target
          const iframeSrc = iframe.getAttribute('data-src')
          iframe.src = iframeSrc
          // 停止观察该元素
          observer.unobserve(iframe) // 使用 entry.target 而不是 target
        }
      })
    },
    {
      root: null, // 默认为 viewport
      rootMargin: '200px 0px 200px 0px', // 在视窗顶部和底部各添加 200px 的缓冲区
      threshold: 0.01, // 当元素 1% 进入视口时触发
    },
  )

  // 观察所有占位符
  const myIframe = document.getElementById(props.id) // 移除 #
  if (myIframe) {
    observer.observe(myIframe)
  } else {
    console.error('Element with id "my-iframe" not found.')
  }
})
</script>
<template>
  <div class="iframe-container flex-center">
    <iframe :id="id" :data-src="src" frameborder="0" allowfullscreen></iframe>
  </div>
</template>
<style lang="less" scoped>
/* 容器样式 */
.iframe-container {
  width: 100%;
  max-width: 960px; /* 最大宽度 */
  margin: 0 auto;
  position: relative;
}

/* 保持宽高比 16:9 的 iframe */
.iframe-container::before {
  content: '';
  display: block;
  padding-top: 56.25%; /* 16:9 的比例，计算方法：(9/16) * 100% = 56.25% */
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none; /* 移除边框 */
}
</style>
