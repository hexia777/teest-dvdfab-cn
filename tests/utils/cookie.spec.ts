import { describe, test, expect } from 'vitest'
import { cookieExpireTime, newCookie, clientSetCookie, getCookieDomain } from '../../utils/cookie'

describe('Cookie Functions', () => {
  test('cookieExpireTime should return correct expiration time', () => {
    const expireDays = 7;
    const expectedExpireTime = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000).toUTCString();
    const actualExpireTime = cookieExpireTime(expireDays);
    expect(actualExpireTime).toEqual(expectedExpireTime);
  });

  test('newCookie should generate correct cookie string', () => {
    const name = '_EA_SID';
    const value = 'MTczNTgwMDM2OF8wM19kdmRmYWJfY25fQjVmbkJwMEZDQw%3D%3D';
    const expireDays = 3;
    const domain = '.dvdfab.cn';
    const expectedCookie = `${name}=${value}; expires=${cookieExpireTime(expireDays)}; domain=; path=/`; // 测试环境不设置 domain
    const actualCookie = newCookie(name, value, expireDays, domain);
    expect(actualCookie).toEqual(expectedCookie);
  });

  test('clientSetCookie should set cookie correctly in browser', () => {
    const name = '_EA_SID';
    const value = 'MTczNTgwMDM2OF8wM19kdmRmYWJfY25fQjVmbkJwMEZDQw%3D%3D';
    const expireDays = 2;
    clientSetCookie(name, value, expireDays);
    const cookies = document.cookie.split('; ');
    const foundCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    expect(foundCookie).toBeDefined();
  });

  test('getCookieDomain should return correct top-level domain', () => {
    const host = 'ja.dvdfab.cn';
    const expectedDomain = '.dvdfab.cn';
    const actualDomain = getCookieDomain(host);
    expect(actualDomain).toEqual(expectedDomain);
  });

  test('getCookieDomain should handle IP address and localhost', () => {
    const ipHost = '127.0.0.1';
    const expectedIpDomain = '127.0.0.1';    
    const actualIpDomain = getCookieDomain(ipHost);
    expect(actualIpDomain).toEqual(expectedIpDomain);

    const localhostHost = 'localhost';
    const actualLocalhostDomain = getCookieDomain(localhostHost);    
    const expectedLocalhostDomain = 'localhost';
    expect(actualLocalhostDomain).toEqual(expectedLocalhostDomain);
  });
});
