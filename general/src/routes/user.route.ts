import {
  signin,
  signup,
  userUpdate,
  getForLoggedUser,
  userUpdateForAdmin,
  getUserListForAdmin,
  getNotification,
  getAudit,
  createNotification,
  createAccessToken
} from '@controllers/user.controller'
import { authenticateToken } from '@libs/jwt.lib'
import express from 'express'

const userRouter = express.Router()
userRouter.patch('/update', authenticateToken(['Admin']), userUpdateForAdmin)
userRouter.get('/list', authenticateToken(['Admin']), getUserListForAdmin)
userRouter.post('/notification', authenticateToken(), createNotification)
userRouter.get('/notification', authenticateToken(), getNotification)
userRouter.get('/', authenticateToken(), getForLoggedUser)
userRouter.get('/audit', authenticateToken(), getAudit)
userRouter.patch('/', authenticateToken(), userUpdate)
userRouter.post('/token', createAccessToken)
userRouter.post('/signin', signin)
userRouter.post('/signup', signup)

export { userRouter }
