import * as api from './node_modules/api'

import 'dotenv/config'
import io from 'socket.io';
import sirv from "sirv";
import polka from "polka";
import redirect from "@polka/redirect"
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

function httpsRedirect(req, res, next){
  if(!process.env.NODE_ENV === 'development' && !req.connection.encrypted){
    redirect(res, 301, `https://${req.headers.host}${req.url}`)
  }
  next()
}

if(process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE){
  webPush.setVapidDetails(
    'mailto:edge3769@gmail.com',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
  )
}

const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if(url[0]=='/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

polka({server})
  .use(httpsRedirect, bodyParser.json())
  .get('/get', (req, res)=>{
    if(!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE){
      res.sendStatus(500)
    }
    res.end(process.env.VAPID_PUBLIC)
  })
  .put('/send', async(req, res)=>{
    let id = req.body.id
    let {subs} = await api.get(`subs/${id}`)
    const options = {
      TTL: 5184000
    }
    for (let sub of subs){
      let json = {id: id}
      let payload = JSON.stringify(json)
      try{
        webPush.sendNotification(sub, payload, options)
      } catch (e){
        console.log(e)
      }
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

  socket.on('msg', (obj)=>{
    socket.to(obj.id).emit('msg', obj)
    global.fetch('/send', {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({'id': obj.id})
    })
  })
})