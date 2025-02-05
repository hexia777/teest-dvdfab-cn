import { sentryVitePlugin } from '@sentry/vite-plugin'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import postcsspxtorem from 'postcss-pxtorem'
import config from './config/base'
import { getSentryConfig } from './config/sentry'
import { cdnUrl } from './server/helpers/cdnUrl'
import { pagesExtend } from './server/helpers/pagesExtend'
import postcssMultiCDN from './postcss_multi_cdn'

console.log('VITE_PACK_ENV=', process.env.VITE_PACK_ENV)
console.log('public_api_base=', process.env.VITE_PUBLIC_API_BASE)

const sentry = getSentryConfig(process.env.VITE_PACK_ENV)

export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/all-in-one.htm'],
      ignore: ['/dynamic'],
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: process.env.npm_package_name || '',
      meta: [
        // { name: 'description', content: process.env.npm_package_name || '' },
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${config.cdn_domain}/images/favicon.ico` },
        { rel: 'apple-touch-icon', href: `${config.cdn_domain}/images/apple-touch-icon-180x180.png` },
        { rel: 'stylesheet', href: `${config.cdn_domain}/fonts/cn/iconfont/single.css` },
      ],
    },
    cdnURL: cdnUrl(),
    buildAssetsDir: '/_nuxt3/',
  },
  css: ['@/assets/style/main.less'],

  runtimeConfig: {
    public: {
      ENV: process.env.VITE_PACK_ENV,
      API_BASE: process.env.VITE_PUBLIC_API_BASE,
      API_PHP: process.env.VITE_PUBLIC_API_PHP,
      API_OAPI: process.env.VITE_PUBLIC_API_OAPI,
      API_OM: process.env.VITE_PUBLIC_API_OM,
      API_PREFIX: process.env.VITE_PUBLIC_API_PREFIX,
      API_TICKET: process.env.VITE_PUBLIC_API_TICKET,
      API_G_OAUTH: process.env.VITE_PUBLIC_API_G_OAUTH,
      API_RISK: process.env.VITE_PUBLIC_API_RISK,
    },
  },
  modules: ['@pinia/nuxt', '@nuxt/image', '@element-plus/nuxt', '@unocss/nuxt', '@nuxt/test-utils/module'],

  hooks: {
    'pages:extend': pagesExtend,
  },

  build: {
    transpile: ['element-plus'],
  },

  sourcemap: {
    server: true,
    client: sentry.sourceMap,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const idMappings = {
              '@sentry': 'sentrys',
              '@elk': 'elk',
              '@vue': 'vue',
              'vue-router': 'vue-router',
              'vue-social-sharing': 'vue-social-sharing',
            }
            for (const [key, value] of Object.entries(idMappings)) {
              if (id.includes(key)) {
                return value
              }
            }
          },
        },
      },
    },
    esbuild: {
      // 'console',
      drop: process.env.NODE_ENV !== 'development' ? ['debugger', 'console'] : [],
      charset: 'ascii',
    },
    worker: {
      format: 'es', // 使用 ES modules
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "@/assets/style/variables.less";`, // 全局引入变量
        },
        scss: {
          additionalData: `@use "@/assets/style/element/index.scss" as element;`,
        },
      },
      postcss: {
        plugins: [
          postcssMultiCDN({
            domains: config.cdn_domain_subs,
            debug: process.env.NODE_ENV === 'development',
            imgDir: 'images',
          }),
          postcsspxtorem({
            rootValue() {
              // 获取当前视口宽度
              const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 640
              // 如果视口宽度小于768px，使用14作为基准值，否则使用16
              return viewportWidth < 640 ? 14 : 16
            }, // 基准尺寸
            propList: ['*'], // 需要转换的属性
            selectorBlackList: [], //
            replace: true, // 转换成rem以后是否保留原来的px单位属性
            mediaQuery: true, // 是否允许在媒体查询中转换px
            minPixelValue: 0, // 要替换的最小像素值
            exclude: /node_modules/i, // 排除的文件
          }),
        ].filter(Boolean),
      },
    },
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true, // 自动生成 TypeScript 声明文件
      }),
      sentry.sourceMap &&
        sentryVitePlugin({
          org: sentry.org, // 引入配置的组织
          project: sentry.project, // 引入配置的项目
          authToken: sentry.authToken, // 引入配置的autToken
          url: sentry.url, // 引入配置的url
          release: {
            name: sentry.version, // 引入配置的版本号
            deploy: {
              env: 'production', // 配置的环境
            },
            cleanArtifacts: true,
          },
          sourcemaps: {
            assets: ['./.nuxt/dist/client/**'], // 上传的文件夹
            ignore: ['node_modules'],
          },
          telemetry: false,
          // debug: true,
        }),
    ],
  },

  elementPlus: {
    importStyle: 'scss',
    icon: false,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  typescript: {
    shim: false,
    typeCheck: false,
  },

  compatibilityDate: '2024-08-14',
})
