// https://github.com/JkmAS/nuxt-pm2-cluster
// https://github.com/nuxt/nuxt.js/issues/3778
// https://github.com/nuxt/nuxt.js/issues/2630
// https://github.com/Unitech/pm2/issues/4082
// https://www.npmjs.com/package/nuxt-start
// https://github.com/nuxt/nuxt.js
module.exports = {
  apps: [
    {
      name: 'web_front',
      script: '.output/server/index.mjs',
      cwd: './',
      node_args: '--max-old-space-size=30720',
      instances: 20,
      exec_mode: 'cluster',
      autorestart: true,
      watch: ['publish_ts'],
      watch_delay: 2000,
      watch_options: {
        followSymlinks: false,
        usePolling: true,
      },
      max_memory_restart: '360M',
      restart_delay: 3000, // 对于异常情况导致应用停止，设定异常重启延迟可防止应用在不可测情况下不断重启的导致重启次数过多等
      // cron_restart: '30 09 * * *', //应用进程运行时间久了或许总会产生一些意料之外的问题，定时可以规避一些不可测的情况,每天9点30分重启，cluster 不影响服务
      env: {
        ENV: 'online',
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=30720',
        NUXT_PACK_ENV: 'prod',
        NUXT_PUBLIC_API_BASE: 'https://web-backend-api-us.dvdfab.cn',
        NUXT_PUBLIC_API_PREFIX: '/api/',
        NUXT_PUBLIC_API_OM: 'https://servo-slave-us.dvdfab.cn',
        NUXT_PUBLIC_API_PHP: 'https://web-backend-us.dvdfab.cn',
        NUXT_PUBLIC_API_OAPI: 'https://oapi2-us.dvdfab.cn',
        NUXT_PUBLIC_API_TICKET: 'https://ticket-api.dvdfab.cn',
        NUXT_PUBLIC_API_G_OAUTH: 'https://g-auth.dvdfab.cn',
        NUXT_PUBLIC_API_RISK: 'https://user-profile.dvdfab.cn',
      },
    },
    {
      name: 'page_cache_reset_version',
      script: 'page_cache_reset_version.cjs',
      node_args: '--max-old-space-size=30720',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: ['publish_ts'],
      // watch_delay: 300000, // delay 300s to avoid cache problem
      watch_options: {
        followSymlinks: false,
        usePolling: true,
      },
      max_memory_restart: '4G',
      env: {
        ENV: 'online',
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=30720',
        CACHE_HOSTNAME: 'page_cache',
      },
    },
    {
      name: 'page_cache_sync',
      script: 'page_cache_sync.cjs',
      node_args: '--max-old-space-size=30720',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: ['publish_ts'],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
      },
      max_memory_restart: '4G',
      env: {
        ENV: 'online',
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=30720',
        CACHE_IPS: '108.59.1.105,108.59.1.107',
        CACHE_HOSTNAME: 'page_cache',
      },
    },
  ],
}
