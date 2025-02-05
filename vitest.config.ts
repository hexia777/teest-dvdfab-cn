import AutoImport from 'unplugin-auto-import/vite'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  plugins: [
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      imports: ['vue', 'vue-router', 'pinia', 'vitest'], 
      dirs: ["./composables/", "./utils/"],
    }),
  ],//*/
  test: {
    testTimeout: 60000,
    dir: './tests',
    environment: 'nuxt',    
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
        // rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
        domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
        overrides: {
          // other Nuxt config you want to pass
        }
      }
    },
    // https://gitlab.klima.tu-berlin.de/klima/dp_front/-/blob/image-optimization/vitest.config.ts?ref_type=heads
    coverage: {
      provider: 'v8',
      reporter: "html",
      reportsDirectory: "./coverage",
      exclude: [
        'node_modules',
        '.nuxt',
        'app',
        'dist',
        'scripts',
        '*.config.ts',
        '**/types.ts',
        '**/*.tests.ts',
        '**/*.js',
        '**/*.mjs',
        'pages',
        'plugins',
        'app.vue',
      ],
    },  
  }
})
 