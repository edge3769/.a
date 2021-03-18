import 'dotenv/config'
import io from 'socket.io';
import sirv from "sirv";
import polka from "polka";
import http from 'http'
import compression from "compression";
import * as sapper from "@sapper/server";
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const webPush = require('web-push')

const FileStore = sessionFileStore(session);
const { PORT, NODE_ENV, VAPID_PUBLIC, VAPID_PRIVATE } = process.env;
const server = http.createServer()

if(process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE){
  webPush.setVapidDetails(
    'mailto:edge3769@gmail.com',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
  )
}

var subscriptions = []

const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if(url[0]=='/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

polka({server})
  .get('/get', (req, res)=>{
    if(!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE){
      console.log('vapid', webPush.generateVAPIDKeys())
      res.sendStatus(500)
    }
    res.send(process.env.VAPID_PUBLIC)
  })

  .post('/send', (req, res)=>{
    let ids = req.body.ids
      receivingSubscriptions = subscriptions.filter(s=>ids.includes(s.id))
    const options = {
      TTL: 5184000
    }
    for (subscription of receivingSubscriptions){
      webPush.sendNotification(subscription, null, options)
    }
  })

  .post('/register', (req, res)=>{
    subscriptions = [...subscriptions, req.body.subscription] 
  })

  .use(
    bodyParser.json(),
    session({
      secret: 'dev',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 2592000000
      },
      store: new FileStore({
        path: `.sessions`
      })
    }),
    compression({ threshold: 0 }),
    sirv("static", { dev: NODE_ENV === "development" }),
    sapper.middleware({
      session: req => ({
          user: req.session.user
        })
    })
  )
  .listen(PORT)

io(server).on('connection', (socket)=>{
  socket.on('join', (id)=>{
    socket.join(id)
  })

  socket.on('user', (obj)=>{
    io(server).to(obj.id).emit('umsg', obj.body)
  })

  socket.on('room', (obj)=>{
    let headers = {
      'Content-type': 'application/json'
    }
    let body = {
      ids: obj.ids,
      payload: payload
    }
    let options = {
      method: 'post',
      headers: headers,
      body: body
    }
    fetch('/send', options)
    socket.to(obj.room).emit('gmsg', obj)
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('left', socket.id)
  })
})