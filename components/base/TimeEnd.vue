<script setup lang="ts">
const props = defineProps({
  displayDay: { type: Boolean, default: true },
  displayHour: { type: Boolean, default: true },
  displayMin: { type: Boolean, default: true },
  displaySec: { type: Boolean, default: true },
  displayMS: { type: Boolean, default: false },
  timeEnd: { type: Number, default: 0 }, // 毫米级别的时间戳
  loopSeconds: { type: Number, default: 0 },
  mode: { type: Number, default: 1 },
  dayUnit: { type: String, default: 'Day' },
  hourUnit: { type: String, default: 'Hours' },
  minUnit: { type: String, default: 'Mins' },
  secUnit: { type: String, default: 'Secs' },
  mSecUnit: { type: String, default: 'ms' },
  showUnit: { type: Boolean, default: true },
  delimiter: { type: String, default: '' },
})

let _day = ref<string>('')
let _hour = ref<string>('')
let _minute = ref<string>('')
let _second = ref<string>('')
let _ms = ref<string>('')

const initUse = () => {
  const { day, hour, minute, second, ms } = useCountdown(props.timeEnd, {
    loopSeconds: props.loopSeconds,
    displayDay: props.displayDay,
    displayHour: props.displayHour,
    displayMin: props.displayMin,
    displaySec: props.displaySec,
    displayMS: props.displayMS,
    delimiter: props.delimiter,
  })
  _day = day
  _hour = hour
  _minute = minute
  _second = second
  _ms = ms
}
initUse()
watch(
  () => props.timeEnd,
  (val: number) => {
    if (val) {
      initUse()
    }
  },
  { immediate: true },
)

// console.log('day: useCountdown', day)

const showNumber = computed(
  () => Number(props.displayDay) + Number(props.displayHour) + Number(props.displayMS) + 2,
)
</script>

<template>
  <div>
    <div
      class="time-end-box"
      :class="{
        'mode-2': mode === 2,
        'mode-1': mode === 1,
        'show-3': showNumber === 3,
        'no-unit': !showUnit,
      }"
    >
      <div class="time-layer">
        <div class="item time-box">
          <div class="time-txt-con">
            <div v-if="displayDay" class="d t-txt">
              <div class="t-in">
                {{ _day }}
              </div>
              <div v-if="showUnit" class="pos-unit">{{ dayUnit }}</div>
            </div>
            <div v-if="displayDay && displayHour" class="t-dot"></div>
            <div v-if="displayHour" class="h t-txt">
              <div class="t-in">
                {{ _hour }}
              </div>
              <div v-if="showUnit" class="pos-unit">{{ hourUnit }}</div>
            </div>
            <div v-if="displayHour && displayMin" class="t-dot"></div>
            <div v-if="displayMin" class="m t-txt">
              <div class="t-in">
                {{ _minute }}
              </div>
              <div v-if="showUnit" class="pos-unit">{{ minUnit }}</div>
            </div>
            <div v-if="displayMin && displaySec" class="t-dot"></div>
            <div v-if="displaySec" class="s t-txt">
              <div class="t-in">
                {{ _second }}
              </div>
              <div v-if="showUnit" class="pos-unit">{{ secUnit }}</div>
            </div>
            <div v-if="displaySec && displayMS" class="t-dot"></div>
            <div v-if="displayMS" class="ms t-txt">
              <div class="t-in">
                {{ _ms }}
              </div>
              <div v-if="showUnit" class="pos-unit">{{ mSecUnit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.time-end-box {
  width: 100%;
  padding-bottom: 20px;
  &.no-unit {
    padding-bottom: 0;
  }
  .time-layer {
    width: 100%;
    height: auto;
  }
  &.mode-1 {
    .t-dot {
      visibility: hidden;
    }
  }
  &.mode-2 {
    .time-box {
      padding-top: 19%;
      background-image: none;
      font-size: 35px;
    }
    .t-txt {
      position: relative;
      width: 18%;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      text-align: center;
      z-index: 1;
      vertical-align: top;
      padding: 6px;
      &::before {
        background-color: transparent;
      }
      .t-in {
        background-color: #258760;
        border-radius: 10px;
      }
    }
  }
  &.show-3 {
    background-color: #eee;
    .time-box {
      padding-top: 113 / 384 * 100%;
      background-image: url('https://c.dvdfab.cn/images/promotion/2022_christmas/timeend.png') no-repeat;
      font-size: 35px;
    }
    .time-txt-con {
      padding: 0 4%;
    }
    .t-txt {
      width: 32%;
      color: #fff;
      font-size: 50px;
    }
    .info-box {
      color: #fff;
    }
    .t-in {
      position: relative;
      top: -5%;
    }
    &.mode-2 {
      background-color: #eee;
      .time-box {
        background: none;
      }
      .t-txt {
        width: 32%;
        height: 77%;
        background-color: transparent;
      }
      .t-in {
        width: 80%;
        height: 100%;
        background-color: #000;
        margin: 0 auto;
      }
      .t-dot {
        &::before,
        &::after {
          box-shadow: 0 0 3px 3px #bbb;
        }
        &::before {
          margin-top: -19px;
        }
        &::after {
          margin-top: 4px;
        }
      }
    }
  }
  .time-box {
    position: relative;
    width: 100%;
    padding-top: 77 / 418 * 100%;
    background-image: url('https://c.dvdfab.cn/images/promotion/2022_christmas/timeend.png') no-repeat;
    font-size: 38px;
    background-size: cover;
  }
  .time-txt-con {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    margin: 0 auto;
    color: #fffc00;
  }
  .t-txt {
    position: relative;
    display: inline-block;
    width: 18%;
    height: 100%;
    .t-in {
      width: 100%;
      height: 100%;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
  }
  .t-dot {
    position: relative;
    width: 2%;
    height: 100%;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.3);
      top: 50%;
      left: 50%;
      margin-left: -4px;
      border-radius: 2px;
    }
    &::before {
      margin-top: -15px;
    }
    &::after {
      margin-top: 5px;
    }
  }
  .pos-unit {
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>
