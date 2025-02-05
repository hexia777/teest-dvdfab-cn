import { describe, test, expect, beforeEach, vi } from 'vitest'
import {
  GLOBAL_CONFIG,
  E_SUCCESS,
  E_INTERNAL,
  E_TOKEN,
  E_URL,
  successResponse,
  errorResponse,
  getDataByKey,
  commonQuery,
  commonUpdate,
  commonDelete,
  updateGlobalConfig,
  listModuleVersion,
  updateModuleVersion,
  deleteModuleVersion,
  listModuleTtl,
  updateModuleTtl,
  deleteModuleTtl,
  listWhiteUrl,
  updateWhiteUrlList,
  deleteWhiteUrlList,
  listWhiteRe,
  updateWhiteRe,
  deleteWhiteRe,
  listCommonWhiteParam,
  updateCommonWhiteParamList,
  deleteCommonWhiteParamList,
  listSinglePageWhiteParam,
  updateSinglePageWhiteParam,
  deleteSinglePageWhiteParam,
  listBlackUrl,
  updateBlackUrlList,
  deleteBlackUrlList,
  listKvCacheTtl,
  updateKvCacheTtl,
  listGlobalConfig,
  deleteKvByKey,
  handleCacheManageAPI,
} from '../dvdfab_worker.js'

import * as dvdfabWorker from '../dvdfab_worker.js'
const kvNamespace = require('../workers_kv')

expect.extend({
  async toBeSuccess(received, data) {
    const response = received

    const decoder = new TextDecoder('utf-8')
    const responseBody = decoder.decode((await response.body.getReader().read()).value)

    return {
      pass: response.status == 200 && responseBody == JSON.stringify({ code: E_SUCCESS, data }),
      message: () => ``,
      actual: responseBody,
      expected: JSON.stringify({ code: E_SUCCESS, data }),
    }
  },
})

expect.extend({
  async toBeError(received, code, errmsg) {
    const response = received

    const decoder = new TextDecoder('utf-8')
    const responseBody = decoder.decode((await response.body.getReader().read()).value)

    return {
      pass: response.status == 200 && responseBody == JSON.stringify({ code, errmsg }),
      message: () => ``,
      actual: responseBody,
      expected: JSON.stringify({ code, errmsg }),
    }
  },
})

describe('API Response Functions', () => {
  test('successResponse should return a 200 status response with correct data', async () => {
    const data = { message: 'Success' }
    const response = successResponse(data)
    expect(response).toBeSuccess(data)
  })

  test('errorResponse should return a 200 status response with correct error code and message', async () => {
    const code = E_INTERNAL
    const errmsg = 'Error occurred'
    const response = errorResponse(code, errmsg)
    expect(response).toBeError(code, errmsg)
  })
})

describe('API Utils', () => {
  test('getDataByKey should return the correct data', async () => {
    // Set some global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1', key2: 'value2' }))

    const result = await getDataByKey('key1')
    expect(result).toEqual('value1')
  })

  test('getDataByKey should return an empty object if key is not found', async () => {
    const result = await getDataByKey('nonExistingKey')
    expect(result).toEqual(undefined)
  })

  test('getDataByKey should handle parsing errors gracefully', async () => {
    // Set invalid global config data
    await kvNamespace.put(GLOBAL_CONFIG, 'invalidJson')

    const result = await getDataByKey('key1')
    expect(result).toEqual({})
  })

  test('commonQuery should return the correct data', async () => {
    // Set some global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1', key2: 'value2' }))

    const result = await commonQuery('key1')
    expect(await result.json()).toEqual({ code: 0, data: 'value1' })
  })

  test('commonQuery should handle errors gracefully', async () => {
    // Simulate an error in getDataByKey
    // vi.spyOn(getDataByKey, 'get').mockRejectedValueOnce(new Error('Test error'));

    vi.doMock('../dvdfab_worker.js', () => ({
      ...vi.importActual('../dvdfab_worker.js'),
      commonQuery: vi.fn(() => {
        throw new Error('Internal error')
      }),
    }))
    const { commonQuery } = await import('../dvdfab_worker.js')

    try {
      await commonQuery('key1')
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toEqual('Internal error')
    } finally {
      // 清除模拟
      vi.doUnmock('../dvdfab_worker.js')
    }
  })

  test('commonUpdate should update the global config correctly', async () => {
    // Set some initial global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1' }))

    const result = await commonUpdate('key1', 'newValue', 'str')
    expect(await result.json()).toEqual({ code: 0, data: 'newValue' })
  })

  test('commonUpdate should handle invalid types gracefully', async () => {
    const result = await commonUpdate('key1', 'newValue', 'invalidType')
    expect(await result.json()).toEqual({ code: E_INTERNAL, errmsg: 'Invalid type' })
  })

  test('commonDelete should delete the data correctly', async () => {
    // Set some initial global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1', key2: 'value2' }))

    const result = await commonDelete('key1', null, 'str')
    expect((await result.json()).code).toEqual(0)
    expect(await getDataByKey('key1')).toEqual('')
  })

  test('commonDelete should handle invalid types gracefully', async () => {
    const result = await commonDelete('key1', 'value1', 'invalidType')
    expect(await result.json()).toEqual({ code: E_INTERNAL, errmsg: 'Invalid type' })
  })

  test('updateGlobalConfig should update the global config correctly', async () => {
    // Set some initial global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1' }))

    const result = await updateGlobalConfig('key1', 'newValue')
    expect((await result.json()).code).toEqual(0)
    expect(await getDataByKey('key1')).toEqual('newValue')
  })

  test('updateGlobalConfig should handle delete operation correctly', async () => {
    // Set some initial global config data
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1' }))

    const result = await updateGlobalConfig('key1', null, 'delete')
    expect((await result.json()).code).toEqual(0)
    expect(await getDataByKey('key1')).toEqual(undefined)
  })
})

describe('API Functions', () => {
  // Test listModuleVersion
  test('should return the result of commonQuery(VERSION_MODULE)', async () => {
    const response = await listModuleVersion()
    expect(await response.json()).toEqual({ code: 0, data: undefined })
  })

  // Test updateModuleVersion
  test('should return the result of commonUpdate(VERSION_MODULE, data)', async () => {
    const data = { product: '20250102' } // Provide the data to be updated
    const result = await updateModuleVersion(JSON.stringify(data))
    expect((await result.json()).code).toEqual(0)
    expect(await getDataByKey('VERSION_MODULE')).toEqual(data)
  })

  // Test deleteModuleVersion
  test('should return the result of commonDelete(VERSION_MODULE, data)', async () => {
    await kvNamespace.put(
      GLOBAL_CONFIG,
      JSON.stringify({ VERSION_MODULE: { product: '20250102', article_detail: '20250102' } }),
    )
    const data = ['product'] // Provide the data to be deleted
    const result = await deleteModuleVersion(JSON.stringify(data))
    expect((await result.json()).code).toEqual(0)
    expect((await getDataByKey('VERSION_MODULE')).product).toEqual(undefined)
  })

  // TO DO：Similar tests for other functions...

  // Test listGlobalConfig
  test('should return the result of listGlobalConfig()', async () => {
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1', key2: 'value2' }))

    const result = await listGlobalConfig()
    expect(await result.json()).toEqual({ code: 0, data: { key1: 'value1', key2: 'value2' } })
  })

  // Test deleteKvByKey
  test('should return successResponse after deleting the KV record by key', async () => {
    await kvNamespace.put(GLOBAL_CONFIG, JSON.stringify({ key1: 'value1', key2: 'value2' }))

    const data = 'key1' // Provide the key to be deleted
    const result = await deleteKvByKey(data)
    expect((await result.json()).code).toEqual(0)
    expect(await getDataByKey('VERSION_MODULE')).toEqual(undefined)
  })
})

describe('API handleCacheManageAPI', () => {
  let req

  beforeEach(() => {
    req = {
      headers: {
        get: vi.fn(
          (key) =>
            ({
              token: 'TOKEN',
            }[key]),
        ),
      },
      url: 'http://example.com/list-module-version?data=test_data',
      text: vi.fn().mockResolvedValue('test_raw_data'),
    }
  })

  test('should handle valid request with correct token', async () => {
    const response = await handleCacheManageAPI(req)
    expect(response).toEqual(expect.any(Object))
  })

  test('should return error response for invalid token', async () => {
    req.headers.get.mockReturnValue('invalid_token')
    const response = await handleCacheManageAPI(req)
    expect(await response.json()).toEqual({ code: E_TOKEN, errmsg: 'Access denied' })
  })

  test('should handle list-module-version request', async () => {
    req.url = 'http://example.com/list-module-version'

    // TO DO:下面的方式为啥不行？
    // const spy = vi.spyOn(dvdfabWorker, 'listModuleVersion')
    // await dvdfabWorker.handleCacheManageAPI(req)
    // await dvdfabWorker.listModuleVersion()
    // expect(spy).toHaveBeenCalled()

    const response = await handleCacheManageAPI(req)
    const expectedResponse = await listModuleVersion()

    expect(await response.json()).toEqual(await expectedResponse.json())
  })

  test('should handle update-module-version request', async () => {
    req.url = 'http://example.com/update-module-version?data={"product":"20241204184434405"}'

    const response = await handleCacheManageAPI(req)
    const expectedResponse = await updateModuleVersion(JSON.stringify({ product: '20241204184434405' }))

    expect(await response.json()).toEqual(await expectedResponse.json())
  })

  test('should handle delete-module-version request', async () => {
    req.url = 'http://example.com/delete-module-version?data=["product"]'

    const response = await handleCacheManageAPI(req)
    const expectedResponse = await deleteModuleVersion(JSON.stringify(['product']))

    expect(await response.json()).toEqual(await expectedResponse.json())
  })

  test('should handle invalid request URL', async () => {
    req.url = 'http://example.com/invalid-url'
    const response = await handleCacheManageAPI(req)
    expect(await response.json()).toEqual({ code: E_URL, errmsg: 'Invalid request URL' })
  })

  test('should handle internal error', async () => {
    // 使用 vi.doMock 进行临时模拟
    vi.doMock('../dvdfab_worker.js', () => ({
      ...vi.importActual('../dvdfab_worker.js'),
      handleCacheManageAPI: vi.fn(() => {
        throw new Error('Internal error')
      }),
    }))

    const { handleCacheManageAPI } = await import('../dvdfab_worker.js')

    try {
      req.url = 'http://example.com/list-module-version'
      await handleCacheManageAPI(req)
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toBe('Internal error')
    } finally {
      // 清除模拟
      vi.doUnmock('../dvdfab_worker.js')
    }
  })
})
