import { describe, test, expect, beforeEach } from 'vitest';
import { translatePrice } from '../../utils/price';


describe('translatePrice', () => {
  beforeEach(() => {
    useStore.common().setLocale('en')
  })
  // TODO 单元测试不完备，函数分支不完备

  // en start

  test('should return undefined when price is undefined', () => {
    const result = translatePrice(undefined)
    expect(result).toBeUndefined()
  })

  test('en: 9.90 -> $9.9', () => {
    const price = '9.90'
    const result = translatePrice(price)
    expect(result).toEqual('$9.9')
  })

  test('en: 123 -> $123.00', () => {
    const price = '123'
    const result = translatePrice(price)
    expect(result).toEqual('$123.00')
  })

  test('en: 123.456 -> $123.47', () => {
    const price = '123.456'
    const result = translatePrice(price)
    expect(result).toEqual('$123.46')
  })

  test('en: <span>123</span> -> $<span>123.00</span>', () => {
    const price = '<span>123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('$<span>123.00</span>')
  })

  test('en: <span>123</span> -> $<span>123.00</span>', () => {
    const price = '<span>123.123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('$<span>123.12</span>')
  })

  test('en: <span>123</span> -> $<span>123.00</span>', () => {
    const price = '<span>123.567</span>'
    const result = translatePrice(price)
    expect(result).toEqual('$<span>123.57</span>')
  })

  // ja start

  test('ja: 123 -> ￥120', () => {
    useStore.common().setLocale('ja')
    const price = '123'
    const result = translatePrice(price)
    expect(result).toEqual('￥120')
  })

  test('ja: 125 -> ￥130', () => {
    useStore.common().setLocale('ja')
    const price = '125'
    const result = translatePrice(price)
    expect(result).toEqual('￥130')
  })

  test('ja: 123.45 -> ￥120', () => {
    useStore.common().setLocale('ja')
    const price = '123.45'
    const result = translatePrice(price)
    expect(result).toEqual('￥120')
  })

  test('ja: <span>123</span> -> ￥<span>120</span>', () => {
    useStore.common().setLocale('ja')
    const price = '<span>123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('￥<span>120</span>')
  })

  test('ja: <span>123.45</span> -> ￥<span>120</span>', () => {
    useStore.common().setLocale('ja')
    const price = '<span>123.45</span>'
    const result = translatePrice(price)
    expect(result).toEqual('￥<span>120</span>')
  })

  test('ja: <span>125</span> -> ￥<span>130</span>', () => {
    useStore.common().setLocale('ja')
    const price = '<span>125</span>'
    const result = translatePrice(price)
    expect(result).toEqual('￥<span>130</span>')
  })

  // de start

  test('de: 9.90 -> 9.9€', () => {
    useStore.common().setLocale('de')
    const price = '9.90'
    const result = translatePrice(price)
    expect(result).toEqual('9,9€')
  })

  test('de: 123 -> 123.00€', () => {
    useStore.common().setLocale('de')
    const price = '123'
    const result = translatePrice(price)
    expect(result).toEqual('123,00€')
  })

  test('de: 1,234.56 -> 1,234.56€', () => {
    useStore.common().setLocale('de')
    const price = '1,234.56'
    const result = translatePrice(price)
    expect(result).toEqual('1,234.56€')
  })

  test('de: <span>9.90</span> -> <span>9.9</span>€', () => {
    useStore.common().setLocale('de')
    const price = '<span>9.90</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>9,9</span>€')
  })

  test('de: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('de')
    const price = '<span>123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,00</span>€')
  })

  test('de: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('de')
    const price = '<span>123.123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,12</span>€')
  })

  test('de: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('de')
    const price = '<span>123.567</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,57</span>€')
  })

  test('de: <span>1,234.0</span> -> <span>1,234.0</span>€', () => {
    useStore.common().setLocale('de')
    const price = '<span>1,234.0</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>1,234.0</span>€')
  })

  // test('de: <span>1,234.0</span> -> <span>1,234.0</span>€', () => {
  //   useStore.common().setLocale('de')
  //   const price = '<span>1,234.123</span>'
  //   const result = translatePrice(price)
  //   expect(result).toEqual('<span>1,234.12</span>€')
  // })

  // test('de: <span>1,234.0</span> -> <span>1,234.0</span>€', () => {
  //   useStore.common().setLocale('de')
  //   const price = '<span>1,234.567</span>'
  //   const result = translatePrice(price)
  //   expect(result).toEqual('<span>1,234.57</span>€')
  // })

  // fr start

  test('fr: 9.90 -> 9.9€', () => {
    useStore.common().setLocale('fr')
    const price = '9.90'
    const result = translatePrice(price)
    expect(result).toEqual('9,9€')
  })

  test('fr: 123 -> 123.00€', () => {
    useStore.common().setLocale('fr')
    const price = '123'
    const result = translatePrice(price)
    expect(result).toEqual('123,00€')
  })

  test('fr: 1,234.56 -> 1,234.56€', () => {
    useStore.common().setLocale('fr')
    const price = '1,234.56'
    const result = translatePrice(price)
    expect(result).toEqual('1,234.56€')
  })

  test('fr: <span>9.90</span> -> <span>9.9</span>€', () => {
    useStore.common().setLocale('fr')
    const price = '<span>9.90</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>9,9</span>€')
  })

  test('fr: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('fr')
    const price = '<span>123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,00</span>€')
  })

  test('fr: <span>1,234.1</span> -> <span>1,234.1</span>€', () => {
    useStore.common().setLocale('fr')
    const price = '<span>1,234.1</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>1,234.1</span>€')
  })

  test('fr: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('fr')
    const price = '<span>123.123</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,12</span>€')
  })

  test('fr: <span>123</span> -> <span>123</span>€', () => {
    useStore.common().setLocale('fr')
    const price = '<span>123.567</span>'
    const result = translatePrice(price)
    expect(result).toEqual('<span>123,57</span>€')
  })

  // test('fr: <span>1,234.1</span> -> <span>1,234.1</span>€', () => {
  //   useStore.common().setLocale('fr')
  //   const price = '<span>1,234.123</span>'
  //   const result = translatePrice(price)
  //   expect(result).toEqual('<span>1,234.12</span>€')
  // })

  // test('fr: <span>1,234.1</span> -> <span>1,234.1</span>€', () => {
  //   useStore.common().setLocale('fr')
  //   const price = '<span>1,234.567</span>'
  //   const result = translatePrice(price)
  //   expect(result).toEqual('<span>1,234.57</span>€')
  // })
});
