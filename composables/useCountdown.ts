import { ref, watch } from 'vue'
export interface ICountdownParams {
  displayDay?: boolean
  displayHour?: boolean
  displayMin?: boolean
  displaySec?: boolean
  displayMS?: boolean
  loopSeconds?: number
  delimiter?: string
}

export function useCountdown(timeEnd: any, params: ICountdownParams) {
  const day = ref('')
  const hour = ref('')
  const minute = ref('')
  const second = ref('')
  const ms = ref('') // 毫秒

  // onMounted(() => {
  //   initCountDown(timeEnd)
  // })

  const countdown = (timestamp: number, callback: any) => {
    const days = 24 * 60 * 60 * 10
    const hours = 60 * 60 * 10
    const minutes = 60 * 10

    let left, d, h, m, s, ss

    return (function tick(left_) {
      // Time left
      left = left_ || Math.floor((timestamp - new Date().getTime()) / 100)

      if (left < 0) {
        left = 0
      }

      // Number of days left
      d = Math.floor(left / days)
      if (params.displayDay) {
        left -= d * days
      }

      // Number of hours left
      h = Math.floor(left / hours)
      left -= h * hours

      // Number of minutes left
      m = Math.floor(left / minutes)
      left -= m * minutes

      s = Math.floor(left / 10)
      left -= s * 10

      // Number of seconds left
      ss = left

      // Calling an  user supplied callback
      callback(d, h, m, s, ss)

      if (d === 0 && h === 0 && m === 0 && s === 0) {
        // 为0 以后，再次轮询倒计时
        if (params.loopSeconds && !isNaN(+params.loopSeconds)) {
          initCountDown(new Date().getTime() / 1000 + params.loopSeconds)
        }
        return
      } // 停止循环
      // Scheduling another call of this function in 1s
      return setTimeout(tick, 100)
    })()
  }

  const getTick = (s: number, delimiter?: string) => {
    const sString = s + ''
    if (sString.length === 1) {
      if (delimiter) {
        return `0${delimiter}${sString}`
      }

      return '0' + sString
    } else {
      if (delimiter) {
        const timeStr = sString
        const result = timeStr.split('').join(delimiter)

        return result
      }
      return sString
    }
  }
  const initCountDown = (timeEnd: number) => {
    countdown(
      timeEnd * 1000,
      (days: number, hours: number, minutes: number, seconds: number, millisecond: number) => {
        if (params.displayDay) {
          day.value = getTick(days, params.delimiter)
        }
        if (params.displayHour) {
          hour.value = getTick(hours, params.delimiter)
        }
        if (params.displayMin) {
          minute.value = getTick(minutes, params.delimiter)
        }
        if (params.displaySec) {
          second.value = getTick(seconds, params.delimiter)
        }
        if (params.displayMS) {
          ms.value = getTick(millisecond, params.delimiter)
        }
      },
    )
  }
  watch(
    () => timeEnd,
    (val: number) => {
      if (val) {
        initCountDown(val)
      }
    },
    { immediate: true },
  )
  return { day, hour, minute, second, ms }
}
