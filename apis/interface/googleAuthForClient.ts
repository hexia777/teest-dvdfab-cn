import type { Image } from '~/apis/interface/image'

export interface GoogleAuthForClientPageResultModelAttr {
  successTipTitle: string
  successTipDesc: string
  successTipLink: string
  backgroundImage: Image
  successIcon: Image
}

export interface GoogleAuthForClientPageResultModel {
  id: number
  attributes: GoogleAuthForClientPageResultModelAttr
}

export interface GoogleOauthParams {
  code: string
  state: string
  redirect_uri: string
  test_mode?: number
}

export interface GoogleOauthResultModel {
  email: string
  web_session: string
  client_token: string
  hash_code: string
}
