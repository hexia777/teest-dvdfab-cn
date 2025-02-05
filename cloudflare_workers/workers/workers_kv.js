_store = {
    GLOBAL_CONFIG: "{}",
    VERSION_MODULE: {},
    TTL_MODULE: {},
    WHITELIST_PARAM_COMMON: [],
    WHITELIST_PARAM_PAGE: {},
    BLACKLIST_URL: [],
    TTL_KVCACHE: {
      GLOBAL_CONFIG: 60
    }
}

module.exports = {
    get: (key) => {
        return _store[key];
    },
    put: (key, value) => {
        _store[key] = value;
    },
}
