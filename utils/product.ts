import changePidJson from '@/assets/json/product/change_pid.json'
import productBoxJson from '@/assets/json/product/product_box.json'
const changePidCfg = JSON.parse(JSON.stringify(changePidJson))
const productBoxCfg = JSON.parse(JSON.stringify(productBoxJson))

// 全局临时修改产品pid
const changePid = (data: any = { type: '' }): string | number => {
  let pid = data.pid
  // isTypesNoChange包含的type不变化
  if (
    changePidCfg[pid] &&
    changePidCfg[pid].toPid &&
    changePidCfg[pid].isTypesNoChange &&
    !changePidCfg[pid].isTypesNoChange.includes(data.type)
  ) {
    pid = changePidCfg[pid].toPid
  }
  return pid
}
export const getCheckoutUrl = (
  pid: string | number,
  opt = 'LFT',
  link_params = '',
  extended_parameters = { type: '' },
): string => {
  if (!pid) {
    return ''
  }
  if (!extended_parameters) {
    extended_parameters = { type: '' }
  }
  pid = changePid({ pid, type: extended_parameters.type })
  let url = '/checkout.htm?pid=' + pid + '&opt' + pid + '=' + opt
  if (link_params) {
    if (link_params.startsWith('?')) {
      link_params = link_params.replace('?', '&')
    } else if (!link_params.startsWith('&')) {
      link_params = '&' + link_params
    }
    url = url + link_params
  }
  // 非LFT不让使用折扣
  if (opt !== 'LFT' && !url.includes('discount=') && !url.includes('coupon=')) {
    url += '&discounts_prohibited=1'
  }

  // const href = els[i].getAttribute('href')
  return url
}

export const getProImg = (pid: string | number, locale = 'en'): string => {
  if (!pid) {
    return ''
  }
  const _pid = pid + ''
  if (productBoxCfg[_pid]) {
    if (productBoxCfg[_pid][locale]) {
      return productBoxCfg[_pid][locale]
    }
    return productBoxCfg[_pid].en
  }
  return ''
}
