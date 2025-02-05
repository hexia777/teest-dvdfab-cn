import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HelloWorld from '../../components/HelloWorld.vue'

describe('HelloWorld', () => {
  test('component renders Hello world properly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Hello world')
  })
})
