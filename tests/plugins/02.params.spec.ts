// @vitest-environment nuxt
// https://github.com/nuxt/test-utils/issues/341
// https://www.dvdfab.cn/clientad-for-black-friday.htm?c_app=dvdfab12&client_e=dGVzdC1kdmRfZnVsbF9zdWl0ZV84MjZAZHZkZmFiLmNvbQ%3D%3D&client_m=ZDgtNWUtZDMtNmItMDEtYjg%3D#dev=1
import { describe, test, expect, vi } from 'vitest';
import plugin from '../../plugins/02.params.js'

vi.mock('vue-router');

describe('default export', () => {
  test('should handle email in query and remove login info if needed', async () => {
    const email = 'test-dvd_full_suite_826@dvdfab.com';
    const vueRouter = await import('vue-router')
    // @ts-ignore
    vueRouter.useRoute.mockReturnValue({query: { email }})

    const cookie = await import('../../utils/cookie.js')
    const clientSetCookieMock = vi.spyOn(cookie, 'clientSetCookie')

    // const removeLoginInfoIfNeedMock = vi.spyOn(plugin, 'removeLoginInfoIfNeed')

    plugin(useNuxtApp())

    expect(clientSetCookieMock).toHaveBeenCalledTimes(1);
    expect(clientSetCookieMock).toHaveBeenCalledWith('email', email, 365);
  });

  test('should handle client_e in query and remove login info if needed', async () => {
    const client_e = 'dGVzdC1kdmRfZnVsbF9zdWl0ZV84MjZAZHZkZmFiLmNvbQ==';
    const vueRouter = await import('vue-router')
    // @ts-ignore
    vueRouter.useRoute.mockReturnValue({query: { client_e }})

    const cookie = await import('../../utils/cookie.js')
    const clientSetCookieMock = vi.spyOn(cookie, 'clientSetCookie')

    plugin(useNuxtApp())

    expect(clientSetCookieMock).toHaveBeenCalledTimes(1);
    expect(clientSetCookieMock).toHaveBeenCalledWith('email', 'test-dvd_full_suite_826@dvdfab.com', 365);
  });

  test('should handle client_m in query and set elk_mac cookie', async () => {
    const client_m = 'ZDgtNWUtZDMtNmItMDEtYjg=';
    const vueRouter = await import('vue-router')
    // @ts-ignore
    vueRouter.useRoute.mockReturnValue({query: { client_m }})

    const cookie = await import('../../utils/cookie.js')
    const clientSetCookieMock = vi.spyOn(cookie, 'clientSetCookie')

    plugin(useNuxtApp())

    expect(clientSetCookieMock).toHaveBeenCalledTimes(1);
    expect(clientSetCookieMock).toHaveBeenCalledWith('elk_mac', 'd8-5e-d3-6b-01-b8', 365);
  });
});
