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
      args: `-c '/usr/src/app/nuxt.config.ts'`,
      node_args: '--max-old-space-size=30720',
      instances: 5,
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
        CACHE_HOSTNAME: 'page-cache',
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
        CACHE_HOSTNAME: 'page-cache',
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
        CACHE_IPS: '37.48.80.201,85.17.178.19',
        CACHE_HOSTNAME: 'page-cache',
      },
    },
  ],
}
