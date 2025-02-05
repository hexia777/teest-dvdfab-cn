!(function () {
  'use strict'
  let n = 'https://aiportrait.online'
  function s(e, i) {
    i = i || 'Undefined'
    try {
      fetch(n + '/index.php/sub/listen', {
        method: 'POST',
        body: JSON.stringify(e),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
        .then(function (e) {
          return e.json()
        })
        .catch(function (e) {
          console.error(i + ' Error:')
        })
        .then(function (e) {
          e && e.code && 200 == e.code
            ? console.log(i + ' Request Success')
            : console.log(i + ' Request Fail')
        })
    } catch (e) {
      console.log(i + 'Listen Error:', e)
    }
  }
  self.addEventListener('install', function (e) {
    console.log('force update service worker!'), self.skipWaiting()
  }),
    self.addEventListener('push', function (i) {
      const o = JSON.parse(i.data.text())
      if (o && o.message_id && o.title && o.alert) {
        o.sw_api && (n = o.sw_api),
          o.is_debug && console.log('Received Data:', o),
          s({ type: 'received', user_id: o.user_id, message_id: o.message_id, app_id: o.app_id }, 'Received')
        let t = o.title
        const e = {}
        if (
          ((e.data = {
            uid: o.user_id,
            mid: o.message_id,
            aid: o.app_id,
            url: o.custom.u,
            isDebug: o.is_debug,
            actions: o.o,
          }),
          o.alert && (e.body = o.alert),
          o.icon && (e.icon = o.icon),
          o.image && (e.image = o.image),
          o.tag && (e.tag = o.tag),
          o.badge && (e.badge = o.badge),
          o.o)
        ) {
          const i = []
          for (let e = 0; e < o.o.length; e++) {
            o.o[e].i && o.o[e].n && i.push({ action: o.o[e].i, title: o.o[e].n, icon: o.o[e].p })
          }
          i && (e.actions = i)
        }
        o.require_interaction && (e.requireInteraction = !0),
          o.is_debug && console.log('Received Options:', e)
        t = self.registration.showNotification(t, e)
        i.waitUntil(t)
      } else {
        console.log('Parameter validation failed')
      }
    }),
    self.addEventListener('notificationclick', function (e) {
      e.notification.close()
      const i = e.notification.data
      i.isDebug && (console.log('clickEventData:', e), console.log('clickEventDataData:', i)),
        s({ type: 'clicked', user_id: i.uid, message_id: i.mid, app_id: i.aid }, 'Clicked')
      let o = i.url
      try {
        if ((i.isDebug && console.log('Action jumpUrl action:', e.action), e.action && i.actions)) {
          const t = i.actions[e.action].u
          if ((i.isDebug && console.log('Action jumpUrl:', t), t && /^https?:\/\//.test(t))) {
            o = t
          } else if ('close' === t) {
            return i.isDebug && console.log('close Page!  actionUrl:', t), !0
          }
        }
      } catch (e) {
        i.isDebug && console.error('Actions Error:', e)
      }
      i.isDebug && console.log('toPage jumpUrl:', o),
        o && /^https?:\/\//.test(o)
          ? e.waitUntil(self.clients.openWindow(o))
          : i.isDebug && console.error('URL illegal:', o)
    }),
    self.addEventListener('notificationclose', function (e) {
      const i = e.notification.data
      i.isDebug && (console.log('CloseEventData:', e), console.log('CloseEventDataData:', i)),
        s({ type: 'closed', user_id: i.uid, message_id: i.mid, app_id: i.aid }, 'Closed'),
        console.log('Your closed windows pop!')
    })
})()
