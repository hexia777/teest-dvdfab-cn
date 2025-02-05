<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

interface Card {
  media: object
  title: string
  desc: string
}

const props = defineProps<{
  title: string
  items: Card[]
  bottomDesc: string
  blockClass: {
    value: string
  }
}>()

const { title = '', items = [], bottomDesc = '', blockClass = { value: 'has-bg bg-normal' } } = props

const currentIndex = ref(3)
const transitionStyle = ref('transform 0.5s ease')

const extendeditems = computed(() => {
  return [...items.slice(-3), ...items, ...items.slice(0, 3)]
})

const realIndex = computed(() => {
  return (items.length + currentIndex.value - 3) % items.length
})

const nextSlide = () => {
  if (currentIndex.value < items.length * 2) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

watch(currentIndex, (newIndex) => {
  if (newIndex === extendeditems.value.length - 3) {
    setTimeout(() => {
      transitionStyle.value = 'none'
      currentIndex.value = 3
      setTimeout(() => {
        transitionStyle.value = 'transform 0.5s ease'
      }, 10)
    }, 500)
  } else if (newIndex === 0) {
    setTimeout(() => {
      transitionStyle.value = 'none'
      currentIndex.value = items.length
      setTimeout(() => {
        transitionStyle.value = 'transform 0.5s ease'
      }, 10)
    }, 500)
  }
})
</script>

<template>
  <div class="block-box" :class="[blockClass.value, 'card-carousel']">
    <BaseContainer>
      <h2 class="carousel-title">{{ title }}</h2>
      <div class="carousel-box">
        <div class="carousel-container">
          <button class="carousel-control prev bg-normal bg-hover-primary" @click="prevSlide">
            <i class="iconfont-sg icon-pre text-primary-color"></i>
          </button>
          <div class="carousel-wrapper">
            <div
              class="carousel"
              :style="{
                transform: `translateX(calc(-${(currentIndex * 100) / 3}% - ${
                  Math.floor(currentIndex / 3) * 30
                }px))`,
                transition: transitionStyle,
              }"
            >
              <div v-for="(card, index) in extendeditems" :key="index" class="carousel-item">
                <MyImg
                  class="card-image mb20"
                  :loading="'lazy'"
                  :src="getStrapiData(card?.media).url"
                  width="238"
                  height="87"
                  :alt="card.title"
                />
                <h3 class="card-title title4 mb12">{{ card.title }}</h3>
                <p class="card-description" v-html="card.desc"></p>
              </div>
            </div>
          </div>
          <button class="carousel-control next bg-normal bg-hover-primary" @click="nextSlide">
            <i class="iconfont-sg icon-next text-primary-color"></i>
          </button>
        </div>
        <div class="indicators">
          <span
            v-for="(card, index) in items"
            :key="index"
            :class="['indicator', { active: index === realIndex }]"
          ></span>
        </div>
      </div>
      <div class="carousel-list">
        <div v-for="(card, index) in items" :key="index" class="carousel-item">
          <MyImg
            class="card-image mb20"
            :loading="'lazy'"
            :src="getStrapiData(card?.media).url"
            width="238"
            height="87"
            :alt="card.title"
          />
          <h3 class="card-title title4 mb12">{{ card.title }}</h3>
          <p class="card-description" v-html="card.desc"></p>
        </div>
      </div>
      <div class="link primary-link" v-html="bottomDesc"></div>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.card-carousel {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.carousel-box {
  width: 100%;
}
.carousel-title {
  text-align: center;
  margin-bottom: @gap-md;
}

.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
}

.carousel-wrapper {
  overflow: hidden;
  flex: 1;
}

.carousel {
  display: flex;
}

.carousel-item {
  flex: 0 0 calc((100% / 3) - 20px);
  box-sizing: border-box;
  padding: @gap-30;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  &:not(:first-child) {
    margin-left: 30px;
  }
}

.card-image {
  max-width: 238px;
}

.carousel-control {
  border: none;
  outline: none;
  width: 66px;
  height: 66px;
  text-align: center;
  line-height: 66px;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  z-index: 3;
  &.bg-normal {
    background-color: #d5f1fd;
  }
  &.prev {
    left: -33px;
  }
  &.next {
    right: -33px;
  }
  &:hover {
    i {
      color: @text-white-color;
    }
  }
  i {
    font-size: 30px;
    font-weight: bold;
  }
}

.indicators {
  display: flex;
  justify-content: center;
  margin-top: @gap-24;
}

.indicator {
  width: 5px;
  height: 5px;
  background-color: #d4e5ed;
  border-radius: 50%;
  margin: 0 5px;
  transition: width 0.3s;
}

.indicator.active {
  width: 20px;
  background-color: @primary-color;
  border-radius: 5px;
}

.link {
  display: block;
  text-align: center;
  margin-top: @gap-30;
}

.carousel-list {
  display: none;
  flex-direction: column;
  gap: @gap-30;
  .carousel-item {
    flex: 0 0 100%;
    &:not(:first-child) {
      margin-left: 0;
    }
  }
}

@media (max-width: 1200px) {
  .carousel-box {
    display: none;
  }
  .carousel-list {
    display: flex;
  }
}

@media (max-width: 640px) {
  .card-image {
    max-width: 180px;
    height: unset;
  }
}
</style>
