import en from '~/assets/locales/en.json'
import ja from '~/assets/locales/ja.json'
import fr from '~/assets/locales/fr.json'
import de from '~/assets/locales/de.json'
import zh from '~/assets/locales/zh.json'

interface LocaleKeys {
  resource: { [key: string]: string }
  topic: { [key: string]: string }
  article: { [key: string]: string }
  common: { [key: string]: string }
  member: { [key: string]: string }
  changelog: { [key: string]: string }
}

interface Locales {
  en: LocaleKeys
  ja: LocaleKeys
  fr: LocaleKeys
  de: LocaleKeys
  zh: LocaleKeys
}

const locales: Locales = {
  en,
  ja,
  fr,
  de,
  zh,
}

export const useI18n = () => useState('i18n', () => locales[useStore.common().locale] || locales.en)
