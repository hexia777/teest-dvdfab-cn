export const cacheConfig = {
  api_cache_list: [],
  cache_ignore_params: [],
  cache_domain: 'www.dvdfab.cn',
  lang_paths: [],
  page_cache_dev_switch: 'off',
  page_cache_api_url_suffix: '.htm',
  page_cache_key_format: '$domain.$os.$device',
  page_cache_login_cookie_name: 'laravel_session',
  page_cache_query_params: {
    // '/dvd-copy.htm': ['a', 'b'],
  }, // 做成参数白名单,设置缓存参数
  page_cache_ignore_query_params: [
    // 设置参数白名单后,此参数可以删除掉
    'trackid',
    '_csrc_',
    '_cus_',
    '_cut_',
    'ad_channel',
    'ad_campaign',
    'ad_group',
    'ad_content',
  ],
  page_cache_special_locales_uris: [],
  page_cache_test_open: true, // 测试域是否开始缓存
  hostname: 'page_cache', // 测试域先开启,上线后要调整为page_cache
  test_hostname: 'page-cache',
}
