// @vitest-environment nuxt
import { describe, test, expect, vi } from 'vitest';
import middleware from '../../middleware/02.injection-store.global';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import.meta.client = false;

vi.mock('#app/composables/ssr', () => ({
  ...vi.importActual('#app/composables/ssr'),
  useRequestHeader: vi.fn(),
}))

vi.mock('#app/composables/url', () => ({
  ...vi.importActual('#app/composables/url'),
  useRequestURL: vi.fn(),
}))

describe('Middleware', () => {
  const to: RouteLocationNormalizedLoaded = {
    name: 'product',
    path: '/dvd-copy.htm',
    fullPath: '/dvd-copy.htm',
    hash: '',
    query: {},
    params: {},
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  };
  const from: RouteLocationNormalizedLoaded = {
    name: 'index',
    path: '/',
    fullPath: '/',
    hash: '',
    query: {},
    params: {},
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  };

  test('should set client information', async () => {    
    // @ts-ignore
    useRequestHeader.mockImplementation((key: string) => {
      return {
        'x-forwarded-for': '127.0.0.1',
        'x-real-ip': '',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0',
      }[key];
    })
    
    // @ts-ignore
    useRequestURL.mockReturnValue({
      host: 'www.dvdfab.cn',
    })

    process.env.LOCATION = 'pre1';

    const setIpMock = vi.spyOn(useStore.common(), 'setIp')
    const setServeLocationMock = vi.spyOn(useStore.common(), 'setServeLocation')
    const setClientMock = vi.spyOn(useStore.common(), 'setClient')
    const setMobileMock = vi.spyOn(useStore.common(), 'setMobile')
    const setIsX64Mock = vi.spyOn(useStore.common(), 'setIsX64')
    const setHostMock = vi.spyOn(useStore.common(), 'setHost')
    const setLocaleMock = vi.spyOn(useStore.common(), 'setLocale')
    
    await middleware(to, from);

    expect(setIpMock).toHaveBeenCalledWith('127.0.0.1');
    expect(setServeLocationMock).toHaveBeenCalledWith('pre1');
    expect(setClientMock).toHaveBeenCalledWith('win');
    expect(setMobileMock).toHaveBeenCalledWith(false);
    expect(setIsX64Mock).toHaveBeenCalledWith(true);
    expect(setHostMock).toHaveBeenCalledWith('www.dvdfab.cn');    
    expect(setLocaleMock).toHaveBeenCalledWith('en');
  });

  test('should set ip when x-real-ip is present', async () => {
    // @ts-ignore
    useRequestHeader.mockImplementation((key: string) => {
      return {
        'x-forwarded-for': '',
        'x-real-ip': '127.0.0.2',
        'user-agent': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
      }[key];
    })
    
    // @ts-ignore
    useRequestURL.mockReturnValue({
      host: 'www.dvdfab.cn',
    })

    process.env.LOCATION = 'pre1';

    const setIpMock = vi.spyOn(useStore.common(), 'setIp')
    const setServeLocationMock = vi.spyOn(useStore.common(), 'setServeLocation')
    const setClientMock = vi.spyOn(useStore.common(), 'setClient')
    const setMobileMock = vi.spyOn(useStore.common(), 'setMobile')
    const setIsX64Mock = vi.spyOn(useStore.common(), 'setIsX64')
    const setHostMock = vi.spyOn(useStore.common(), 'setHost')
    const setLocaleMock = vi.spyOn(useStore.common(), 'setLocale')

    await middleware(to, from);

    expect(setIpMock).toHaveBeenCalledWith('127.0.0.2');
    expect(setServeLocationMock).toHaveBeenCalledWith('pre1');
    expect(setClientMock).toHaveBeenCalledWith('mac');
    expect(setMobileMock).toHaveBeenCalledWith(true);
    expect(setIsX64Mock).toHaveBeenCalledWith(false);
    expect(setHostMock).toHaveBeenCalledWith('www.dvdfab.cn');    
    expect(setLocaleMock).toHaveBeenCalledWith('en');
  });
});
