let notifications = 0
let ids = []

self.addEventListener('notificationclick', (ev)=>{
  ev.notification.close()
  ev.waitUntil(
    self.clients.matchAll({type: 'window'})
  ).then((clients)=>{
    for (let client of clients){
      if(client.url == '/' && 'focus' in client){
        return client.focus()
      }
    }
    if(clients.openWindow){
      return clients.openWindow('/rooms')
    }
    notifications = 0
    ids=[]
  })
})

self.addEventListener('push', (ev)=>{
  ev.waitUntil(
    self.clients.matchAll({type: 'window'})
    .then(async(clients)=>{
      let id = ev.data.json().id
      if(!ids.includes(id)) ids.push(id)
      // for (let client of clients){
      //   if(client.focused){
      //     return
      //   }
      // }
      let image = `${self.origin}/x369-512.png`
      let options = {
        badge: image,
        icon: image
      }
      notifications++
      let title = `${notifications} ${(notifications > 1) ? 'New messages':'New message'}` //from ${unseen} rooms`
      self.registration.showNotification(title, options)
    })
  )
})