import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
      includeSource: ['dvdfab_worker.js'], 
      coverage: {
        provider: 'v8',
      },
      reporters: ['html', 'default', ['verbose', { summary: false }]],
      outputFile: {
        'html': './reports/test-output.html',
      }
    },
  })