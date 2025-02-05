export {}

declare module '*.jpg'
declare module '*.png'
declare module '*.webp'
declare module 'access-log'
declare module '@elk/analytics'
declare module 'vue3-recaptcha2'
declare global {
  interface Window {
    paypal: any
    Airwallex: any
    Stripe: any
    Quill: any
    __lc: any
    lc: any
    s: any
  }
}