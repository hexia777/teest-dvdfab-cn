import type { BaseResultModel } from './phpApiBase'

export interface LoginParams {
  email: string
  pw: string
  recaptcha: string
}

export interface LoginResultModel {
  status: boolean
  token: string
  username: string
  vip: string
  email: string
  uid: string
  is_all_in_one_user: boolean
  dvdfab_subscribe: string | null
}

export interface AutoLoginParams {
  email: string
  token: string
  lang: string
  laravel_session: string
}

export interface useInfoParams {
  email: string
  laravel_session: string
}

export interface useInfoResultModel extends LoginResultModel {}

export interface RegisterParams {
  email: string
  recaptcha: string
  login_url: string
  check_url: string
}

export interface RegisterResultModel {
  status: boolean
  to: string
}

export interface ResetPasswordParams {
  hash: string
  new_pw: string
  re_pw: string
  email: string
  login_url: string
  check_url: string
}

export interface ResetPasswordResultModel extends LoginResultModel {}

export interface ForgotPasswordParams extends RegisterParams {}

export interface ForgotPasswordResultModel extends BaseResultModel {}

export interface ForgotPasswordCheckParams {
  hash: string
  email: string
}

export interface ForgotPasswordCheckResultModel extends BaseResultModel {}

export interface CheckParams {
  hash: string
  email: string
  mail: string
}

export interface CheckResultModel extends BaseResultModel {}

export interface RegisterConfirmParams {
  hash: string
  mail: string
  login_url: string
  name: string
  pw: string
  re_pw: string
  language: string
}

export interface RegisterConfirmResultModel extends BaseResultModel {}

export interface ChangePasswordParams {
  old_pw: string
  new_pw: string
  re_pw: string
  code: string
}

export interface ChangePasswordResultModel extends BaseResultModel {}

export interface AdminLoginParams {
  email: string
  sessionid: string
}

export interface AdminLoginResultModel extends LoginResultModel {}
