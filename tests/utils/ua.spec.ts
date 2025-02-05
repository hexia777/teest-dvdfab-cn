import { describe, test, expect } from 'vitest'
import { getBrowser, isMobile, getOperatingSystemInfo, isX64, isBot } from '../../utils/ua'

describe('Functionality tests', () => {
  test('getBrowser should return correct browser', () => {
    expect(getBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual('chrome');
    expect(getBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48')).toEqual('edge');
    //expect(getBrowser('Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.2)')).toEqual('ie');
    expect(getBrowser('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)')).toEqual('ie');
    expect(getBrowser('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)')).toEqual('ie');
    expect(getBrowser('Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)')).toEqual('ie');
    expect(getBrowser('Mozilla/5.0 (compatible; WOW64; MSIE 10.0; Windows NT 6.2)')).toEqual('ie');
    //expect(getBrowser('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko')).toEqual('ie');
    expect(getBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36Edge/13.10586')).toEqual('edge');
    expect(getBrowser('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15')).toEqual('safari');
    expect(getBrowser('Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0')).toEqual('firefox');
    expect(getBrowser('Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18')).toEqual('opera');
  });

  test('isMobile should return correct result', () => {
    expect(isMobile('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')).toEqual(true);
    expect(isMobile('Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')).toEqual(true);
    expect(isMobile('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36')).toEqual(true);
    expect(isMobile('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual(false);
  });

  test('getOperatingSystemInfo should return correct OS', () => {
    expect(getOperatingSystemInfo('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual('win');
    expect(getOperatingSystemInfo('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15')).toEqual('mac');
  });

  test('isX64 should return correct result', () => {
    expect(isX64('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual(true);
    expect(isX64('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual(true);
    expect(isX64('Mozilla/5.0 (Windows NT 6.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual(false);
  });

  test('isBot should return correct result', () => {
    expect(isBot('Googlebot')).toEqual(true);
    expect(isBot('AhrefsBot')).toEqual(true);
    expect(isBot('bingbot')).toEqual(true);
    expect(isBot('python-requests')).toEqual(true);
    expect(isBot('bot')).toEqual(true);
    expect(isBot('crawler')).toEqual(true);
    expect(isBot('spider')).toEqual(true);
    expect(isBot('robot')).toEqual(true);
    expect(isBot('crawling')).toEqual(true);
    expect(isBot('Chrome-Lighthouse')).toEqual(true);
    expect(isBot('Yandex')).toEqual(true);
    expect(isBot('GuzzleHttp')).toEqual(true);
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')).toEqual(false);
  });
});
