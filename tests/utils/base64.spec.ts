import { describe, test, expect } from 'vitest'
import { base64Encode, base64Decode, fixBase64DecodeParam } from '../../utils/base64'

describe('Base64 编码和解码函数', () => {
  test('base64Encode 应该正确编码对象', () => {
    const data = { name: 'John', age: 30 };
    const encoded = base64Encode(data);
    expect(encoded).not.toBeNull();
  });

  test('base64Decode 应该正确解码 base64 字符串', () => {
    const encodedData = base64Encode({ name: 'Jane', age: 25 });
    const decoded = base64Decode(encodedData);
    expect(decoded).toEqual(JSON.stringify({ name: 'Jane', age: 25 }));
  });

  test('fixBase64DecodeParam 应该修复 base64 解码参数', () => {
    const encodedString = 'dGVzdC1kdmRfZnVsbF9zdWl0ZV84MjZAZHZkZmFiLmNvbQ==';
    const fixed = fixBase64DecodeParam(encodedString);
    expect(fixed).toEqual('test-dvd_full_suite_826@dvdfab.com');
  });
});
