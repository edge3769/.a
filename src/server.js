import * as api from 'api'
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

let subs = []

const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if(url[0]=='/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

polka({server})
  .use(bodyParser.json())
  .post('/register', (req, res)=>{
    let sub = req.body.sub
    //console.log('id', sub.id)
    if(!subs.includes(sub)){
      subs.push(sub)
    }
  })
  .get('/get', (req, res)=>{
    if(!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE){
      res.sendStatus(500)
    }
    res.end(process.env.VAPID_PUBLIC)
  })
  .post('/send', (req, res)=>{
    //console.log('send')
    let unseen = req.body.unseen
    let ids = req.body.ids
    //console.log('i', ids)
      let receivingSubs = subs.filter(s=>ids.includes(s.id))
      //console.log('r', receivingSubs)
    const options = {
      TTL: 5184000
    }
    for (let sub of receivingSubs){
      let json = {unseen: unseen}
      let payload = JSON.stringify(json)
      webPush.sendNotification(sub.subscription, payload, options)
    }
  })
  .use(
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
      unseen: obj.unseen
    }
    body = JSON.stringify(body)
    let options = {
      method: 'post',
      headers: headers,
      body: body
    }
    global.fetch('/send', options)
    socket.to(obj.room).emit('gmsg', obj)
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('left', socket.id)
  })
})