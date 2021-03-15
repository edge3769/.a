import io from 'socket.io';
import sirv from "sirv";
import polka from "polka";
import http from 'http'
import compression from "compression";
import * as sapper from "@sapper/server";
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const FileStore = sessionFileStore(session);
const { PORT, NODE_ENV } = process.env;
const server = http.createServer()

polka({server})
  .use(
    bodyParser.json(),
    session({
      secret: 'dev',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 31536000
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
    io.to(obj.socket).emit('umsg', obj.msg)
  })

  socket.on('group', (obj)=>{
    socket.to(obj.group).emit('gmsg', obj)
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('left', socket.id)
  })

})