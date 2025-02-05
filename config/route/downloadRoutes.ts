const _routes: { [key: string]: { [key: string]: string } } = {
  dvdfab: {
    win: 'download_dvdfab_win',
    mac: 'download_dvdfab_mac',
  },
  streamfab: {
    win: 'download_downloader_win',
    mac: 'download_downloader_mac',
  },
  bookfab: {
    win: 'download_bookfab_win',
  },
  explorerfab: {
    win: 'download_explorerfab_win',
  },
  musicfab: {
    win: 'download_musicfab_win',
    mac: 'download_musicfab_mac',
  },
  passkey: {
    win: 'download_passkey_win',
  },
  photo_enhancer_ai: {
    win: 'download_photo_enhancer_ai',
  },
  playerfab: {
    win: 'download_playerfab_win',
    mac: 'download_player_mac',
  },
  recordfab: {
    win: 'download_recordfab_win',
    mac: 'download_recordfab_mac',
  },
  unifab: {
    win: 'download_unifab_win',
    mac: 'download_unifab_mac',
  },
  video_converter_pro: {
    win: 'download_video_converter_pro',
  },
  video_enhancer_ai: {
    win: 'download_video_enhancer_ai',
  },
  media_recover: {
    win: 'download_dvdfab_win',
  },
  virtual_drive: {
    win: 'download_dvdfab_win',
  },
}
export const routes: string[] = Object.values(_routes).reduce((acc, cur) => {
  return acc.concat(Object.values(cur))
}, [] as string[])
const _pages: { [key: string]: { [key: string]: string } } = {}
for (const key in _routes) {
  _pages[key] = {}
  for (const subKey in _routes[key]) {
    _pages[key][subKey] = `/${_routes[key][subKey].replace(/_/g, '-')}.htm`
  }
}
export const pages: { [key: string]: { [key: string]: string } } = _pages
