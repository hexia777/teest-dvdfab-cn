import config from './config/base'

// 全局的公开配置信息
export default defineAppConfig({
  ...config,
  aioRecommendAdditionalPros: [20023],
  singleRecommendAdditionalPros: [20104, 20023],
  screenRecorderRecommendAdditionalPros: [20122, 20023],
  screen_recorder: {
    relatedPids: [620, 62118],
    recommendedPopupProduct: [{ pid: 62118, system: 'win', contentKey: 'screenRecoderItems' }],
  },
})
