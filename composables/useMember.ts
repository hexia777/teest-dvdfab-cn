export const useMember = () => {
  //   const state = reactive<{
  //     codeSrc: string
  //   }>({
  //     codeSrc: '',
  //   })

  //   const checkLogin = (res: any) => {
  //     if (res?.cscode === 10010 || res?.cscode === 85641) {
  //       nextTick(() => {
  //         clearLoginCookie()
  //         window.location.href = '/member.htm?a=login'
  //       })
  //     }
  //     return true
  //   }

  // const getLicenseInfo = async () => {
  //   refreshCookie('token')
  //   const { data: res } = await useApi().apiAuthSubscription.subscribeList(useRuntimeConfig().public.API_PHP)
  //   useCookie('isSubUser', { maxAge: 60 * 60 * 24 * 7 }).value = !!(
  //     res.value?.cscode === 0 && res.value?.data?.order_list?.length
  //   ) as any
  // }

  // const validCode = (formData: any, value: string) => {
  //   formData.recaptcha = value
  // }

  // const recaptchaExpired = (vueRecaptchaRef: any) => {
  //   vueRecaptchaRef.reset()
  // }

  // 设置登录信息的cookie
  const setLoginCookie = (res: any) => {
    const user_info = {
      vip: parseInt(res.vip) ? parseInt(res.vip) : 0,
      username: encodeURI(res.username),
      email: res.email,
      uid: res.uid,
      is_all_in_one_user: res.is_all_in_one_user,
      dvdfab_subscribe: res.dvdfab_subscribe,
    }
    clientSetCookie('user_info_new', JSON.stringify(user_info), 1)
    clientSetCookie('laravel_session', res.token, 1)
    clientSetCookie('username', encodeURI(res.username), 1)
    clientSetCookie('vip', res.vip, 1)
    clientSetCookie('email', res.email, 1)
    clientSetCookie('elk_user_email', res.email, 1)
    clientSetCookie('uid', res.uid, 1)
    clientSetCookie('is_all_in_one_user', res.is_all_in_one_user, 1)
    clientSetCookie('dvdfab_subscribe', res.dvdfab_subscribe, 1)
    // const maxAge = 60 * 60 * 24 * 1000
    // useCookie('user_info_new', { maxAge }).value = JSON.stringify(user_info)
    // useCookie('laravel_session', { maxAge }).value = res.token
    // useCookie('username', { maxAge }).value = encodeURI(res.username)
    // useCookie('vip', { maxAge }).value = res.vip
    // useCookie('email', { maxAge }).value = res.email
    // useCookie('elk_user_email', { maxAge }).value = res.email
    // useCookie('uid', { maxAge }).value = res.uid
    // useCookie('is_all_in_one_user', { maxAge }).value = res.is_all_in_one_user
    // useCookie('dvdfab_subscribe', { maxAge }).value = res.dvdfab_subscribe
    useStore.common().setUserInfo({
      ...user_info,
      username: decodeURIComponent(user_info.username).trim(),
      token: res.token,
      isInit: false,
    })
  }

  // 清除登录信息的cookie
  const clearLoginCookie = () => {
    const keys = [
      'laravel_session',
      'recommend_dvdfab',
      'user_info_new',
      'username',
      'uid',
      'vip',
      'email',
      'is_all_in_one_user',
    ]
    keys.forEach((key) => {
      clientSetCookie(key, '', -1)
      // useCookie(key).value = null
    })
  }

  // const refreshCodeImg = async () => {
  //   state.codeSrc = ''
  //   await nextTick()
  //   state.codeSrc =
  //     useRuntimeConfig().public.API_PHP +
  //     '/seccode?laravel_session=' +
  //     useCookie('laravel_session').value +
  //     '&t=' +
  //     new Date() * 1
  // }

  return {
    // ...toRefs(state),
    // checkLogin,
    // getLicenseInfo,
    // validCode,
    // recaptchaExpired,
    setLoginCookie,
    clearLoginCookie,
    // refreshCodeImg,
  }
}
