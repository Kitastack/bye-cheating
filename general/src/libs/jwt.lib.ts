import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError
} from './error.lib'
import jwt from 'jsonwebtoken'
import { sign } from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { user } from '@xprisma/client'
import { Request, Response, NextFunction } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'

const privateKey = readFileSync(join(__dirname, '../keys/private.pem'), 'utf8')

export type extendedUserType = {
  authenticationId?: string
} & user

export type extendedUserTypeRequiredId = {
  authenticationId: string
} & user

export const generateAccessToken = async (
  payload: extendedUserType | user,
  type: string = 'website'
): Promise<[string, extendedUserTypeRequiredId]> => {
  try {
    const authenticationId =
      'authenticationId' in payload ? payload?.authenticationId : randomUUID()
    let existingAuthentication = await database.authentication.findFirst({
      where: {
        id: authenticationId
      },
      include: {
        user: true
      }
    })
    if (!existingAuthentication) {
      existingAuthentication = await database.authentication.create({
        data: {
          description: type,
          id: authenticationId,
          userId: payload.id
        },
        include: {
          user: true
        }
      })
    } else {
      existingAuthentication = await database.authentication.update({
        where: {
          id: authenticationId
        },
        data: {
          updatedDate: new Date()
        },
        include: {
          user: true
        }
      })
    }
    const newPayload = {
      ...existingAuthentication?.user,
      authenticationId
    } as extendedUserTypeRequiredId
    return [
      // sign(newPayload, process.env.ACCESS_TOKEN_SECRET, {
      //   expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
      // }),
      sign(newPayload, privateKey, {
        keyid: 'key-v1',
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any
      }),
      newPayload
    ]
  } catch (error) {
    throw new InternalServerError((error as Error)?.message)
  }
}

export const generateRefreshToken = async (
  authenticationId: string
): Promise<[string, extendedUserTypeRequiredId]> => {
  try {
    const existingAuthentication = await database.authentication.findFirst({
      where: {
        id: authenticationId
      }
    })
    if (!existingAuthentication) {
      throw new Error('unable to find user data')
    }
    const payload = { id: authenticationId } as extendedUserTypeRequiredId
    return [
      // sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      //   expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
      // }),
      sign(payload, privateKey, {
        keyid: 'key-v1',
        algorithm: 'RS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any
      }),
      payload
    ]
  } catch (error) {
    return Promise.reject(error)
  }
}

export const authenticateToken =
  (roles?: role[]) => (req: Request, res: Response, next: NextFunction) => {
    const isFromInternal = req.headers['x-from-internal'] === 'true'
    console.log(req.headers['x-from-internal'], req.ip)
    if (
      (isFromInternal && process.env.NODE_ENV == 'development') ||
      (isFromInternal && req.ip?.startsWith('172.'))
    ) {
      const userHeader = req.headers['x-auth-user'] as any
      if (userHeader) {
        const decodedUser = Buffer.from(userHeader, 'base64').toString('utf-8')
        const currentUser = JSON.parse(decodedUser)
        req.user = currentUser
      }
      next()
      return
    }

    const authHeader = req.headers['x-auth-user']
    if (!authHeader) {
      throw new UnauthorizedError('you dont have right access')
    }
    try {
      req.user = JSON.parse(
        Buffer.from(authHeader.toString(), 'base64').toString('utf-8')
      )
    } catch {
      throw new ForbiddenError('please signin first')
    }
    if (req.user && Array.isArray(roles) && roles?.length > 0) {
      if (!('roles' in req.user)) {
        throw new UnauthorizedError('you dont have right access')
      }
      if (!req.user.roles.some((item: any) => roles.includes(item as role))) {
        throw new UnauthorizedError('you dont have right access')
      }
    }
    next()
    // @deprecated
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   throw new UnauthorizedError("you dont have right access");
    // }
    // const token = authHeader.split(" ")[1];
    // jwt.verify(
    //   token,
    //   publicKey,
    //   { algorithms: ["RS256"] },
    //   (err, userPayload) => {
    //     const user = userPayload as extendedUserType;
    //     if (err) {
    //       throw new ForbiddenError("please signin first");
    //     }
    //     if (Array.isArray(roles) && roles?.length > 0) {
    //       if (!("roles" in user)) {
    //         throw new UnauthorizedError("you dont have right access");
    //       }
    //       if (!user.roles.some((item) => roles.includes(item as role))) {
    //         throw new UnauthorizedError("you dont have right access");
    //       }
    //     }
    //     req.user = user;
    //     next();
    //   }
    // );
  }
