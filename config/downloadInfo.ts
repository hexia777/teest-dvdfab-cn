export const macDownloadDlgInfo: { [key: string]: any } = {
  dvdfab12: {
    keyword: 'DVDFab',
    logo: '/images/common/1x_m/dvdfab12_logo.png',
    mac_with_intel_chip: 'https://www.dvdfab.cn/mlink/download.php?g=DVDFab12_for_Mac',
    mac_with_apple_chip: 'https://www.dvdfab.cn/mlink/download.php?g=DVDFab12_for_M1',
  },
  dvdfab: {
    keyword: 'DVDFab',
    logo: '/images/common/1x_m/dvdfab_logo.png',
    mac_with_intel_chip: 'https://www.dvdfab.cn/mlink/download.php?g=DVDFab_for_Mac',
    mac_with_apple_chip: 'https://www.dvdfab.cn/mlink/download.php?g=DVDFab_for_Apple_Chip',
  },
}

// app id : dvdfab 12 转为 dvdfab
export const changeAppId: { [key: string]: string } = {
  dvdfab12: 'dvdfab',
  player: 'playerfab',
}
