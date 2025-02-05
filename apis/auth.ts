import type {
  LoginParams,
  LoginResultModel,
  RegisterParams,
  RegisterResultModel,
  ForgotPasswordParams,
  ForgotPasswordResultModel,
  ResetPasswordParams,
  CheckParams,
  CheckResultModel,
  RegisterConfirmParams,
  RegisterConfirmResultModel,
  ForgotPasswordCheckParams,
  ForgotPasswordCheckResultModel,
  ResetPasswordResultModel,
  ChangePasswordParams,
  ChangePasswordResultModel,
  AutoLoginParams,
  useInfoParams,
  useInfoResultModel,
  AdminLoginParams,
  AdminLoginResultModel,
} from './interface/auth'
import Http from '~/utils/request'
import type { HttpOption } from '~/utils/request'

enum Api {
  login = '/member/do_login',
  register = '/member/register/per',
  forgotPassword = '/member/reset_pw/per',
  check = '/member/register/check',
  registerConfirm = '/member/register/complete',
  resetPasswordCheck = '/member/reset_pw/check',
  resetPasswordConfirm = '/member/reset_pw/complete',
  changePassword = '/member/change_password',
  autoLogin = '/member/auth_token',
  info = '/member/info',
  adminLogin = '/member/admin',
}

export default new (class auth extends Http {
  /**
   * 登录
   * @param host
   * @param params
   * @param option
   */
  public login(host: string, params: LoginParams, option?: HttpOption<LoginResultModel>) {
    return this.post<LoginResultModel>(host + Api.login, params, option)
  }

  /**
   * 自动登录
   * @param host
   * @param params
   * @param option
   */
  public autoLogin(host: string, params: AutoLoginParams, option?: HttpOption<LoginResultModel>) {
    return this.post<LoginResultModel>(host + Api.autoLogin, params, option)
  }

  /**
   * 获取用户信息
   * @param host
   * @param params
   * @param option
   */
  public info(host: string, params: useInfoParams, option?: HttpOption<useInfoResultModel>) {
    return this.post<useInfoResultModel>(host + Api.info, params, option)
  }

  /**
   * 注册
   * @param host
   * @param params
   * @param option
   */
  public register(host: string, params: RegisterParams, option?: HttpOption<RegisterResultModel>) {
    return this.post<RegisterResultModel>(host + Api.register, params, option)
  }

  /**
   * 忘记密码
   * @param host
   * @param params
   * @param option
   */
  public forgotPassword(
    host: string,
    params: ForgotPasswordParams,
    option?: HttpOption<ForgotPasswordResultModel>,
  ) {
    return this.post<ForgotPasswordResultModel>(host + Api.forgotPassword, params, option)
  }

  /**
   * 检查
   * @param host
   * @param params
   * @param option
   */
  public check(host: string, params: CheckParams, option?: HttpOption<CheckResultModel>) {
    return this.post<CheckResultModel>(host + Api.check, params, option)
  }

  /**
   * 注册确认
   * @param host
   * @param params
   * @param option
   */
  public registerConfirm(
    host: string,
    params: RegisterConfirmParams,
    option?: HttpOption<RegisterConfirmResultModel>,
  ) {
    return this.post<RegisterConfirmResultModel>(host + Api.registerConfirm, params, option)
  }

  /**
   * 重置密码检查
   * @param host
   * @param params
   * @param option
   */
  public resetPasswordCheck(
    host: string,
    params: ForgotPasswordCheckParams,
    option?: HttpOption<ForgotPasswordCheckResultModel>,
  ) {
    return this.post<ForgotPasswordCheckResultModel>(host + Api.resetPasswordCheck, params, option)
  }

  /**
   * 重置密码确认
   * @param host
   * @param params
   * @param option
   */
  public resetPasswordConfirm(
    host: string,
    params: ResetPasswordParams,
    option?: HttpOption<ResetPasswordResultModel>,
  ) {
    return this.post<ResetPasswordResultModel>(host + Api.resetPasswordConfirm, params, option)
  }

  /**
   * 修改密码
   * @param host
   * @param params
   * @param option
   */
  public changePassword(
    host: string,
    params: ChangePasswordParams,
    option?: HttpOption<ChangePasswordResultModel>,
  ) {
    return this.post<ChangePasswordResultModel>(host + Api.changePassword, params, option)
  }

  /**
   * 管理员登录
   * @param host
   * @param params
   * @param option
   */
  public adminLogin(host: string, params: AdminLoginParams, option?: HttpOption<AdminLoginResultModel>) {
    return this.post<AdminLoginResultModel>(host + Api.adminLogin, params, option)
  }
})()
