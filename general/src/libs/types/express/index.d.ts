import { role, user } from '@xprisma/client'
import { ROLE_TYPE } from '@src/libs/constant.lib'
import qs from 'qs'

export declare global {
  type role = (typeof ROLE_TYPE)[number]
  namespace Express {
    export interface Request {
      populatedQuery?: qs.ParsedQs
      user?: user
      ipAddress?: string
      page?: number
      limit?: number
      isInternal: boolean
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      ACCESS_TOKEN_EXPIRY: string
      REFRESH_TOKEN_EXPIRY: string
      WATCH_SERVICE_LIVE_ENDPOINT: string
      REDIS_CHANNEL: string
      DATABASE_URL: string
      PORT: string
      NODE_ENV: 'development' | 'production'
    }
  }
}
