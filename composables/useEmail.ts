/**
 * @function useEmail
 * @description 根据优先级获取用户email, 优先级：query.email > cookie.email > query.client_e
 * @returns {string}
 */
export const useEmail = () => {
  let email = useCookie('email').value || useCookie('elk_user_email').value
  const query = useRoute().query
  if (query.email) {
    email = decodeURIComponent(query.email as string)
  } else if (query.client_e) {
    email = fixBase64DecodeParam(query.client_e as string)
  }
  return email
}
