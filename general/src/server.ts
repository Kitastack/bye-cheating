import './config'
import './config.redis'
import './config.logging'
import './config.database'
import http from 'http'
import express from 'express'
import helmet from 'helmet'
import { liveRouter } from '@routes/live.route'
import { userRouter } from '@routes/user.route'
import type { Request, Response } from 'express'
import { reportRouter } from '@routes/report.route'
import { streamRouter } from '@routes/stream.route'
import { corsHandler } from '@middlewares/header.middleware'
import { loggingHandler } from '@middlewares/logging.middleware'
import { pagination } from '@middlewares/pagination.middleware'
import { errorHandler, notFoundHandler } from '@middlewares/page.middleware'
import { notification } from '@xprisma/index'
import { authenticateToken } from './libs/jwt.lib'
import { verify } from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { join } from 'path'

type notificationSubscribersType = [Request, Response][]
var notificationSubscribers: notificationSubscribersType = []
var publishNotification = (data: notification) => {
  notificationSubscribers.forEach((notificationSubscriber) => {
    const [req, res] = notificationSubscriber
    if (!req.user) return
    if (req.user.id != data.userId) return
    delete (data as any)?.user
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}
declare global {
  var publishNotification: (data: notification) => void
  var notificationSubscribers: notificationSubscribersType
}
globalThis.notificationSubscribers = notificationSubscribers
globalThis.publishNotification = publishNotification

const publicKey = readFileSync(join(__dirname, './keys/public.pem'), 'utf8')

export const Application = express()
logging.log('Logging & configuration')
Application.use(corsHandler)
Application.use(express.urlencoded({ extended: true }))
Application.use(express.json())
Application.use(pagination(10))
Application.use(loggingHandler)
Application.use(
  helmet({
    hidePoweredBy: true
  })
)
logging.divider()
logging.log('Check database connection')
testDBConnection()
testRedisConnection()
logging.divider()
logging.log('Loading routes')
Application.use('/user', userRouter)
Application.use('/stream', streamRouter)
Application.use('/live', liveRouter)
Application.use('/report', reportRouter)
Application.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'pong',
    success: true
  })
})
Application.get('/subscribe-notification', (req: Request, res: Response) => {
  try {
    const token = req.query.token as string
    if (!token) throw new Error()
    verify(token, publicKey, { algorithms: ['RS256'] }, (err, payload) => {
      if (err) {
        throw new Error()
      }
      req.user = payload as any
    })
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders() // need flush headers for establishment SSE with client
    res.write(`: connected\n\n`)
    notificationSubscribers.push([req, res])
    req.on('close', () => {
      notificationSubscribers = notificationSubscribers.filter(
        (notificationSubscriber) => notificationSubscriber[0] !== req
      )
    })
  } catch (error) {
    res.write(`event: error\n`)
    res.write(
      `data: ${JSON.stringify({ success: false, message: "You're not authenticated!" })}\n\n`
    )
  }
})
Application.use(notFoundHandler)
Application.use(errorHandler)
logging.divider()
const HttpServer: ReturnType<typeof http.createServer> =
  http.createServer(Application)
HttpServer.listen(PORT, () => {
  logging.log(`Server started on port ${PORT}`)
  logging.divider()
})

export const ShutdownServer = (callback: any) =>
  HttpServer && HttpServer.close(callback)
