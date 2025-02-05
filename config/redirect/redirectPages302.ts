// 以下模块仅限某个语种访问
export const redirectPage302: { [key: string]: any } = {}

/* Player6=>31        https://www.dvdfab.cn/media-player-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history
  PhotoEnhancerAI=>90   https://www.dvdfab.cn/photo-enhancer-ai-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history
  MediaRecover=>91          https://www.dvdfab.cn/media-recover-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history
  dvdfab downloader =>48    https://www.dvdfab.cn/downloader-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history
  dvdfab toolkit =>202     https://www.dvdfab.cn/toolkit-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history
  PassKey=>20    https://www.dvdfab.cn/passkey-new.htm?soft=dvdfab12_client&ad=dvdfab12_client_history */
export const news_pages: { [key: string]: string } = {
  '20': '/passkey-new.htm',
  '31': '/media-player-new.htm',
  '48': '/downloader-new.htm',
  '49': '/downloader-new.htm',
  '57': '/dvd-fab-new.htm',
  '58': '/dvd-fab-new.htm',
  '90': '/photo-enhancer-ai-new.htm',
  '91': '/media-recover-new.htm',
  '92': '/video-enhancer-ai-new.htm',
  '202': '/toolkit-new.htm',
  '203': '/virtual-drive-new.htm',
  '204': '/virtual-drive-new.htm',
  '98': '/unifab-new.htm',
  '99': '/unifab-new.htm',
}
/***
 * http://dvdfab.cn/unknow-version.htm?client_id=58&soft=dvdfab12&ad=dvdfab12_client_unknow_version
 */
export const unknow_pages: { [key: string]: string } = {
  '57': '/all-in-one.htm',
  '58': '/all-in-one.htm',
  '56': '/all-in-one.htm',
  '203': '/virtual-drive.htm',
  '204': '/virtual-drive.htm',
  '48': '/downloader.htm',
  '49': '/downloader.htm',
  '50': '/downloader.htm',
  '202': '/toolkit.htm',
  '31': '/playerfab.htm',
  '98': '/unifab.htm',
  '99': '/unifab.htm',
}
// 以下pid为302跳转的pid，不在此列表中的pid不做302跳转
export const checkout_pids_302: { [key: string]: string } = {
  '970': '/stream-player.htm',
  '978': '/stream-player.htm',
  '979': '/stream-player.htm',
  '980': '/stream-player.htm',
  '981': '/stream-player.htm',
  '982': '/stream-player.htm',
  '985': '/stream-player.htm',
  '986': '/stream-player.htm',
  '987': '/stream-player.htm',
  '988': '/stream-player.htm',
  '989': '/stream-player.htm',
  '991': '/stream-player.htm',
  '993': '/stream-player.htm',
  '994': '/stream-player.htm',
  '996': '/stream-player.htm',
  '998': '/stream-player.htm',
}

// 兄弟站点
export const web_domain: string[] = [
  'streamfab.com',
  'streamfab.us',
  'streamfab.tv',
  'streamfab.de',
  'streamfab.jp',
  'streamfab.fr',
  'streamfab.tw',
  'dvdfab.us',
  'ja.dvdfab.us',
  'ja.dvdfab.cn',
]
