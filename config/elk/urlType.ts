import { routes as paymentRoutes } from '~/config/route/paymentRoutes'
export const urlType = {
  mainpage: ['index'],
  resource: ['resource', 'resource-type', 'resource-type-id', 'cinavia'],
  authors: ['author', 'author-id', 'author-id-page'],
  topic: ['topic', 'topic-id'],
  recorder: ['recorder', 'recorder-id'],
  tips: ['tips', 'tips-id'],
  member: ['member'],
  faq: ['faq', 'faq-search-result', 'faq-id', 'faq-id-url'],
  payment: paymentRoutes,
  article: [
    'technology',
    'multi_angle_movies',
    'bdinfo',
    'videotoolbox',
    'bdfix',
    'pathplayer',
    'lightning_recoding',
    '8k_uhd',
    'awards_and_reviews',
    'exactread',
    'stealthy_clone',
    'about_4k',
    'blupath',
    'h265',
    'nvidia_cuda',
    'intel_quick_sync',
    'miniso',
    '10_bit_conversion_profile',
    'uhdpath',
    '4k_uhd_drives',
    'lightning_shrink',
    'bdshrink',
    'metainfo',
    'amd_app',
  ],
  support: [
    'dvdfab_pad',
    'company',
    'dvdfab_user_license_agreement',
    'links',
    'webmaster',
    'how_to_register',
    'cloud_decryption',
  ],
  privacy: [
    'shipping_policy',
    'terms_of_use',
    'cookies_policy',
    'purchase_policy',
    'legal_disclaimer',
    'privacy',
    'statement',
    'refund_policy',
    'terms_of_license_authorization',
  ],
  softclient: ['opensource'],
}

export const getUrlType = () => {
  for (const key in urlType) {
    if (urlType[key as keyof typeof urlType].includes(useRoute().name as string)) {
      return { url_type: key }
    }
  }
}
