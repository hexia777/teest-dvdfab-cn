import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getBrowser,
  getBrowserLocale,
  getOperatingSystemInfo,
  isMobile,
  getCookie,
  handlePromotionBannerStatus,
  getCurrentFormattedTime,
  calculateHash,
  GLOBAL_CONFIG,
  globalConfigJson,
  getGlobalConfigJson,
  getGlobalConfigTTl,
  getKVGlobalConfig,
  getAllMoudleInfoList,
  cacheRequest,
  strandardUri,
  getReqUrlInfo,
  processWhitelistParams,
  rewriteUrl,
  bypassCache,
  handleCache,
  handleRequest,
  handleCacheManageAPI,
} from '../dvdfab_worker'

describe('Cache Utils', () => {
  test('getBrowser should detect correct browser', () => {
    expect(
      getBrowser(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124',
      ),
    ).toEqual('chrome')
    expect(
      getBrowser(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48',
      ),
    ).toEqual('edge')
    // expect(getBrowser('Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.2)')).toEqual('ie');
    expect(getBrowser('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)')).toEqual('ie')
    expect(getBrowser('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)')).toEqual('ie')
    expect(getBrowser('Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)')).toEqual('ie')
    expect(getBrowser('Mozilla/5.0 (compatible; WOW64; MSIE 10.0; Windows NT 6.2)')).toEqual('ie')
    // expect(getBrowser('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko')).toEqual('ie');
    expect(
      getBrowser(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/13.10586',
      ),
    ).toEqual('edge')
    expect(
      getBrowser(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
      ),
    ).toEqual('safari')
    expect(getBrowser('Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0')).toEqual('ff')
    expect(getBrowser('Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18')).toEqual('opera')
  })

  test('getBrowserLocale should extract correct locale', () => {
    expect(getBrowserLocale('en-US')).toEqual('en-US')
    expect(getBrowserLocale('fr-FR')).toEqual('fr-FR')
  })

  test('getOperatingSystemInfo should detect correct OS', () => {
    expect(
      getOperatingSystemInfo(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ),
    ).toEqual('win')
    expect(
      getOperatingSystemInfo(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
      ),
    ).toEqual('mac')
  })

  test('isMobile should detect mobile devices', () => {
    expect(
      isMobile(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      ),
    ).toEqual(true)
    expect(
      isMobile(
        'Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      ),
    ).toEqual(true)
    expect(
      isMobile(
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
      ),
    ).toEqual(true)
    expect(
      isMobile(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ),
    ).toEqual(false)
  })

  test('getCookie should retrieve correct cookie value', () => {
    const cookies = 'name=value; anotherCookie=anotherValue'
    expect(getCookie(cookies, 'name')).toEqual('value')
    expect(getCookie(cookies, 'anotherCookie')).toEqual('anotherValue')
  })

  test('getCookie should return null', () => {
    const cookies = ''
    expect(getCookie(cookies, 'name')).toEqual(null)
  })

  test('handlePromotionBannerStatus should handle banner status correctly', () => {
    // TODO: 使用真实的 HTML 测试
    // TODO: 分支覆盖
    const event = 'close_coupon_playerfab_promotion_year_middle=close;'
    const hitHtml =
      '<aside id="promotion-header-banner" class="relative text-center header-banner" data-style="83d943e0-848f-415a-b93b-6195087f1e6c" data-v-4832bcf5 style="--649d6483:url(https://c4.dvdfab.cn/media/head_playerfab_promotion_en_46bd0d62ab.png) no-repeat center;--167b5d75:#ffcb00;--2e32f26b:#fff;--5ed18fdd:rgba(0, 0, 0, .2);--538bbd7f:#5c2385;--9c72dc1e:#fff;--88a6199c:#fff;--6a2eeaf0:#fff;--c75ebf06:18px;--54b6f2f9:2px solid #FFFFFF;--a4c6b50a:linear-gradient(270deg, #ff3913 0%, #ff741b 100%);--6e09ba14:#FFFFFF;--ab79ae6c:#ffcb00;" data-v-e54e6747></aside>'
    const result = handlePromotionBannerStatus(event, hitHtml)
    expect(result).toEqual(
      hitHtml
        .replace(' --ab79ae6c: #ffcb00;', ' --ab79ae6c: #ffcb00; display: none;')
        .replace('data-style="83d943e0-848f-415a-b93b-6195087f1e6c"', ''),
    )
  })

  test('getCurrentFormattedTime should return correct formatted time', () => {
    const now = new Date()
    const expectedFormat = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate(),
    ).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
      2,
      '0',
    )}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`
    expect(getCurrentFormattedTime().substring(0, 14)).toEqual(expectedFormat.substring(0, 14))
  })

  test('calculateHash should calculate correct SHA1 hash', async () => {
    const url = 'https://example.com'
    const expectedHash = '327c3fda87ce286848a574982ddd0b7c7487f816'
    const hash = await calculateHash(url)
    expect(hash).toEqual(expectedHash)
  })
})

describe('Cache Functions', () => {
  // beforeEach(() => {
  //   // Mock necessary dependencies or data
  //   vi.mock('./workers_kv');
  // });

  // afterEach(() => {
  //   // Clean up mocks or reset state
  //   vi.unmock('./workers_kv');
  // });

  test('getKVGlobalConfig', async () => {
    const globalConfigData =
      '{"VERSION_MODULE": {}, "TTL_MODULE": {}, "BLACKLIST_URL": [], "WHITELIST_PARAM_COMMON": [], "WHITELIST_PARAM_PAGE": {}, "TTL_KVCACHE": {"GLOBAL_CONFIG": 61}}'
    require('../workers_kv').put(GLOBAL_CONFIG, globalConfigData)

    await getKVGlobalConfig()

    expect(getGlobalConfigJson()).toEqual(JSON.parse(globalConfigData))
    expect(getGlobalConfigTTl()).toEqual(61)
  })

  test('getAllMoudleInfoList', async () => {
    globalConfigJson = {
      VERSION_MODULE: { module1: '1.0', module2: '2.0' },
      URL_LIST_MODULE1: ['url1', 'url2'],
      URL_LIST_MODULE2: ['url3'],
      TTL_MODULE: { module1: 30, module2: 60 },
      URL_RE_MODULE1: 'regex1',
      URL_RE_MODULE2: 'regex2',
    }
    require('../workers_kv').put(GLOBAL_CONFIG, JSON.stringify(globalConfigJson))
    await getKVGlobalConfig()

    const result = await getAllMoudleInfoList()

    expect(result).toEqual([
      { set: new Set(['url1', 'url2']), type: 'module1', ttl: 30, regex: new RegExp('regex1') },
      { set: new Set(['url3']), type: 'module2', ttl: 60, regex: new RegExp('regex2') },
    ])
  })

  test('cacheRequest', async () => {
    const request = 'https://example.com'
    const ttl = 60

    const response = await cacheRequest(request, ttl)

    expect(response).toBeDefined()
  })

  test('strandardUri', () => {
    const result = strandardUri('https://example.com/page_1')

    expect(result).toEqual('/page-1')
  })

  test('getReqUrlInfo', async () => {
    globalConfigJson = {
      BLACKLIST_URL: ['/blacklisted_url'],
      VERSION_MODULE: { module1: '1.0' },
      URL_LIST_MODULE1: ['/url1'],
      TTL_MODULE: { module1: 30 },
    }
    require('../workers_kv').put(GLOBAL_CONFIG, JSON.stringify(globalConfigJson))
    await getKVGlobalConfig()

    const req = { url: 'https://example.com/url1', method: 'GET' }
    const result = await getReqUrlInfo(req)
    expect(result).toEqual({ bypass: false, urlType: 'module1', ttl: 30 })

    const req2 = { url: 'https://example.com/blacklisted_url', method: 'GET' }
    const result2 = await getReqUrlInfo(req2)
    expect(result2).toEqual({ bypass: true, urlType: '', ttl: 0 })
  })

  test('processWhitelistParams', async () => {
    globalConfigJson = {
      WHITELIST_PARAM_COMMON: ['param1'],
      WHITELIST_PARAM_PAGE: { '/url1': ['param2'] },
    }
    require('../workers_kv').put(GLOBAL_CONFIG, JSON.stringify(globalConfigJson))
    await getKVGlobalConfig()

    const url = 'https://example.com/url1?param2=value2&param1=value1&param3=value3'
    const result = processWhitelistParams(url)

    expect(result).toEqual('https://example.com/url1?param1=value1&param2=value2')
  })

  test('rewriteUrl', async () => {
    const req = {
      url: 'https://example.com',
      headers: {
        get: vi.fn(
          (key) =>
            ({
              'accept-language': 'en-US',
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }[key]),
        ),
      },
    }

    const result = await rewriteUrl(req)

    expect(result).toContain('_client=en-US.win.pc')
  })

  test('bypassCache', async () => {
    const mockHtml = '<html><body>Test</body></html>'
    const mockResponse = {
      headers: new Map([['Content-Type', 'text/html']]),
      text: vi.fn().mockResolvedValue(mockHtml),
      clone: vi.fn().mockReturnValue({}),
    }
    globalThis.fetch = vi.fn()
    globalThis.fetch.mockResolvedValue(mockResponse)

    const mockRequest = new Request('https://example.com', {
      headers: new Headers({
        cookie: 'test_cookie',
      }),
    })

    const result = await bypassCache(mockRequest)

    expect(fetch).toHaveBeenCalledWith(mockRequest)
    expect(mockResponse.text).toHaveBeenCalled()
    // expect(handlePromotionBannerStatus).toHaveBeenCalledWith('test_cookie', mockHtml);
    expect(result).toBeInstanceOf(Response)
  })

  test('handleCache', async () => {
    globalConfigJson = {
      VERSION_MODULE: { module1: '1.0' },
      URL_LIST_MODULE1: ['url1'],
      TTL_MODULE: { module1: 30 },
      BLACKLIST_URL: ['blacklisted_url'],
    }
    require('../workers_kv').put(GLOBAL_CONFIG, JSON.stringify(globalConfigJson))
    await getKVGlobalConfig()

    const req = {
      url: 'https://example.com/url1',
      headers: {
        'accept-language': 'en-US',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    }

    const response = await handleCache(req)

    expect(response).toBeDefined()
  })
})

describe('Cache handleRequest', () => {
  let event

  beforeEach(() => {
    event = {
      request: {
        url: '',
        headers: {
          'accept-language': '',
          'user-agent': '',
          cookie: '',
        },
      },
    }
  })

  test('should bypass cache when _original=1 is present', async () => {
    event.request.url += '_original=1'
    const response = await handleRequest(event)
    expect(response).toEqual(await bypassCache(event.request))
  })

  test('should handle cache manage API request', async () => {
    const req = {
      url: 'https://example.com/-cloudflare-worker/',
      headers: {
        get: vi.fn(
          (key) =>
            ({
              token: '123',
              'accept-language': 'en-US',
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }[key]),
        ),
      },
    }
    const response = await handleRequest({ request: req })
    const expectedResponse = await handleCacheManageAPI(req)
    expect(response.status).toEqual(expectedResponse.status)
    expect(response.headers.get('Content-Type')).toEqual(expectedResponse.headers.get('Content-Type'))
    expect(await response.json()).toEqual(await expectedResponse.json())
  })

  test('should handle cache for normal requests', async () => {
    // Set up various scenarios for testing cache handling
    event.request.url = 'https://example.com/testUrl'
    event.request.method = 'GET'
    event.request.headers['accept-language'] = 'en-US'
    event.request.headers['user-agent'] = 'testUserAgent'
    event.request.headers.cookie = 'testCookie'

    const response = await handleRequest(event)
    expect(response).toEqual(await handleCache(event.request))
  })

  test('should handle errors and bypass cache', async () => {
    // Simulate an error during handling
    event.request.url = 'errorUrl'
    const error = new Error('Test error')

    try {
      await handleRequest(event)
    } catch (e) {
      expect(e).toEqual(error)
    }
  })
})
