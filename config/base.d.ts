export interface WebPushConfig {
enabled: boolean
appId: string
publicKey: string
}

export interface Config {
locales: string[]
web_domain: {
    en: string
    de: string
    ja: string
    fr: string
    zh: string
}
cdn_domain: string
cdn_domain_subs: string[]
ga_ids: {
    en: string
    de: string
    ja: string
    fr: string
    zh: string
}
web_push: {
    en: WebPushConfig
    de: WebPushConfig
    ja: WebPushConfig
    fr: WebPushConfig
    zh: WebPushConfig
}
servo_report_tbl: {
    de: string
    en: string
    ja: string
    fr: string
    zh: string
}
diversion_domain_list: string[]
site_key: string

client_id: string

page_suffix: string
}