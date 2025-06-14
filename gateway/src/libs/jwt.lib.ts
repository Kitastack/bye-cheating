import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from './error.lib'
import { verify } from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { join } from 'path'

const publicKey = readFileSync(join(__dirname, '../keys/public.pem'), 'utf8')

export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    verify(token, publicKey, { algorithms: ['RS256'] }, (err, userPayload) => {
      const user = userPayload as any
      if (err) {
        throw new ForbiddenError('please signin first')
      }
      req.headers['x-auth-user'] = Buffer.from(JSON.stringify(user)).toString(
        'base64'
      )
    })
  }
  next()
}
