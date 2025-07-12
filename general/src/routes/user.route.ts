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
  createAccessToken,
  getAuthentication,
  signupUserForAdmin
} from '@controllers/user.controller'
import { authenticateToken } from '@libs/jwt.lib'
import express from 'express'

const userRouter = express.Router()
userRouter.get(
  '/authentication',
  authenticateToken(['Admin']),
  getAuthentication
)
userRouter.post(
  '/create',
  authenticateToken(['Admin', 'Developer']),
  signupUserForAdmin
)
userRouter.patch(
  '/update',
  authenticateToken(['Admin', 'Developer']),
  userUpdateForAdmin
)
userRouter.get(
  '/list',
  authenticateToken(['Admin', 'Developer']),
  getUserListForAdmin
)
userRouter.post('/notification', authenticateToken(), createNotification)
userRouter.get('/notification', authenticateToken(), getNotification)
userRouter.get('/', authenticateToken(), getForLoggedUser)
userRouter.get('/audit', authenticateToken(), getAudit)
userRouter.patch('/', authenticateToken(), userUpdate)
userRouter.post('/token', createAccessToken)
userRouter.post('/signin', signin)
userRouter.post('/signup', signup)

export { userRouter }
