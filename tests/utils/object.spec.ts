import { describe, test, expect } from 'vitest'
import { deepCopy, isObject, isArray, getValType, isEmpty } from '../../utils/object'

describe('Utility Functions', () => {
  test('deepCopy should perform a deep copy', () => {
    const obj = { a: 1, b: { c: 2 } };
    const copiedObj = deepCopy(obj);

    expect(copiedObj).toEqual(obj);
    expect(copiedObj.b).not.toBe(obj.b);
  });

  test('isObject should correctly identify objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(1)).toBe(false);
  });

  test('getValType should return the correct type', () => {
    expect(getValType('string')).toEqual('string');
    expect(getValType(123)).toEqual('number');
    expect(getValType(true)).toEqual('boolean');
    expect(getValType({})).toEqual('object');
    expect(getValType([])).toEqual('array');
    expect(getValType(null)).toEqual('null');
    expect(getValType(undefined)).toEqual('undefined');
    expect(getValType(() => {})).toEqual('function');
    expect(getValType(Symbol('symbol'))).toEqual('symbol');
    expect(getValType(/regex/)).toEqual('regexp');
    expect(getValType(new Date())).toEqual('date');
  });

  test('isEmpty should correctly identify empty values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);

    expect(isEmpty('not empty')).toBe(false);
    expect(isEmpty(123)).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
