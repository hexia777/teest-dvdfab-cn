// uno.config.ts
import { defineConfig, presetUno, presetAttributify, transformerDirectives } from 'unocss'

export default defineConfig({
  postprocess: (util: { [key: string]: any }) => {
    // Set default units to px instead rem
    util.entries.forEach((i: any[]) => {
      const value = i[1]
      // 1rem !important 或者 1rem
      if (
        (value && typeof value === 'string' && /^-?[.\d]+rem$/.test(value)) ||
        /^-?[.\d]+rem !important$/.test(value)
      ) {
        if (value.includes('!important')) {
          const temp = value.replace(' !important', '')
          i[1] = `${(+temp.slice(0, -3) / 16) * 4}rem !important`
        } else {
          i[1] = `${(+value.slice(0, -3) / 16) * 4}rem`
        }
      }
    })
  },
  presets: [presetUno(), presetAttributify()],
  blocklist: ['container'],
  transformers: [transformerDirectives()],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-center-col': 'flex justify-center items-center flex-col',
    },
    {
      'margin-0-auto': 'm-t-0 m-b-0 m-x-auto',
    },
  ],
  // 你的其他配置
  rules: [
    // 自定义规则
    [
      'text-ellipsis-2-lines',
      {
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
      },
    ],
    // 背景透明
    [
      /^bg-primary-(\d+\.\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(0, 169, 240, ${opacity})`, // primary
      }),
    ],
    [
      /^bg-secondary-(\d+\.\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(255, 144, 0, ${opacity})`, // secondary
      }),
    ],
    [
      /^bg-white-(\d+\.\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(255, 255, 255, ${opacity})`, // white
      }),
    ],
    [
      /^bg-black-(\d+\.\d+)$/,
      ([, opacity]) => ({
        'background-color': `rgba(0, 0, 0, ${opacity})`, // black
      }),
    ],
    // 颜色透明度
    [
      /^primary-(\d+\.\d+)$/,
      ([, opacity]) => ({
        color: `rgba(0, 169, 240, ${opacity})`, // primary
      }),
    ],
    [
      /^secondary-(\d+\.\d+)$/,
      ([, opacity]) => ({
        color: `rgba(255, 144, 0, ${opacity})`, // secondary
      }),
    ],
    [
      /^white-(\d+\.\d+)$/,
      ([, opacity]) => ({
        color: `rgba(255, 255, 255, ${opacity})`, // white
      }),
    ],
    [
      /^black-(\d+\.\d+)$/,
      ([, opacity]) => ({
        color: `rgba(0, 0, 0, ${opacity})`, // black
      }),
    ],
    // lineheight
    [
      /^lineheight-(\d+\.\d+)$/,
      ([, lineheight]) => ({
        'line-height': lineheight,
      }),
    ],
  ],
})
