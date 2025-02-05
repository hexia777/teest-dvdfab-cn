'use strict'
function Index(e) {
  ;(this.config = e || {}),
    (this.serverAPIBaseURL = e.serverURL || 'https://aiportrait.online'),
    (this.isSubscribed = !1),
    (this.endPoint = ''),
    (this.swRegistration = null),
    (this.delay = e.delay || 7e3),
    (this.swPath = e.sw_path || 'sw.js'),
    (this.guestKey = 'guest_user'),
    (this.openGuest = !0),
    (this.reportUser = !0),
    (this.isDebug = !0),
    (this.getExplorer = function () {
      const n = navigator.userAgent.toLowerCase()
      let s = '',
        r = '',
        e = ''
      if (0 < n.indexOf('msie')) {
        ;(s = 'IE'), (r = '' + n.match(/msie [\d.]+;/gi))
      } else if (0 < n.indexOf('edge')) {
        ;(s = 'Edge'), (r = '' + n.match(/edge\/[\d.]+/gi))
      } else if (0 < n.indexOf('firefox')) {
        ;(s = 'Firefox'), (r = '' + n.match(/firefox\/[\d.]+/gi))
      } else if (0 < n.indexOf('chrome')) {
        ;(s = 'Chrome'), (r = '' + n.match(/chrome\/[\d.]+/gi))
      } else if (0 < n.indexOf('safari') && n.indexOf('chrome') < 0) {
        ;(s = 'Safari'), (r = '' + n.match(/version\/[\d.]+/gi))
      } else if (0 <= n.indexOf('opera')) {
        ;(s = 'Opera'), (r = '' + n.match(/version\/[\d.]+/gi))
      } else if ('Netscape' === navigator.appName) {
        const e = n.split(';'),
          t = e[7].replace(/[ ]/g, ''),
          i = t.match(/[\d\.]/g).toString()
        ;(r = i.replace(/[,]/g, '')), (s = 'IE')
      }
      e = (r + '').replace(/[^0-9.]/gi, '')
      const t = {}
      return (t.explorer = s), (t.version = e.split('.')[0]), t
    }),
    (this.getNowFormatDate = function () {
      let e = 'yyyy-MM-dd HH:mm:ss',
        t = new Date()
      let i,
        n = {
          'M+': t.getMonth() + 1,
          'd+': t.getDate(),
          'H+': t.getHours(),
          'm+': t.getMinutes(),
          's+': t.getSeconds(),
          'q+': Math.floor((t.getMonth() + 3) / 3),
          S: t.getMilliseconds(),
        }
      for (i in (/(y+)/.test(e) &&
        (e = e.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))),
      n)) {
        new RegExp('(' + i + ')').test(e) &&
          (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? n[i] : ('00' + n[i]).substr(('' + n[i]).length)))
      }
      return e
    }),
    (this.getClientTimezone = function () {
      const e = new Date(),
        t = 60 * -e.getTimezoneOffset()
      return t.toFixed(2)
    }),
    (this.getDeviceOs = function () {
      return navigator.platform || 'other'
    }),
    (this.setCookie = function (t, i, e) {
      let n = e || !1
      try {
        n ? (n *= 1e3) : (n = 2592e6)
        const e = new Date()
        e.setTime(e.getTime() + n), (document.cookie = t + '=' + escape(i) + ';expires=' + e.toGMTString())
      } catch (e) {
        return !1
      }
    }),
    (this.getCookie = function (e, t) {
      t = t || !1
      try {
        let i,
          n = new RegExp('(^| )' + e + '=([^;]*)(;|$)')
        return (i = document.cookie.match(n)) ? unescape(i[2]) : t
      } catch (e) {
        return t
      }
    }),
    (this.getCookieObj = function (e, t) {
      t = t || !1
      try {
        let i,
          n = new RegExp('(^| )' + e + '=([^;]*)(;|$)')
        return (i = document.cookie.match(n)) ? JSON.parse(unescape(i[2])) : t
      } catch (e) {
        return t
      }
    }),
    (this.isPopupDated = function () {
      return 'true' === this.getCookie('is_popup_dated', 'true')
    }),
    (this.setPopupUnDated = function () {
      this.setCookie('is_popup_dated', 'false', 86400)
    }),
    (this.isOnlineUser = function () {
      return 'true' === this.getCookie('is_online_user', 'false')
    }),
    (this.setOnlineUser = function () {
      this.setCookie('is_online_user', 'true', 0)
    }),
    (this.updateGuest = function () {
      const e = {}
      const t = this.getCookieObj(this.guestKey)
      t
        ? ((e.last_active = this.getNowFormatDate()),
          (e.session_count = t.popup_count + 1),
          (e.created_at = t.created_at),
          (e.user_agent = t.user_agent),
          (e.popup_count = t.popup_count + 1))
        : ((e.last_active = this.getNowFormatDate()),
          (e.session_count = 1),
          (e.created_at = this.getNowFormatDate()),
          (e.user_agent = navigator.userAgent),
          (e.popup_count = 1)),
        this.setCookie(this.guestKey, JSON.stringify(e))
    }),
    (this.urlB64ToUint8Array = function (e) {
      e = (e + '='.repeat((4 - (e.length % 4)) % 4)).replace(/\-/g, '+').replace(/_/g, '/')
      const t = window.atob(e),
        i = new Uint8Array(t.length)
      for (let e = 0; e < t.length; ++e) {
        i[e] = t.charCodeAt(e)
      }
      return i
    }),
    (this.updateSubscriptionOnServer = function (e, t) {
      const i = this
      let n
      e &&
        ((i.endPoint = e),
        'sub' === t &&
          ((n = (navigator.language || navigator.browserLanguage).toLowerCase()),
          (e = JSON.parse(JSON.stringify(i.endPoint))),
          i.reportUser &&
            ((e = {
              language: n,
              diff_time: i.getClientTimezone(),
              device_model: i.getDeviceOs(),
              app_id: i.config.app_id,
              endpoint: e.endpoint,
              auth: e.keys.auth,
              pdhkey: e.keys.p256dh,
              explorer: i.getExplorer().explorer,
              explorer_version: i.getExplorer().version,
            }),
            fetch(i.serverAPIBaseURL + '/index.php/sub/register', {
              method: 'POST',
              body: JSON.stringify(e),
              priority: 'low',
              headers: new Headers({ 'Content-Type': 'application/json' }),
            })
              .then(function (e) {
                return e.json()
              })
              .catch(function (e) {
                console.log('Subscribe Failed')
              })
              .then(function (e) {
                200 == e.code
                  ? (console.log('Subscribe Success'), i.setOnlineUser())
                  : console.log('Subscribe failed!')
              }))),
        'unsub' === t && ((i.endPoint = ''), console.log('Subscribe to the Cancelled')))
    }),
    (this.subscribeUser = function () {
      const t = this
      const e = t.urlB64ToUint8Array(t.config.applicationServerPublicKey)
      t.swRegistration.pushManager
        .subscribe({ userVisibleOnly: !0, applicationServerKey: e })
        .then(function (e) {
          t.updateSubscriptionOnServer(e, 'sub'), console.log('User is subscribed!.'), (t.isSubscribed = !0)
        })
        .catch(function (e) {
          console.log('Failed to subscribe the user: ', e)
        })
    }),
    (this.unsubscribeUser = function () {
      const t = this
      t.swRegistration.pushManager
        .getSubscription()
        .then(function (e) {
          if (e) {
            return t.updateSubscriptionOnServer(e, 'unsub'), e.unsubscribe()
          }
        })
        .catch(function (e) {
          console.log('Error unsubscribing', e)
        })
        .then(function () {
          console.log('User is unsubscribed.'), (t.isSubscribed = !1)
        })
    }),
    (this.getSubStatus = function (e, t) {
      const i = this
      setTimeout(function () {
        i.isSubscribed
          ? (document.getElementById(e).innerHTML = 'Subscribed')
          : (document.getElementById(e).innerHTML = 'Unsubscribed')
      }, t || 2e3)
    }),
    (this.getUserPoint = function (e) {
      const t = this
      setTimeout(function () {
        const e = t.endPoint.endpoint
        console.log(e.substring(e.length - 64))
      }, e || 2e3)
    }),
    (this.initializeUI = function () {
      const t = this
      t.swRegistration.pushManager.getSubscription().then(function (e) {
        e && t.updateSubscriptionOnServer(e, ''),
          (t.isSubscribed = !(null === e)),
          t.isSubscribed
            ? console.log('User is subscribed.')
            : (console.log('User is NOT subscribed.'),
              setTimeout(function () {
                t.subscribeUser()
              }, t.config.delay))
      })
    }),
    (this.randomString = function (t) {
      t = t || 32
      const i = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        n = i.length
      let s = ''
      for (let e = 0; e < t; e++) {
        s += i.charAt(Math.floor(Math.random() * n))
      }
      return s
    }),
    (this.init = function () {
      const t = this
      let e
      'serviceWorker' in navigator && 'PushManager' in window
        ? ((e = t.swPath || 'sw.js'),
          navigator.serviceWorker
            .register(e)
            .then(function (e) {
              console.log('Service Worker is registered'),
                (t.swRegistration = e),
                t.swRegistration.update(),
                t.initializeUI()
            })
            .catch(function (e) {
              console.error('Unable to subscribe to push.', e)
            }))
        : console.warn('Push messaging is not supported')
    }),
    this.init()
}
export default Index
