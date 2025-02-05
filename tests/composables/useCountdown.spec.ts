import { describe, test, expect } from 'vitest'
import { useCountdown } from '../../composables/useCountdown'

describe('useCountdown', () => {
  test('should initialize with empty values', () => {
    const { day, hour, minute, second, ms } = useCountdown(Date.now(), {})
    expect(day.value).toBe('')
    expect(hour.value).toBe('')
    expect(minute.value).toBe('')
    expect(second.value).toBe('')
    expect(ms.value).toBe('')
  })

  test('should countdown correctly with all display options', () => {
    const futureTime = Date.now() + 100000000 // Set future time
    const { day, hour, minute, second, ms } = useCountdown(futureTime, {
      displayDay: true,
      displayHour: true,
      displayMin: true,
      displaySec: true,
      displayMS: true
    })

    expect(day.value).not.toBe('')
    expect(hour.value).not.toBe('')
    expect(minute.value).not.toBe('')
    expect(second.value).not.toBe('')
    expect(ms.value).not.toBe('')
  })

  test('should respect display options', () => {
    const futureTime = Date.now() + 100000000
    const { day, hour, minute, second, ms } = useCountdown(futureTime, {
      displayDay: false,
      displayHour: true,
      displayMin: false,
      displaySec: true,
      displayMS: false
    })

    expect(day.value).toBe('')
    expect(hour.value).not.toBe('')
    expect(minute.value).toBe('')
    expect(second.value).not.toBe('')
    expect(ms.value).toBe('')
  })
})
