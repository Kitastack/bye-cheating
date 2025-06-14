import {
  signin,
  signup,
  userUpdate,
  getForLoggedUser,
  userUpdateForAdmin,
  getUserListForAdmin,
  getNotification,
  getAudit,
  createNotification
} from '@controllers/user.controller'
import { authenticateToken } from '@libs/jwt.lib'
import express from 'express'

const userRouter = express.Router()
userRouter.post('/signin', signin)
userRouter.post('/signup', signup)
userRouter.patch('/', authenticateToken(), userUpdate)
userRouter.get('/', authenticateToken(), getForLoggedUser)
userRouter.get('/list', authenticateToken(['Admin']), getUserListForAdmin)
userRouter.patch('/update', authenticateToken(['Admin']), userUpdateForAdmin)
userRouter.get('/notification', authenticateToken(), getNotification)
userRouter.post('/notification', authenticateToken(), createNotification)
userRouter.get('/audit', authenticateToken(), getAudit)

export { userRouter }
