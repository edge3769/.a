import * as api from './node_modules/api'
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

if(VAPID_PUBLIC && VAPID_PRIVATE){
  webPush.setVapidDetails(
    'mailto:edge3769@gmail.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
  )
}

const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if(url[0]=='/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

polka({server})
  .use(bodyParser.json())

  .get('/get', (req, res)=>{
    if(!VAPID_PUBLIC || !VAPID_PRIVATE){
      res.sendStatus(500)
    }
    res.end(VAPID_PUBLIC)
  })

  .post('/send', async(req, res)=>{
    console.log('sw')
    let id = req.body.id
    let {subs} = await api.get(`subs/${id}`)
    console.log(subs)
    const options = {
      TTL: 5184000
    }
    for (let sub of subs){
      let json = {id: id}
      let payload = JSON.stringify(json)
      console.log('w')
      webPush.sendNotification(sub, payload, options)
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

  socket.on('room', (obj, callback)=>{
    callback({
      status: 'received'
    })
    socket.to(obj.room).emit('gmsg', obj)
    // console.log('Server got room ', obj.room)
    // let headers = {
    //   'Content-type': 'application/json'
    // }
    // let body = {
    //   id: obj.room,
    //   unseen: obj.unseen
    // }
    // body = JSON.stringify(body)
    // let options = {
    //   method: 'post',
    //   headers: headers,
    //   body: body
    // }
    // await global.fetch('/send', options)
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('left', socket.id)
  })
})