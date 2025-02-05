<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => {},
  },
  more: {
    type: Object as PropType<any>,
    default: () => {},
  },
  blockClass: {
    type: Object,
    default: () => {},
  },
})

const technologyTitle = ref<any>(null)
const technologyList = ref<any>(null)

function isContain(dom: any, scrollTop: number = 10) {
  const totalHeight = window.innerHeight || document.documentElement.clientHeight
  const totalWidth = window.innerWidth || document.documentElement.clientWidth
  // 当滚动条滚动时，top, left, bottom, right时刻会发生改变。
  const { top, right, bottom, left } = dom.getBoundingClientRect()
  return top >= scrollTop && left >= 0 && right <= totalWidth && bottom <= totalHeight
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (technologyTitle.value && isContain(technologyTitle.value, 80)) {
    // technologyTitle.value.style.animation = 'fadeInDown'
    technologyTitle.value.classList.add('fadeInDown')
    setTimeout(() => {
      technologyList.value.classList.add('fadeIn')
    }, 500)
  }

  // if (technologyList.value && isContain(technologyList.value, 0)) {
  //   // technologyTitle.value.style.animation = 'fadeInDown'
  //   technologyList.value.classList.add('fadeIn')
  // }
}
</script>

<template>
  <div class="block-box" :class="blockClass && blockClass.value ? blockClass.value : 'has-bg'">
    <BaseContainer>
      <div class="technology-box">
        <h2 ref="technologyTitle" class="text-center mb40 technology-title">
          {{ title }}
        </h2>
        <div ref="technologyList" class="technology-list">
          <a v-for="i in items" :key="'technology' + i" :href="i.link" class="technology-item">
            <div class="technology-cursor">
              <div class="default text-center">
                <!-- <i :class="i.icon"></i> -->
                <my-img
                  :width="i.media?.data?.attributes?.width"
                  :height="i.media?.data?.attributes?.height"
                  :src="i.media?.data?.attributes?.url"
                  :alt="i.mediaAlt"
                />
                <p class="text-center title">{{ i.title }}</p>
              </div>
              <div class="hover text-center">
                <div class="title">{{ i.title }}</div>
                <div class="desc">{{ i.desc }}</div>
              </div>
            </div>
          </a>
          <div class="technology-item technology-link text-center">
            <a :href="more.url" class="tc">{{ more.label }}</a>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="less">
.technology-box {
  a {
    color: #3b5159;
  }
  h2 {
    margin-bottom: 48px;
    padding-bottom: 0;
    font-size: 2.625rem;
  }
}

.technology-list {
  position: relative;
  min-height: 38.75rem;
  opacity: 0;
}

.technology-item {
  position: absolute;
  background: #f9fdff;
  box-shadow: 0px 0px 24px 5px rgba(98, 98, 98, 0.08);
  border-radius: 50%;

  .technology-cursor {
    width: 100%;
    height: 100%;
    position: relative;
    &:hover {
      .default {
        opacity: 0;
        visibility: hidden;
      }
      .hover {
        opacity: 1;
        visibility: initial;
      }
    }
  }
  .default {
    opacity: 1;
    visibility: initial;
  }
  .hover {
    opacity: 0;
    visibility: hidden;
  }
  .default,
  .hover {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    transition: all 0.5s;
  }
  .title {
    margin-bottom: 6px;
  }
  .desc {
    font-size: 14px;
    padding: 0 1rem;
  }

  &:first-child {
    width: 240px;
    height: 240px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    .title {
      color: #0090fa;
    }
  }
  &:nth-child(2) {
    width: 210px;
    height: 210px;
    right: 206px;
    top: 120px;
    .title {
      color: #7c23fb;
    }
  }
  &:nth-child(3) {
    width: 220px;
    height: 220px;
    right: 131px;
    bottom: 0;
    .title {
      color: #0aca54;
    }
  }
  &:nth-child(4) {
    width: 200px;
    height: 200px;
    right: 364px;
    bottom: 91px;
    .title {
      color: #e81a00;
    }
  }
  &:nth-child(5) {
    width: 180px;
    height: 180px;
    left: 440px;
    bottom: 173px;
    .title {
      color: #0aca54;
    }
  }
  &:nth-child(6) {
    width: 220px;
    height: 220px;
    left: 241px;
    top: 78px;
    .title {
      color: #7c23fb;
    }
  }
  &:nth-child(7) {
    width: 210px;
    height: 210px;
    left: 21px;
    top: 222px;
    .title {
      color: #e94623;
    }
  }
  &:nth-child(8) {
    width: 220px;
    height: 220px;
    left: 216px;
    top: 368px;
    .title {
      color: #0090fa;
    }
  }

  &:nth-child(9) {
    width: 130px;
    height: 130px;
    right: 74px;
    bottom: 222px;
    a {
      color: #01b1ff;
    }
  }
}
.technology-link {
  padding: 0 10px;
  a {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
  }
}

.technology-item {
  .desc {
    font-size: 12px;
    word-break: break-word;
  }
}

@media (max-width: 1300px) {
  .technology-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 2rem;
    min-height: auto;
  }
  .technology-item {
    width: 9rem !important;
    height: 9rem !important;
    position: initial;
    margin: 1rem 2rem;
    padding: 20px;
    &:first-child {
      transform: none;
    }
    .technology-cursor {
      pointer-events: none;
    }
  }
  .technology-link {
    width: 100% !important;
    height: auto !important;
    background: none;
    box-shadow: none;
  }
}

@media (max-width: 900px) {
  h2 {
    padding: 0;
    margin-bottom: 1rem;
  }
  .technology-box {
    padding: 3rem 0 2rem;
  }
  .technology-item {
    margin: 1rem;
  }
}
@media (max-width: 768px) {
  .technology-box h2 {
    font-size: 2.125rem;
  }
}
@media (max-width: 640px) {
  .technology-item {
    margin: 0 0 1rem;
    transform: scale(0.8);
    &:first-child {
      transform: scale(0.8);
    }
  }
  .technology-box h2 {
    font-size: 1.625rem;
  }
}
@media (max-width: 460px) {
  .technology-list {
    justify-content: space-evenly;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fadeInDown {
  animation-name: fadeInDown;
  animation-duration: 0.7s;
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
  animation-duration: 0.75s;
  opacity: 1;
}
</style>
