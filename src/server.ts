import express from 'express'
import bodyParser from 'body-parser'
import { urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/setupDB'
import donateRouter from './resources/donate/donate.router'
import authRouter from './resources/auth/auth.routes'
import http from 'http';
import { Server as SocketIoServer } from 'socket.io';
import GroupRouter from './resources/community/groups/group.routes'
import eventRouter from './resources/events/event.router'
import userRouter from './resources/user/user.routes'
// import { authenticate } from './middlewares/authMiddleware'
// import { addUserToRequest } from './middlewares/userRequest'

export const app = express()

const server = http.createServer(app);
const io = new SocketIoServer(server);

io.on('connection', (socket) => {
  console.log(`A user connected with socket ID: ${socket.id}`);

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
  });
});
app.disable('x-powered-by')

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

app.use(urlencoded({ extended: true, limit: '50mb' }))
app.use(morgan('dev'))
app.use(express.json());
// app.use(authenticate);

app.use('/api/v1/', donateRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/community', GroupRouter )
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/user', userRouter )


export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://${config.host}:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}