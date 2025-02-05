import type { ProductCommonModel } from '~/apis/interface/product'

export interface PageMemberAttributes {
  userName: string
  createdAt: string
  updatedAt: string
  menuProduct: string
  menuAccount: string
  menuLogout: string
  locale: string
  productTexts: Array<{
    id: number
    key: string
    value: string
  }>
}

export interface PageMemberResultModel {
  id: number
  attributes: PageMemberAttributes
}

export interface PageLoginAttributes {
  signin: string
  signInWithGoogle: string
  email: string
  emailPlaceholder: string
  Password: string
  passwordPlaceholder: string
  captcha: string
  captchaPlaceholder: string
  signinButton: string
  forgetPassword: string
  dontHaveAccount: string
  createAccount: string
  createdAt: string
  updatedAt: string
  locale: string
  signinFailTitle: string
  signinFailDescription: string
}

export interface PageLoginResultModel {
  id: number
  attributes: PageLoginAttributes
}

// 忘记密码确认
export interface PageForgetPasswordAttributes {
  resetPasswordTitle: string
  resetPasswordDescrption: string
  firstPassword: string
  firstPasswordPlaceholder: string
  secondPassword: string
  secondPasswordPlaceholder: string
  captcha: string
  captchaPlaceholder: string
  button: string
  resetSuccessTitle: string
  resetSuccessJumpBefore: string
  resetSuccessJumpAfter: string
  resetFailTitle: string
  resetFailDescription: string
  createdAt: string
  updatedAt: string
  locale: string
}

export interface PageForgetPasswordResultModel {
  id: number
  attributes: PageForgetPasswordAttributes
}

// 忘记密码邮件
export interface PageForgetPasswordEmailAttributes {
  title: string
  description: string
  email: string
  emailPlaceholder: string
  captcha: string
  button: string
  createdAt: string
  updatedAt: string
  locale: string
  confireEmail: string
  proceed: string
  cancel: string
  verifiedFailTitle: string
  verifiedFailDescription: string
  verifiedSuccessDescription: string
  verifiedSuccessTitle: string
}

export interface PageForgetPasswordEmailResultModel {
  id: number
  attributes: PageForgetPasswordEmailAttributes
}

// 注册输入邮箱的内容
export interface RegisterEmailAttributes {
  title: string
  description: string
  email: string
  emailPlaceholder: string
  captcha: string
  captchaPlaceholder: string
  registerButton: string
  verificationSuccessTitle: string
  verificationSuccessDescription: string
  verificationFailTitle: string
  accountExist: string
  registrationSuccessTitle: string
  registrationSuccessDescription: string
  registrationSuccessJumpTextBefore: string
  registrationSuccessJumpTextAfter: string
  alreadyHaveAccout: string
  logInImmediately: string
}
export interface RegisterEmailResultModel {
  id: number
  attributes: RegisterEmailAttributes
}

// 注册确认输入密码的内容
export interface RegisterPasswordConfirmAttributes {
  title: string
  description: string
  email: string
  emailPlaceholder: string
  lastname: string
  lastnamePlaceholder: string
  firstPassword: string
  firstPasswordPlaceholder: string
  secondPassword: string
  secondPasswordPlaceholder: string
  button: string
  registrationSuccessTitle: string
  registrationSuccessDescription: string
  registrationSuccessJumpBefore: string
  registrationSuccessJumpAfter: string
  registrationFailTitle: string
  registrationFailDescription: string
  passwordDiffer: string
}

export interface RegisterPasswordConfirmResultModel {
  id: number
  attributes: RegisterPasswordConfirmAttributes
}

export interface RecommendProductsParams {
  email: string
  pid: number | string
}

export interface RecommendProductsItem extends ProductCommonModel {
  discountPriceLFT: number
  orderType?: string
}

export interface RecommendProductsResultModel {
  email: string
  lang: string
  orderType: string
  aioBundlePids: number[]
  notBoughtAIOPids: number[]
  userUnifabLFTOptionPids: number[]
  recommondProducts: RecommendProductsItem[]
  completeRate: number
}
