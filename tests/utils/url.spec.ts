import { describe, test, expect } from 'vitest'
import { joinUrlParams, urlParamsToString, getUrlParams } from '../../utils/url'

describe('Functionality tests', () => {
  test('joinUrlParams should append params to the url correctly', () => {
    const url = 'https://www.dvdfab.cn';
    const params = { param1: 'value1', param2: 'value2' };
    const result = joinUrlParams(url, params);
    expect(result).toEqual('https://www.dvdfab.cn?param1=value1&param2=value2');
  });

  test('joinUrlParams should handle no params', () => {
    const url = 'https://www.dvdfab.cn';
    const result = joinUrlParams(url);
    expect(result).toEqual('https://www.dvdfab.cn');
  });

  test('urlParamsToString should convert params to QueryString correctly', () => {
    const params = { param1: 'value1', param2: 'value2' };
    const result = urlParamsToString(params);
    expect(result).toEqual('param1=value1&param2=value2');
  });

  test('urlParamsToString should handle empty params', () => {
    const params = {};
    const result = urlParamsToString(params);
    expect(result).toEqual('');
  });

  test('getUrlParams should extract params from the url correctly', () => {
    const url = 'https://www.dvdfab.cn?param1=value1&param2=value2';
    const result = getUrlParams(url);
    expect(result).toEqual({ param1: 'value1', param2: 'value2' });
  });

  test('getUrlParams should handle empty url', () => {
    const url = '';
    const result = getUrlParams(url);
    expect(result).toEqual('');
  });
});
