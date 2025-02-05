/**
 * @description 根据host获取当前语言
 * @param host
 * @returns {string}
 */
export const useLocale = (host?: string) => {
  let locale = 'en'
  if (!host) {
    return locale as 'en' | 'ja' | 'de' | 'zh' | 'fr'
  }

  if (host.includes('de') || host.includes(useAppConfig().web_domain.de)) {
    locale = 'de'
  } else if (host.includes('fr')) {
    locale = 'fr'
  } else if (host.includes('ja') || host.includes(useAppConfig().web_domain.ja)) {
    locale = 'ja'
  } else if (host.includes('zh')) {
    locale = 'zh'
  }
  return locale as 'en' | 'ja' | 'de' | 'zh' | 'fr'
}
