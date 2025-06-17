import {
  createStream,
  deleteStream,
  getStream,
  updateStream
} from '@controllers/stream.controller'
import { authenticateToken } from '@libs/jwt.lib'
import express from 'express'

const streamRouter = express.Router()

streamRouter.get('/', authenticateToken(), getStream)
streamRouter.post('/', authenticateToken(), createStream)
streamRouter.patch('/', authenticateToken(), updateStream)
streamRouter.delete('/:id', authenticateToken(), deleteStream)

export { streamRouter }
